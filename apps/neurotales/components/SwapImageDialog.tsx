// apps/neurotales/components/SwapImageDialog.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect } from "react";

interface Image {
  url: string;
  name: string;
}

interface SwapImageDialogProps {
  storyPageId: number;
  onImageSelected: (url: string) => void;
}

export function SwapImageDialog({
  storyPageId,
  onImageSelected,
}: SwapImageDialogProps) {
  const [pecsSearchQuery, setPecsSearchQuery] = useState("");
  const [pecsImages, setPecsImages] = useState<Image[]>([]);
  const [pexelsQuery, setPexelsQuery] = useState("");
  const [pexelsImages, setPexelsImages] = useState<Image[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ──────────────────────────────────────────────────────────────
  // Fetch semantic PECS images once on mount (no prerender cache)
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    interface PecsResponse {
      pecs: Record<string, string>;
    }

    fetch("/api/pecs-images", { cache: "no-store" })
      .then((res) => res.json() as Promise<PecsResponse>)
      .then(({ pecs }) => {
        const imgs: Image[] = Object.values(pecs).map((url, idx) => ({
          url,
          name: `Image ${idx + 1}`,
        }));
        setPecsImages(imgs);
      })
      .catch(console.error);
  }, []);

  const filteredPecs = pecsImages.filter((img) =>
    img.name.toLowerCase().includes(pecsSearchQuery.toLowerCase())
  );

  // ──────────────────────────────────────────────────────────────
  // Fetch Pexels images on demand (opt‑out of prerender cache)
  // ──────────────────────────────────────────────────────────────
  const fetchPexelsImages = async (query: string) => {
    const res = await fetch(
      `/api/pexels-images?query=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    const json: Image[] = await res.json();
    setPexelsImages(json);
  };

  const filteredPexels = pexelsImages.filter((img) =>
    img.name.toLowerCase().includes(pexelsQuery.toLowerCase())
  );

  // ──────────────────────────────────────────────────────────────
  // Handlers
  // ──────────────────────────────────────────────────────────────
  const handleSelect = (url: string) => {
    onImageSelected(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.imageUrl) onImageSelected(data.imageUrl);
    setUploading(false);
  };

  // ──────────────────────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────────────────────
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
            {/* ───── Tabs header ───── */}
            <Tabs.List className="flex gap-2 border-b mb-4">
              {[
                { label: "PECS", value: "pecs" },
                { label: "Pexels", value: "pexels" },
                { label: "Upload", value: "upload" },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* ───── PECS tab ───── */}
            <Tabs.Content value="pecs" className="mt-4">
              <input
                type="text"
                placeholder="Search PECS images…"
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

            {/* ───── Pexels tab ───── */}
            <Tabs.Content value="pexels" className="mt-4">
              <input
                type="text"
                placeholder="Search Pexels images…"
                value={pexelsQuery}
                onChange={(e) => setPexelsQuery(e.target.value)}
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

            {/* ───── Upload tab ───── */}
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
                {uploading ? "Uploading…" : "Upload"}
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
