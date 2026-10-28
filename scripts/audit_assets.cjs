const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const assetDirectory = path.join(root, 'assets');
const assetExtension = /\.(gif|jpe?g|png|svg|webp|ttf|otf|mp4)$/i;
const walk = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
const assets = walk(assetDirectory).filter(file => assetExtension.test(file));
const known = new Set(assets);
const used = new Set();
const errors = new Set();
const files = new Set(
  execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd: root, encoding: 'utf8' },
  )
    .split('\0')
    .filter(
      file =>
        file &&
        !file.startsWith('assets/') &&
        /\.(tsx?|[cm]?jsx?|json|md|sql|html|xml|gradle|plist|pbxproj|ya?ml|sh)$/.test(
          file,
        ) &&
        fs.existsSync(path.join(root, file)),
    ),
);
for (const file of files) {
  const absoluteFile = path.join(root, file);
  const contents = fs.readFileSync(absoluteFile, 'utf8');
  if (/\.(?:[cm]?js|jsx|ts|tsx)$/.test(file)) {
    const source = ts.createSourceFile(
      file,
      contents,
      ts.ScriptTarget.Latest,
      true,
    );
    function visit(node) {
      if (
        ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node)
      ) {
        let candidate;
        if (node.text.startsWith('.'))
          candidate = path.resolve(path.dirname(absoluteFile), node.text);
        else if (node.text.startsWith('assets/'))
          candidate = path.resolve(root, node.text);
        if (known.has(candidate)) used.add(candidate);
        else if (
          candidate?.startsWith(`${assetDirectory}${path.sep}`) &&
          assetExtension.test(candidate) &&
          !fs.existsSync(candidate)
        )
          errors.add(`Missing asset in ${file}: ${node.text}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  // Seed tools and documentation can reference root-relative asset paths.
  for (const asset of assets) {
    const relative = path.relative(root, asset).split(path.sep).join('/');
    if (contents.includes(relative)) used.add(asset);
  }
}
for (const asset of assets)
  if (!used.has(asset))
    errors.add(`Unused asset: ${path.relative(root, asset)}`);
if (errors.size) {
  console.error([...errors].join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Asset checks passed: ${assets.length} assets, no missing or unreferenced files.`,
  );
