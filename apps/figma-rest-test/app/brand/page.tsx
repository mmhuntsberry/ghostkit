// File: apps/figma-rest-test/app/brand/page.tsx

"use client";

export default function BrandPage() {
  return (
    <div className="p-6 space-y-8">
      <button
        style={{
          backgroundColor:
            "var(--palette-action-background-primary-solid-default, blue)",
          color: "var(--palette-action-content-primary-solid-default, white)",
          borderRadius: "var(--container-action-radius-default, 4px)",
          paddingInline: "var(--space-md)",
          paddingBlock: "var(--space-xs)",
        }}
      >
        Hiya
      </button>
    </div>
  );
}
