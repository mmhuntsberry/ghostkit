export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--palette-neutral-lightest)",
      }}
      className="p-6 space-y-8"
    >
      {children}
    </div>
  );
}
