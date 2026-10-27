const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function walk(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(entry =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
}
const violations = [];
const files = walk(path.join(root, 'src')).filter(file => /\.tsx?$/.test(file));
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  function report(node, message) {
    const { line } = source.getLineAndCharacterOfPosition(
      node.getStart(source),
    );
    violations.push(`${relative}:${line + 1} ${message}`);
  }
  function visit(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword)
      report(node, 'Use an explicit type or narrow unknown.');
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const specifier = node.moduleSpecifier.text;
      const target = specifier.startsWith('.')
        ? path
            .relative(root, path.resolve(path.dirname(file), specifier))
            .replaceAll('\\', '/')
        : specifier;
      if (target.includes('test/mocks'))
        report(node, 'Production code must not import test mocks.');
      if (
        relative.startsWith('src/domain/') &&
        !target.startsWith('src/domain/')
      )
        report(
          node,
          'Domain must not depend on application, infrastructure, React or platform APIs.',
        );
      if (
        relative.startsWith('src/screens/') &&
        /config\/supabase|infrastructure\/|async-storage/.test(target)
      )
        report(
          node,
          'Screens must access persistence through application actions.',
        );
      if (
        relative.startsWith('src/infrastructure/') &&
        /src\/(screens|hooks|store|services)\//.test(target)
      )
        report(
          node,
          'Infrastructure must not depend on presentation or application services.',
        );
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Architecture checks passed for all ${files.length} production TypeScript modules.`,
  );
