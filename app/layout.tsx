import type { Metadata } from "next";
import "./globals.css";
import { NostrProvider } from "@/components/NostrProvider";
import { ProgressProvider } from "@/components/ProgressProvider";

export const metadata: Metadata = {
  title: "Nostr Learn",
  description: "A fun way to learn the Nostr protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <NostrProvider>
          <ProgressProvider>{children}</ProgressProvider>
        </NostrProvider>
      </body>
    </html>
  );
}
