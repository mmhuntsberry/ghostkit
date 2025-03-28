// app/(marketing)/layout.tsx
import React from "react";
import NextLink from "next/link";
import { headers } from "next/headers";
import Link from "../../components/Link";
import "../globals.css";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="box-border border-b border-gray-100 bg-white py-xs max-h-[64px]">
          <div className="container mx-auto flex items-center justify-between px-4">
            <div className="flex items-center gap-md">
              <Link
                as={NextLink}
                href="/"
                variant="neutral"
                background="transparent"
                className="!text-4xl hover:bg-white hover:border-white"
                selectable={false}
              >
                NeuroTales
              </Link>
              <nav className="hidden md:flex gap-xs">
                <Link
                  as={NextLink}
                  href="/features"
                  variant="neutral"
                  background="transparent"
                >
                  Features
                </Link>
                <Link
                  as={NextLink}
                  href="/pricing"
                  variant="neutral"
                  background="transparent"
                >
                  Pricing
                </Link>
                <Link
                  as={NextLink}
                  href="/faq"
                  variant="neutral"
                  background="transparent"
                >
                  FAQ
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link as={NextLink} href="/signin">
                Sign in
              </Link>
              <Link as={NextLink} href="/signup" background="outlined">
                Sign up
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}
