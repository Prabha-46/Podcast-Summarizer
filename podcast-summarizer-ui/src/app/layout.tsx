import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AudioProvider } from "@/context/audio-provider";
import { AudioPlayer } from "@/components/audio-player";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Podcast Summaries",
  description: "Discover and listen to your next favorite podcast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <AudioProvider>
          <div className="flex-grow">{children}</div>
          <AudioPlayer />
          <Toaster />
        </AudioProvider>
      </body>
    </html>
  );
}
