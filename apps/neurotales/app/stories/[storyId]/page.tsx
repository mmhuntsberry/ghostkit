import { db } from "../../../db";
import { stories, storyPages } from "../../../db/schema";
import { eq, asc } from "drizzle-orm";

async function getStory(storyId: number) {
  const story = await db.query.stories.findFirst({
    where: eq(stories.id, storyId),
    with: { pages: { orderBy: [asc(storyPages.pageNumber)] } },
  });

  if (!story) throw new Error("Story not found");

  return story;
}

export default async function StoryPage({
  params,
}: {
  params: { storyId: string };
}) {
  const storyId = parseInt(params.storyId);
  const story = await getStory(storyId);

  return (
    <div>
      <h1>{story.title}</h1>
      <p>{story.scenario}</p>
      {story.pages.map((page) => (
        <div key={page.id}>
          <h2>Page {page.pageNumber}</h2>
          <p>{page.content}</p>
          {page.imageUrl && (
            <img
              src={page.imageUrl}
              alt={`Image for page ${page.pageNumber}`}
              style={{ width: "100%", maxWidth: "400px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
