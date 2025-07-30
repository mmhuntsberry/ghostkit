// /Users/matthewhuntsberry/Desktop/projects/ghostkit/apps/neurotales/components/StoryContent.tsx

import { cache, use } from "react";
import { db } from "@/db"; // use alias (or "../../../db")
import { stories, storyPages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import { SwapImageWrapper } from "./SwapImageWrapper";

interface StoryContentProps {
  storyId: number;
}

// Cached data fetching functions
const fetchStory = cache(async (storyId: number) => {
  return db.query.stories.findFirst({
    where: eq(stories.id, Number(storyId)),
  });
});

const fetchPages = cache(async (storyId: number) => {
  return db.query.storyPages.findMany({
    where: eq(storyPages.storyId, storyId),
    orderBy: [asc(storyPages.pageNumber)],
  });
});

export default function StoryContent({ storyId }: StoryContentProps) {
  // Use the new use() hook for data fetching
  const story = use(fetchStory(storyId));
  if (!story) {
    return <div className="p-6">Story not found.</div>;
  }
  const pages = use(fetchPages(storyId));

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
      <p className="mb-4 text-gray-700">{story.scenario}</p>

      {pages.map((page) => (
        <div key={page.id} className="mb-6  p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Page {page.pageNumber}</h2>

          {page.imageUrl && <SwapImageWrapper storyPageId={page.id} />}

          <p>{page.content}</p>
        </div>
      ))}
    </div>
  );
}
