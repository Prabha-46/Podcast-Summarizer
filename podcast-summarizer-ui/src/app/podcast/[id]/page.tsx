import { PodcastPageClient } from "@/components/podcast-page-client";
import { Button } from "@/components/ui/button";
import { getEpisodes } from "@/lib/data";
import { Episode, Podcast } from "@/lib/types";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PodcastPage({
  params,
}: {
  params: { id: string };
}) {
  const data = (await getEpisodes(params.id)) || [];
  const episodes: Episode[] = data?.episodes;
  const podcast: Podcast = data?.podcast;

  if (!podcast) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="relative mb-12">
        <div className="absolute top-0 left-0">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-8 pt-16">
          <Image
            src={podcast.image}
            alt={podcast.title}
            width={200}
            height={200}
            className="rounded-lg shadow-2xl aspect-square object-cover"
            data-ai-hint="podcast cover"
            priority
          />
          <div className="max-w-2xl">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
              {podcast.title}
            </h1>
            <div
              className="text-lg font-semibold text-muted-foreground mt-2"
              dangerouslySetInnerHTML={{ __html: podcast.publisher }}
            />
            <div
              className="mt-4 text-base"
              dangerouslySetInnerHTML={{ __html: podcast.description }}
            />
          </div>
        </div>
      </header>

      <main>
        <h2 className="font-headline text-3xl font-bold mb-6 text-center md:text-left">
          Episodes
        </h2>
        <PodcastPageClient episodes={episodes} />
      </main>
    </div>
  );
}
