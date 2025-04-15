import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "../../../db";
import { stories, storyPages } from "../../../db/schema";
import { fetchBestPecsImagesSemantic } from "../../../lib/cloudinary";

import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      scenario,
      childName,
      age,
      pronouns,
      specialNeedsDetails,
      userId,
    } = await req.json();

    // Build a prompt for the AI to generate a story
    const prompt = `
      Generate a friendly, concise social story titled "${title}" about "${scenario}" 
      for ${childName}, age ${age}, pronouns ${pronouns}. 
      Special considerations: ${specialNeedsDetails || "none"}. 
      Please split the story clearly into 4-5 paragraphs, each representing a page.
    `;

    // Generate story text using OpenAI Chat API
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const storyText = aiResponse.choices[0].message.content.trim();
    // Split the story into pages by detecting double line breaks
    const pages = storyText.split(/\n{2,}/);

    // Use semantic search to fetch best images for the story text
    const { pecs } = await fetchBestPecsImagesSemantic(storyText);

    // Save the main story record into the database
    const [newStory] = await db
      .insert(stories)
      .values({
        title,
        scenario,
        childName,
        age,
        pronouns,
        specialNeedsDetails,
        userId,
      })
      .returning();

    // Save each story page along with the paired image URL
    await Promise.all(
      pages.map(async (content, idx) => {
        // Use the image for this page based on the index in the semantic mapping
        const imageUrl = pecs[idx.toString()] || null;
        await db.insert(storyPages).values({
          storyId: newStory.id,
          pageNumber: idx + 1,
          content,
          imageUrl,
          imageSource: imageUrl ? "cloudinary" : null,
        });
      })
    );

    return NextResponse.json({ storyId: newStory.id });
  } catch (error) {
    console.error("Error generating or saving story:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
