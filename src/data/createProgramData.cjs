const fs = require('fs');
const path = require('path');

// Read the program.md file
const programContent = fs.readFileSync(path.join(__dirname, '../../docs/program.md'), 'utf-8');

// Split into chapters
const lines = programContent.split('\n');
const chapters = [];
let currentChapter = null;
let contentLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Check if this is a chapter header
  if (line.match(/^(Chapter \d+|Bonus Chapter.*)/)) {
    // Save previous chapter
    if (currentChapter) {
      currentChapter.content = contentLines.join('\n').trim();
      chapters.push(currentChapter);
      contentLines = [];
    }

    // Get title - it could be on the next line or the line after an empty line
    const chapterNum = line;
    let title = '';
    let skipLines = 0;

    // Check next line
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      if (nextLine === '') {
        // Empty line, title is on line after that
        if (i + 2 < lines.length) {
          title = lines[i + 2].trim();
          skipLines = 2;
        }
      } else {
        // Title is on next line
        title = nextLine;
        skipLines = 1;
      }
    }

    // Skip the lines we've read
    i += skipLines;

    currentChapter = {
      id: `chapter-${chapters.length + 1}`,
      number: chapterNum,
      title: title,
      content: ''
    };
  } else if (currentChapter) {
    contentLines.push(lines[i]);
  }
}

// Save last chapter
if (currentChapter) {
  currentChapter.content = contentLines.join('\n').trim();
  chapters.push(currentChapter);
}

// Create TypeScript file
const tsContent = `// Auto-generated from program.md - DO NOT EDIT MANUALLY

export interface Chapter {
  id: string;
  number: string;
  title: string;
  content: string;
}

export const programChapters: Chapter[] = ${JSON.stringify(chapters, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'programData.ts'), tsContent);
console.log(`Created programData.ts with ${chapters.length} chapters`);
