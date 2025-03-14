export function toKebabCase(str: string): string {
  return str
    .trim() // Remove leading/trailing spaces
    .replace(/['’]s/gi, "-s") // Convert possessive 's to -s
    .replace(/['’]/g, "") // Remove other apostrophes
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters except dashes
    .toLowerCase(); // Convert to lowercase
}
