// components/SwapImageWrapper.tsx
"use client";

import { SwapImageDialog } from "./SwapImageDialog";
import { useRouter } from "next/navigation";

type SwapImageWrapperProps = {
  storyPageId: number;
};

export function SwapImageWrapper({ storyPageId }: SwapImageWrapperProps) {
  const router = useRouter();

  const handleImageSelected = (newImageUrl: string) => {
    // Refresh the current route to re-fetch updated data
    router.refresh();
  };

  return (
    <SwapImageDialog
      storyPageId={storyPageId}
      onImageSelected={handleImageSelected}
    />
  );
}
