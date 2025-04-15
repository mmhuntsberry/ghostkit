// components/SwapImageDialog.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect, ChangeEvent } from "react";

export type Image = {
  url: string;
  name: string;
};

export type SwapImageDialogProps = {
  storyPageId: number;
  onImageSelected: (imageUrl: string) => void;
};

export function SwapImageDialog({
  storyPageId,
  onImageSelected,
}: SwapImageDialogProps) {
  // PECS images from Cloudinary
  const [pecsImages, setPecsImages] = useState<Image[]>([]);
  const [pecsSearchQuery, setPecsSearchQuery] = useState("");

  // Pexels images
  const [pexelsImages, setPexelsImages] = useState<Image[]>([]);
  const [pexelsQuery, setPexelsQuery] = useState("");

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch PECS images from Cloudinary
  const fetchPecsImages = async () => {
    try {
      const res = await fetch("/api/pecs-images");
      const data = await res.json();
      setPecsImages(data.images);
    } catch (error) {
      console.error("Error fetching PECS images:", error);
    }
  };

  // Fetch Pexels images (pass query parameter)
  const fetchPexelsImages = async (query: string) => {
    try {
      const res = await fetch(
        `/api/pexels-images?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setPexelsImages(data.images);
    } catch (error) {
      console.error("Error fetching Pexels images:", error);
    }
  };

  // Fetch PECS images on mount
  useEffect(() => {
    fetchPecsImages();
  }, []);

  // Filter images based on search query for PECS tab
  const filteredPecs = pecsImages.filter((img) =>
    img.name.toLowerCase().includes(pecsSearchQuery.toLowerCase())
  );

  // Filter images for Pexels tab
  const filteredPexels = pexelsImages.filter((img) =>
    img.name.toLowerCase().includes(pexelsQuery.toLowerCase())
  );

  // Handle image selection from any tab
  const handleSelect = async (imageUrl: string) => {
    try {
      await fetch(`/api/story-pages/${storyPageId}/image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      onImageSelected(imageUrl);
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  // Handle file input change for upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        await handleSelect(data.url);
        onImageSelected(data.url);
      } else {
        console.error("Upload failed", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-sm text-blue-600 underline">Swap Image</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[80vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">
            Select a New Image
          </Dialog.Title>

          <Tabs.Root defaultValue="pecs">
            <Tabs.List className="flex gap-2 border-b mb-4">
              <Tabs.Trigger
                value="pecs"
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                PECS
              </Tabs.Trigger>
              <Tabs.Trigger
                value="pexels"
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Pexels
              </Tabs.Trigger>
              <Tabs.Trigger
                value="upload"
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Upload
              </Tabs.Trigger>
            </Tabs.List>

            {/* PECS Tab */}
            <Tabs.Content value="pecs" className="mt-4">
              <input
                type="text"
                placeholder="Search PECS images..."
                value={pecsSearchQuery}
                onChange={(e) => setPecsSearchQuery(e.target.value)}
                className="mb-4 w-full border rounded px-2 py-1"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPecs.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => handleSelect(img.url)}
                    className="hover:opacity-80 transition"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full rounded border"
                    />
                    <p className="text-xs text-center mt-1">{img.name}</p>
                  </button>
                ))}
              </div>
            </Tabs.Content>

            {/* Pexels Tab */}
            <Tabs.Content value="pexels" className="mt-4">
              <input
                type="text"
                placeholder="Search Pexels images..."
                value={pexelsQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPexelsQuery(e.target.value)
                }
                className="mb-4 w-full border rounded px-2 py-1"
              />
              <button
                onClick={() => fetchPexelsImages(pexelsQuery)}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 mb-4"
              >
                Search
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPexels.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => handleSelect(img.url)}
                    className="hover:opacity-80 transition"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full rounded border"
                    />
                    <p className="text-xs text-center mt-1">{img.name}</p>
                  </button>
                ))}
              </div>
            </Tabs.Content>

            {/* Upload Tab */}
            <Tabs.Content value="upload" className="mt-4">
              <p className="mb-2">Upload your own image:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </Tabs.Content>
          </Tabs.Root>

          <Dialog.Close asChild>
            <button className="mt-6 block mx-auto text-sm underline">
              Cancel
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SwapImageDialog;
