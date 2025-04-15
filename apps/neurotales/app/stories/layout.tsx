// app/layout.tsx

import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "NeuroTales",
  description: "Social story generation made easy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
