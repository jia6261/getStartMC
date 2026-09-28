/* Generate the searchable heading index for the static docs site. */
const fs = require('node:fs/promises');
const path = require('node:path');

async function readHTMLFile(filePath) {
  try {
    const html = await fs.readFile(filePath, 'utf-8');
    const keywords = [];
    const headingPattern = /<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi;
    let match;

    while ((match = headingPattern.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      if (text) keywords.push(text);
    }

    const relativeDirectory = path.relative('./docs', path.dirname(filePath));
    const route = relativeDirectory
      ? `docs/${relativeDirectory.split(path.sep).join('/')}/`
      : 'docs/';

    return { href: `docs/?Path=${route}`, key_words: keywords };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

async function walk(directory, output) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    console.error(`Unable to read directory ${directory}:`, error.message);
    return;
  }

  entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, output);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
      const item = await readHTMLFile(fullPath);
      if (item) output.push(item);
    }
  }
}

async function main() {
  const index = [];
  await walk('./docs', index);
  await fs.writeFile('./json/search_key_words.json', `${JSON.stringify(index, null, 2)}\n`, 'utf-8');
  console.log(`Wrote ${index.length} document entries to json/search_key_words.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
