export interface AdvisorFormattedSection {
  title: string;
  lines: string[];
}

const SECTION_TITLES = [
  "answer",
  "data",
  "sources",
  "confidence",
  "disclaimer",
] as const;

const SECTION_TITLE_MAP: Record<(typeof SECTION_TITLES)[number], string> = {
  answer: "Answer",
  data: "Data",
  sources: "Sources",
  confidence: "Confidence",
  disclaimer: "Disclaimer",
};

function sanitizeInlineFormatting(input: string): string {
  return input
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\s*[*-]\s+/, "- ")
    .replace(/\s{2,}/g, " ")
    .trimEnd();
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);
}

function isTableDividerRow(cells: string[]): boolean {
  return (
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell))
  );
}

function convertTableBlock(tableLines: string[]): string[] {
  const rows = tableLines
    .map(parseTableRow)
    .filter((cells) => cells.length > 0);

  if (rows.length === 0) return [];
  if (rows.length === 1) {
    return [`- ${rows[0].join(" | ")}`];
  }

  const header = rows[0];
  const startDataAt = rows[1] && isTableDividerRow(rows[1]) ? 2 : 1;

  const formatted: string[] = [];
  for (let index = startDataAt; index < rows.length; index += 1) {
    const row = rows[index];
    if (row.length === 0) continue;

    const rowTitle = row[0];
    const details = row.slice(1).map((value, cellIndex) => {
      const key = header[cellIndex + 1] || `Field ${cellIndex + 2}`;
      return `${key}: ${value}`;
    });

    if (details.length > 0) {
      formatted.push(`- ${rowTitle} - ${details.join("; ")}`);
    } else {
      formatted.push(`- ${row.join(" | ")}`);
    }
  }

  return formatted;
}

function flattenMarkdownTables(rawLines: string[]): string[] {
  const output: string[] = [];

  for (let index = 0; index < rawLines.length; ) {
    const line = rawLines[index].trim();

    if (!line.startsWith("|")) {
      output.push(rawLines[index]);
      index += 1;
      continue;
    }

    const tableBlock: string[] = [];
    while (index < rawLines.length && rawLines[index].trim().startsWith("|")) {
      tableBlock.push(rawLines[index].trim());
      index += 1;
    }

    output.push(...convertTableBlock(tableBlock));
  }

  return output;
}

function detectSectionHeader(input: string): string | null {
  const cleaned = sanitizeInlineFormatting(input)
    .trim()
    .replace(/^\d+[.)]\s*/, "")
    .replace(/:$/, "")
    .toLowerCase();

  for (const section of SECTION_TITLES) {
    if (cleaned === section) {
      return SECTION_TITLE_MAP[section];
    }
  }

  return null;
}

function normalizeSpacing(lines: string[]): string[] {
  const result: string[] = [];
  let lastWasBlank = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (!lastWasBlank) {
        result.push("");
      }
      lastWasBlank = true;
      continue;
    }

    result.push(trimmed);
    lastWasBlank = false;
  }

  while (result.length > 0 && result[result.length - 1] === "") {
    result.pop();
  }

  return result;
}

function cleanSectionLines(lines: string[]): string[] {
  const cleaned = normalizeSpacing(lines);
  if (cleaned.length === 0) {
    return [];
  }

  if (cleaned[cleaned.length - 1] === "") {
    cleaned.pop();
  }

  return cleaned;
}

export function formatAdvisorSections(rawContent: string): AdvisorFormattedSection[] {
  const preparedLines = flattenMarkdownTables(rawContent.replace(/\r\n/g, "\n").split("\n"))
    .map((line) => sanitizeInlineFormatting(line));

  const sections: AdvisorFormattedSection[] = [];
  let currentSection: AdvisorFormattedSection | null = null;

  for (const line of preparedLines) {
    const detectedTitle = detectSectionHeader(line);
    if (detectedTitle) {
      currentSection = { title: detectedTitle, lines: [] };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = { title: "Answer", lines: [] };
      sections.push(currentSection);
    }

    currentSection.lines.push(line);
  }

  return sections
    .map((section) => ({
      ...section,
      lines: cleanSectionLines(section.lines),
    }))
    .filter((section) => section.lines.length > 0);
}

export function formatUserMessage(rawContent: string): string {
  return normalizeSpacing(rawContent.replace(/\r\n/g, "\n").split("\n"))
    .join("\n")
    .trim();
}
