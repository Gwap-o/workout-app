import programContent from './programContent.md?raw';

export interface Chapter {
  id: string;
  number: string;
  title: string;
  content: string;
}

export function parseProgram(): Chapter[] {
  const chapters: Chapter[] = [];

  // Split by chapter headers (lines that start with "Chapter" or "Bonus Chapter")
  const lines = programContent.split('\n');
  let currentChapter: Chapter | null = null;
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is a chapter header
    if (line.match(/^(Chapter \d+|Bonus Chapter.*)/)) {
      // Save the previous chapter if it exists
      if (currentChapter) {
        currentChapter.content = contentLines.join('\n').trim();
        chapters.push(currentChapter);
        contentLines = [];
      }

      // Get the chapter number/title from this line and the next line
      const chapterLine = line;
      const titleLine = lines[i + 1] || '';

      // Skip the title line in next iteration
      i++;

      // Create new chapter
      currentChapter = {
        id: `chapter-${chapters.length + 1}`,
        number: chapterLine,
        title: titleLine,
        content: ''
      };
    } else if (currentChapter) {
      // Add content to current chapter
      contentLines.push(line);
    }
  }

  // Don't forget the last chapter
  if (currentChapter) {
    currentChapter.content = contentLines.join('\n').trim();
    chapters.push(currentChapter);
  }

  return chapters;
}
