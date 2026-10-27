const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const walk = directory =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(entry =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
const files = [
  ...walk(path.join(root, 'src')).filter(file => /\.tsx?$/.test(file)),
  path.join(root, 'App.tsx'),
  path.join(root, 'index.js'),
];
const known = new Set(files);
const graph = new Map(files.map(file => [file, new Set()]));
function resolveLocal(from, specifier) {
  if (!specifier.startsWith('.')) return [];
  const base = path.resolve(path.dirname(from), specifier);
  const candidates = [base];
  for (const suffix of ['', '.web', '.native', '.android', '.ios']) {
    for (const extension of ['.ts', '.tsx', '.js'])
      candidates.push(
        `${base}${suffix}${extension}`,
        path.join(base, `index${suffix}${extension}`),
      );
  }
  return candidates.filter(file => known.has(file));
}
for (const file of files) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  function visit(node) {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      specifier = node.moduleSpecifier.text;
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) &&
          node.expression.text === 'require')) &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      specifier = node.arguments[0].text;
    if (specifier)
      for (const target of resolveLocal(file, specifier))
        graph.get(file).add(target);
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const entries = [path.join(root, 'App.tsx'), path.join(root, 'index.js')];
// Webpack aliases are additional runtime entry points, not unused modules.
const webpack = ts.createSourceFile(
  'webpack.config.js',
  fs.readFileSync(path.join(root, 'webpack.config.js'), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
);
function aliases(node) {
  if (ts.isStringLiteral(node) && node.text.startsWith('src/')) {
    const file = path.resolve(root, node.text);
    if (known.has(file)) entries.push(file);
  }
  ts.forEachChild(node, aliases);
}
aliases(webpack);
const reached = new Set();
function reach(file) {
  if (reached.has(file)) return;
  reached.add(file);
  for (const target of graph.get(file) || []) reach(target);
}
entries.forEach(reach);
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const errors = files
  .filter(file => !file.endsWith('.d.ts') && !reached.has(file))
  .map(file => `Unused application module: ${relative(file)}`);
const visiting = new Set(),
  done = new Set();
function detectCycles(file, stack) {
  if (visiting.has(file)) {
    errors.push(
      `Import cycle: ${[...stack.slice(stack.indexOf(file)), file]
        .map(relative)
        .join(' -> ')}`,
    );
    return;
  }
  if (done.has(file)) return;
  visiting.add(file);
  for (const target of graph.get(file)) detectCycles(target, [...stack, file]);
  visiting.delete(file);
  done.add(file);
}
files.forEach(file => detectCycles(file, []));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Module checks passed: ${files.length} files, no unreachable modules or import cycles.`,
  );
