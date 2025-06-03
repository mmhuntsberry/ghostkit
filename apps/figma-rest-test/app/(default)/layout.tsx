import "../globals.css";
const BRAND = process.env.BRAND_SLUG;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Make sure `public/brands/{BRAND}.css` exists before build */}
        <link rel="stylesheet" href={`/brands/${BRAND}.css`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
