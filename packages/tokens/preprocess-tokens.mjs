// /Users/matt.huntsberry/Desktop/ghostkit/packages/tokens/preprocess-tokens.mjs

import fs from "fs";
import path from "path";

const INPUT = path.resolve("tokens_new/primitives.White Label.json");
const OUTPUT_DIR = path.resolve("tokens_preprocessed");
const OUTPUT = path.join(OUTPUT_DIR, "primitives.json");

let data = JSON.parse(fs.readFileSync(INPUT, "utf-8"));

// 1️⃣ _opacity → $type:'opacity' & normalize to 0–1
Object.entries(data._opacity).forEach(([key, tok]) => {
  tok.$type = "opacity";
  if (typeof tok.$value === "number") {
    tok.$value = tok.$value / 100;
  }
});

// 2️⃣ _size → $type:'dimension' (will use px)
Object.entries(data._size).forEach(([key, tok]) => {
  tok.$type = "dimension";
});

// 3️⃣ _font.size → $type:'fontSize'
Object.entries(data._font.size).forEach(([key, tok]) => {
  tok.$type = "fontSize";
});

// 4️⃣ _font.weight → $type:'fontWeight'
Object.entries(data._font.weight).forEach(([key, tok]) => {
  tok.$type = "fontWeight";
});

// 5️⃣ _font.family → $type:'string' (leave value alone)
Object.entries(data._font.family).forEach(([key, tok]) => {
  tok.$type = "string";
});

// 6️⃣ _palette → $type:'color'
Object.entries(data._palette).forEach(([group, shades]) => {
  Object.entries(shades).forEach(([key, tok]) => {
    tok.$type = "color";
  });
});

// Write out the preprocessed tokens
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
console.log("✅ Tokens preprocessed to", OUTPUT);
