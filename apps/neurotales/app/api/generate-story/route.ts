import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "../../../db";
import { stories, storyPages } from "../../../db/schema";
import { fetchBestPecsImages } from "../../utils/fetchPecsImages";

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

    // Prompt creation
    const prompt = `
      Generate a friendly social story titled "${title}" about "${scenario}" for a child named ${childName}, 
      who is ${age} years old and uses the pronouns ${pronouns}. 
      Include special considerations: ${specialNeedsDetails || "none"}. 
      Separate the story into 4-5 pages clearly.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const storyText = aiResponse.choices[0].message.content.trim();

    // Split the AI response into pages
    const pages = storyText.split(/\n{2,}/);

    // Fetch relevant images from Cloudinary
    const { pecs } = await fetchBestPecsImages(storyText);

    // Save the story
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

    // Insert pages into DB
    await Promise.all(
      pages.map(async (content, idx) => {
        const keyConcepts = Object.keys(pecs);
        const imageUrl = pecs[keyConcepts[idx]] || null;

        await db.insert(storyPages).values({
          storyId: newStory.id,
          pageNumber: idx + 1,
          content,
          imageUrl,
          imageSource: imageUrl ? "cloudinary" : null,
        });
      })
    );

    return NextResponse.json({ storyId: newStory.id }, { status: 200 });
  } catch (error) {
    console.error("Error generating or saving story:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
