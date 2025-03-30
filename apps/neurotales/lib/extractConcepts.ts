export function extractKeyConcepts(story: string): string[] {
  const stopWords = [
    "a",
    "an",
    "the",
    "and",
    "about",
    "how",
    "is",
    "going",
    "on",
    "his",
    "her",
    "their",
    "with",
    "to",
  ];

  return story
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => !stopWords.includes(word));
}
