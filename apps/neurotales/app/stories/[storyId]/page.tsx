// apps/neurotales/app/stories/[storyId]/page.tsx
import { Suspense } from "react";
import StoryContent from "../../../components/StoryContent";

interface StoryPageProps {
  params: Promise<{ storyId: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { storyId } = await params;
  const id = Number(storyId);

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <StoryContent storyId={id} />
    </Suspense>
  );
}
