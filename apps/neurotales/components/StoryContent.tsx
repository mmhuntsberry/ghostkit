// components/stories/StoryContent.tsx
import { db } from "../db";
import { stories, storyPages } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";

interface StoryContentProps {
  storyId: number;
}

export default async function StoryContent({ storyId }: StoryContentProps) {
  const [story] = await db
    .select()
    .from(stories)
    .where(eq(stories.id, storyId));

  const pages = await db
    .select()
    .from(storyPages)
    .where(eq(storyPages.storyId, storyId))
    .orderBy(asc(storyPages.pageNumber));

  if (!story) return <div className="p-6">Story not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
      <p className="mb-4 text-gray-700">{story.scenario}</p>

      {pages.map((page) => (
        <div key={page.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Page {page.pageNumber}</h2>
          {page.imageUrl && (
            <Image
              src={page.imageUrl}
              alt={`Page ${page.pageNumber} image`}
              width={300}
              height={300}
              className="mb-4 rounded"
            />
          )}
          <p>{page.content}</p>
        </div>
      ))}
    </div>
  );
}
