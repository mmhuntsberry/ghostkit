import type { Metadata } from "next";

import "./globals.css";

const BRAND = process.env.BRAND_SLUG;

console.log({ BRAND });

export const metadata: Metadata = {
  title: "Figma Analytics",
  description: "Figma Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={`/brands/${BRAND}.css`} />
      </head>

      <body>{children}</body>
    </html>
  );
}
