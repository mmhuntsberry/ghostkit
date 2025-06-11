export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--palette-neutral-lightest)",
      }}
      className="p-6 space-y-8"
    >
      {children}
    </div>
  );
}
