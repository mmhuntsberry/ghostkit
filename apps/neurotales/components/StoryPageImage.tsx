// components/StoryPageImage.tsx
"use client";

import { useState } from "react";
import { SwapImageDialog } from "./SwapImageDialog";

interface StoryPageImageProps {
  initialImageUrl: string;
  altText?: string | null;
  titleText?: string | null;
  storyPageId: number;
}

export function StoryPageImage({
  initialImageUrl,
  altText,
  titleText,
  storyPageId,
}: StoryPageImageProps) {
  console.log("altText", altText);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleImageSelected = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={altText || `Image for story page ${storyPageId}`}
          title={titleText || `Image for story page ${storyPageId}`}
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
