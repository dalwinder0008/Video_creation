export interface CleanTranscriptResult {
  cleanedText: string;
  originalCharCount: number;
  cleanedCharCount: number;
  timestampsRemovedCount: number;
  speakerLabelsRemovedCount: number;
  wordCount: number;
}

export function cleanYouTubeTranscript(rawTranscript: string): CleanTranscriptResult {
  if (!rawTranscript || rawTranscript.trim().length === 0) {
    return {
      cleanedText: '',
      originalCharCount: 0,
      cleanedCharCount: 0,
      timestampsRemovedCount: 0,
      speakerLabelsRemovedCount: 0,
      wordCount: 0
    };
  }

  const originalCharCount = rawTranscript.length;

  // 1. Remove bracketed audio / music annotations: [Music], [Applause], (laughter), etc.
  let cleaned = rawTranscript.replace(/\[(?:Music|Applause|Laughter|Silence|Cheering|Groan|Audio)\]/gi, ' ');
  cleaned = cleaned.replace(/\((?:music|applause|laughter|silence|audio)\)/gi, ' ');

  // 2. Count & remove timestamp patterns: 00:12, 1:23, 01:23:45, [00:15], 12:34s, etc.
  const timestampRegex = /(?:\[|\()?(?:\d{1,2}:)?\d{1,2}:\d{2}(?:\]|\))?/g;
  const timestampMatches = rawTranscript.match(timestampRegex) || [];
  const timestampsRemovedCount = timestampMatches.length;
  cleaned = cleaned.replace(timestampRegex, ' ');

  // 3. Count & remove speaker labels: "Speaker 1:", "Host:", "John Doe:", "Narrator:", "[Bob]:"
  const speakerRegex = /(?:^|\n)\s*(?:\[?[A-Za-z0-9\s._-]{2,25}\]?)\s*:\s*/gm;
  const speakerMatches = cleaned.match(speakerRegex) || [];
  const speakerLabelsRemovedCount = speakerMatches.length;
  cleaned = cleaned.replace(speakerRegex, '\n');

  // 4. Remove YouTube transcript auto-generated line breaks and multiple whitespace
  const lines = cleaned.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

  // Deduplicate consecutive identical lines (frequent in auto-generated captions)
  const dedupedLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const current = lines[i];
    if (i === 0 || current !== dedupedLines[dedupedLines.length - 1]) {
      dedupedLines.push(current);
    }
  }

  // Join lines smoothly into coherent paragraphs
  let coherentText = dedupedLines.join(' ');

  // Normalize spaces and punctuation
  coherentText = coherentText
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();

  const words = coherentText.split(/\s+/).filter(Boolean);

  return {
    cleanedText: coherentText,
    originalCharCount,
    cleanedCharCount: coherentText.length,
    timestampsRemovedCount,
    speakerLabelsRemovedCount,
    wordCount: words.length
  };
}
