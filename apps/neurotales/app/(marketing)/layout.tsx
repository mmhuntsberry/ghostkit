// apps/neurotales/app/layout.tsx
// import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NeuroTales",
  description: "Animated SVG demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          maxWidth: "var(--layout-3xl)",
          margin: "96px auto",
        }}
      >
        {children}
      </body>
    </html>
  );
}
