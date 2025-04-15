// components/StoryPageImage.tsx
"use client";

import { useState } from "react";
import { SwapImageDialog } from "./SwapImageDialog";

interface StoryPageImageProps {
  initialImageUrl: string;
  storyPageId: number;
}

export function StoryPageImage({
  initialImageUrl,
  storyPageId,
}: StoryPageImageProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleImageSelected = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Image for story page ${storyPageId}`}
          className="rounded-md w-full max-w-sm mx-auto"
        />
      )}
      <SwapImageDialog
        storyPageId={storyPageId}
        onImageSelected={handleImageSelected}
      />
    </div>
  );
}

export default StoryPageImage;
