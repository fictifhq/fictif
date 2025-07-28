// scripts/buildDocsForLLM.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';

const DOCS_ROOT = 'docs';
const OUTPUT_FILE = 'LLM.md';
const README_PATH = 'README.md';

async function main() {
  console.log('Starting LLM documentation build...');

  // 1. Get a sorted list of all markdown files in the docs directory
  const docFiles = await fg(`${DOCS_ROOT}/**/*.md`, {
    ignore: ['**/node_modules/**'],
    absolute: false,
    // Sort files to ensure a consistent order.
    // This simple sort works well for your structure.
    // Deeper nesting might require a more complex sorting algorithm.
    compare: (a, b) => a.localeCompare(b),
  });

  console.log(`Found ${docFiles.length} documentation files.`);

  // 2. Read the main README.md file first
  let combinedContent = 'LLM.md -- This file is supposed to be given for LLMs to index, it combines all the documentation, just upload or reference it to an LLM of your choice\n\n';
  try {
    const readmeContent = await fs.readFile(README_PATH, 'utf-8');
    combinedContent += `<!-- START: ${README_PATH} -->\n`;
    combinedContent += readmeContent;
    combinedContent += `\n<!-- END: ${README_PATH} -->\n\n`;
    console.log(`- Appended ${README_PATH}`);
  } catch (error) {
    console.error(`Error reading ${README_PATH}:`, error);
    // Continue without it if it's missing
  }

  // 3. Iterate through the doc files, read them, and append their content
  for (const file of docFiles) {
    // Skip the main README if it's also in the docs folder to avoid duplication
    if (path.basename(file).toLowerCase() === 'readme.md') {
      continue;
    }

    try {
      const content = await fs.readFile(file, 'utf-8');
      combinedContent += `<!-- START: ${file} -->\n`;
      combinedContent += `# ${path.basename(file, '.md').replace(/-/g, ' ')}\n\n`; // Add a title based on the filename
      combinedContent += content;
      combinedContent += `\n<!-- END: ${file} -->\n\n`;
      console.log(`- Appended ${file}`);
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  }

  // 4. Write the combined content to the output file
  try {
    await fs.writeFile(OUTPUT_FILE, combinedContent, 'utf-8');
    console.log(`\n✅ Successfully created ${OUTPUT_FILE} with all documentation combined.`);
  } catch (error) {
    console.error(`Error writing to ${OUTPUT_FILE}:`, error);
  }
}

main().catch(err => {
  console.error('Build script failed:', err);
  process.exit(1);
});