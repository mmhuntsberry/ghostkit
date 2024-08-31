import "./global.css";

export const metadata = {
  title: "Welcome to blog",
  description: "Generated by create-nx-workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dynamically import the module based on the environment variable
  let theme;
  try {
    if (process.env.NEXT_PUBLIC_SITE_TYPE?.length) {
      theme =
        require(`@mmhuntsberry/tokens/${process.env.NEXT_PUBLIC_SITE_TYPE}`).default;
    } else {
      theme = require(`@mmhuntsberry/tokens`).default;
    }
  } catch (error) {
    console.error("Error loading theme:", error);
    // Optionally, provide a fallback or throw an error if needed
    theme = null; // or some fallback theme
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
