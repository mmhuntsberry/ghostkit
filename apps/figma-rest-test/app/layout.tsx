import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const BRAND = process.env.BRAND_SLUG;

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
});

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
      <link rel="stylesheet" href={`/brands/${BRAND}.css`} />

      <body className={`${sourceSans3.variable}  antialiased`}>{children}</body>
    </html>
  );
}
