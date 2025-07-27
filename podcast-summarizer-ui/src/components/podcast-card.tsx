import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Podcast } from '@/lib/types';

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link href={`/podcast/${podcast.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <Image
            src={podcast.image}
            alt={podcast.title}
            width={600}
            height={600}
            className="aspect-square object-cover w-full"
            data-ai-hint="podcast cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm font-medium text-primary mb-1">{podcast.publisher}</p>
          <CardTitle className="font-headline text-lg leading-tight group-hover:text-primary transition-colors">
            {podcast.title}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
