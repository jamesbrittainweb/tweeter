import type { Metadata } from "next";
import "./globals.css";

import { ThemeScript } from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: "Tweeter",
  description: "A lightweight, friendly microblog.",
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-theme="light">
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
