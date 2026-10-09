const fs = require('fs');
const path = require('path');

function parseMarkdown(md) {
    let html = '';
    const lines = md.split('\n');
    let inList = false;
    let listType = null; 
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    let inCodeBlock = false;
    let codeLang = '';
    let codeContent = [];
    let inBlockquote = false;
    let blockquoteContent = [];

    function parseInline(text) {
        if (!text) return '';
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        escaped = escaped.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
        escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        escaped = escaped.replace(/_([^_]+)_/g, '<em>$1</em>');
        escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
        escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        return escaped;
    }

    function flushList() {
        if (inList) {
            html += `</${listType}>\n`;
            inList = false;
            listType = null;
        }
    }

    function flushTable() {
        if (inTable) {
            html += '<table>\n';
            if (tableHeaders.length > 0) {
                html += '  <thead>\n    <tr>\n';
                tableHeaders.forEach(h => {
                    html += `      <th>${h}</th>\n`;
                });
                html += '    </tr>\n  </thead>\n';
            }
            if (tableRows.length > 0) {
                html += '  <tbody>\n';
                tableRows.forEach(row => {
                    html += '    <tr>\n';
                    row.forEach(cell => {
                        html += `      <td>${cell}</td>\n`;
                    });
                    html += '    </tr>\n';
                });
                html += '  </tbody>\n';
            }
            html += '</table>\n';
            inTable = false;
            tableHeaders = [];
            tableRows = [];
        }
    }

    function flushBlockquote() {
        if (inBlockquote) {
            html += `<blockquote>\n${blockquoteContent.join('\n')}\n</blockquote>\n`;
            inBlockquote = false;
            blockquoteContent = [];
        }
    }

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                const codeStr = codeContent.join('\n');
                if (codeLang === 'mermaid') {
                    html += `<pre class="mermaid">\n${codeStr}\n</pre>\n`;
                } else {
                    html += `<pre><code class="language-${codeLang}">${codeStr}</code></pre>\n`;
                }
                inCodeBlock = false;
                codeContent = [];
                codeLang = '';
            } else {
                inCodeBlock = true;
                codeLang = line.trim().substring(3).trim();
            }
            continue;
        }

        if (inCodeBlock) {
            let escapedLine = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            codeContent.push(escapedLine);
            continue;
        }

        if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
            flushList();
            flushTable();
            flushBlockquote();
            html += '<hr />\n';
            continue;
        }

        const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
            flushList();
            flushTable();
            flushBlockquote();
            const level = headerMatch[1].length;
            const content = parseInline(headerMatch[2]);
            html += `<h${level}>${content}</h${level}>\n`;
            continue;
        }

        if (line.trim().startsWith('>')) {
            flushList();
            flushTable();
            inBlockquote = true;
            let content = line.trim().substring(1).trim();
            const alertMatch = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
            if (alertMatch) {
                const alertType = alertMatch[1].toUpperCase();
                content = content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i, '').trim();
                blockquoteContent.push(`<div class="alert-badge alert-${alertType.toLowerCase()}">${alertType}</div>`);
            }
            blockquoteContent.push(parseInline(content));
            continue;
        } else if (inBlockquote && line.trim() !== '') {
            blockquoteContent.push(parseInline(line.trim()));
            continue;
        } else if (inBlockquote && line.trim() === '') {
            flushBlockquote();
            continue;
        }

        const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|');
        if (isTableRow) {
            flushList();
            flushBlockquote();
            inTable = true;
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            
            const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
            if (isSeparator) {
                continue;
            }

            if (tableHeaders.length === 0) {
                tableHeaders = cells.map(c => parseInline(c));
            } else {
                tableRows.push(cells.map(c => parseInline(c)));
            }
            continue;
        } else if (inTable && !isTableRow) {
            flushTable();
        }

        const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
        const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

        if (unorderedMatch) {
            flushTable();
            flushBlockquote();
            if (!inList || listType !== 'ul') {
                flushList();
                inList = true;
                listType = 'ul';
                html += '<ul>\n';
            }
            html += `  <li>${parseInline(unorderedMatch[2])}</li>\n`;
            continue;
        } else if (orderedMatch) {
            flushTable();
            flushBlockquote();
            if (!inList || listType !== 'ol') {
                flushList();
                inList = true;
                listType = 'ol';
                html += '<ol>\n';
            }
            html += `  <li>${parseInline(orderedMatch[2])}</li>\n`;
            continue;
        } else if (inList && line.trim() === '') {
            flushList();
            continue;
        } else if (inList && !unorderedMatch && !orderedMatch) {
            flushList();
        }

        if (line.trim() === '') {
            flushList();
            flushTable();
            flushBlockquote();
            continue;
        }

        flushList();
        flushTable();
        flushBlockquote();
        html += `<p>${parseInline(line.trim())}</p>\n`;
    }

    flushList();
    flushTable();
    flushBlockquote();

    return html;
}

function wrapHTML(title, contentHTML) {
    return `<!DOCTYPE html>
<html lang="id" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - GSI One Dokumentasi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
  </script>
  <style>
    :root {
      --bg-primary: #0b1329;
      --bg-card: #111c44;
      --border: #1e295d;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --accent: #e8722a;
    }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      margin: 0;
      padding: 2rem;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }
    h1, h2, h3, h4 { color: #fff; margin-top: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    h1 { border-bottom: 2px solid var(--accent); }
    a { color: var(--accent); text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
    p { margin-bottom: 1.25rem; }
    code {
      font-family: monospace;
      background: rgba(232, 114, 42, 0.1);
      color: var(--accent);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre {
      background: #070d19;
      border: 1px solid var(--border);
      padding: 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 1.5rem;
    }
    pre code {
      background: none;
      color: var(--text-primary);
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      text-align: left;
    }
    th {
      background-color: rgba(30, 41, 93, 0.5);
      color: #fff;
    }
    blockquote {
      border-left: 4px solid var(--accent);
      background: rgba(232, 114, 42, 0.05);
      margin: 1.5rem 0;
      padding: 1rem 1.5rem;
      border-radius: 0 8px 8px 0;
    }
    .alert-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .alert-note { background: #3b82f6; color: #fff; }
    .alert-tip { background: #10b981; color: #fff; }
    .alert-warning { background: #f59e0b; color: #fff; }
    .alert-important { background: #8b5cf6; color: #fff; }
    .alert-caution { background: #ef4444; color: #fff; }
    .diagram-img-container {
      margin-top: 1rem;
      padding: 1.5rem;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 8px;
      display: flex;
      justify-content: center;
    }
    .diagram-img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="container">
    ${contentHTML}
  </div>
</body>
</html>`;
}

function getTitleFromPath(filePath) {
    const baseName = path.basename(filePath, '.md');
    return baseName.replace(/_/g, ' ');
}

function getCategoryFromDir(dirPath) {
    const baseName = path.basename(dirPath);
    return baseName.replace(/^(\d+)_/, '$1. ').replace(/_/g, ' ');
}

const docsDir = path.join(__dirname);
const categories = [
    '01_Project_Planning',
    '02_Requirements',
    '03_Architecture_Design',
    '04_Development',
    '05_Quality_Assurance',
    '06_Testing',
    '07_Deployment',
    '08_Maintenance',
    '09_User_Documentation',
    '10_Quality_Model'
];

const docsData = {};

const topLevelFiles = [
    'README.md'
];

topLevelFiles.forEach(file => {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`Processing top-level: ${file}`);
        const mdContent = fs.readFileSync(filePath, 'utf8');
        const htmlContent = parseMarkdown(mdContent);
        const title = getTitleFromPath(filePath);

        const htmlFilePath = filePath.replace(/\.md$/, '.html');
        fs.writeFileSync(htmlFilePath, wrapHTML(title, htmlContent), 'utf8');

        docsData[file] = {
            title: title,
            category: "General",
            categoryId: "general",
            fileName: file,
            content: mdContent,
            contentHtml: htmlContent
        };
    }
});

categories.forEach(categoryDirName => {
    const categoryPath = path.join(docsDir, categoryDirName);
    if (fs.existsSync(categoryPath)) {
        console.log(`Scanning category folder: ${categoryDirName}`);
        
        function scanDir(currentPath, relPrefix = '') {
            const files = fs.readdirSync(currentPath);
            files.forEach(file => {
                const fullPath = path.join(currentPath, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (file !== 'images') {
                        scanDir(fullPath, path.join(relPrefix, file));
                    }
                } else if (file.endsWith('.md')) {
                    const relativeKey = path.join(categoryDirName, relPrefix, file).replace(/\\/g, '/');
                    console.log(`- Converting: ${relativeKey}`);
                    
                    const mdContent = fs.readFileSync(fullPath, 'utf8');
                    const htmlContent = parseMarkdown(mdContent);
                    let title = getTitleFromPath(file);
                    if (relPrefix.includes('UML')) {
                        title = `UML - ${title}`;
                    } else if (relPrefix.includes('ADR')) {
                        title = `ADR - ${title}`;
                    } else if (relPrefix.includes('SLO')) {
                        title = `SLO - ${title}`;
                    }

                    const htmlFilePath = fullPath.replace(/\.md$/, '.html');
                    fs.writeFileSync(htmlFilePath, wrapHTML(title, htmlContent), 'utf8');

                    docsData[relativeKey] = {
                        title: title,
                        category: getCategoryFromDir(categoryPath),
                        categoryId: categoryDirName,
                        fileName: file,
                        content: mdContent,
                        contentHtml: htmlContent
                    };
                }
            });
        }
        
        scanDir(categoryPath);
    }
});

const docsDataJsPath = path.join(docsDir, 'docs_data.js');
const fileContent = `// Auto-generated docs data for GSI One Docs Viewer\nwindow.GSI_DOCS_DATA = ${JSON.stringify(docsData, null, 2)};\n`;
fs.writeFileSync(docsDataJsPath, fileContent, 'utf8');
console.log(`\nSuccess! Generated index file at ${docsDataJsPath}`);
