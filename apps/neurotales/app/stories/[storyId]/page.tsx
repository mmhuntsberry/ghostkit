// app/stories/[storyId]/page.tsx

import { db } from "../../../db";
import { stories, storyPages } from "../../../db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { StoryPageImage } from "../../../components/StoryPageImage"; // or your image component

interface StoryPageProps {
  params: Promise<{ storyId: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function fetchStoryWithPage(storyId: number, page: number) {
  const story = await db.query.stories.findFirst({
    where: eq(stories.id, storyId),
  });

  const pages = await db.query.storyPages.findMany({
    where: eq(storyPages.storyId, storyId),
    orderBy: [asc(storyPages.pageNumber)],
  });

  const currentPage = pages[page - 1];

  return { story, currentPage, totalPages: pages.length };
}

export default async function StoryPage({
  params,
  searchParams,
}: StoryPageProps) {
  const { storyId } = await params;
  const { page } = await searchParams;

  const storyIdNum = parseInt(storyId);
  const currentPageNum = parseInt(page || "1");

  const { story, currentPage, totalPages } = await fetchStoryWithPage(
    storyIdNum,
    currentPageNum
  );

  if (!story || !currentPage) return notFound();

  // Pagination logic
  const prevPage = currentPageNum > 1 ? currentPageNum - 1 : null;
  const nextPage = currentPageNum < totalPages ? currentPageNum + 1 : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Story Title & Scenario */}
      <h1 className="text-3xl font-bold mb-2 text-center">{story.title}</h1>
      <p className="text-gray-600 text-center mb-6">{story.scenario}</p>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <a
          href={prevPage ? `?page=${prevPage}` : "#"}
          className={`px-3 py-1 rounded border text-sm ${
            prevPage
              ? "text-blue-600 hover:bg-blue-50"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          ←
        </a>
        <span className="text-sm">
          Page {currentPage.pageNumber} of {totalPages}
        </span>
        <a
          href={nextPage ? `?page=${nextPage}` : "#"}
          className={`px-3 py-1 rounded border text-sm ${
            nextPage
              ? "text-blue-600 hover:bg-blue-50"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          →
        </a>
      </div>

      {/* Display the page content and the image swap feature */}
      <div className="flex flex-col items-center gap-6 mb-6">
        {/* Show the page's image plus the swap button */}
        {currentPage.imageUrl && (
          <StoryPageImage
            initialImageUrl={currentPage.imageUrl}
            storyPageId={currentPage.id}
          />
        )}
        <p className="w-full text-lg leading-relaxed text-center lg:text-left">
          {currentPage.content}
        </p>
      </div>
    </div>
  );
}
