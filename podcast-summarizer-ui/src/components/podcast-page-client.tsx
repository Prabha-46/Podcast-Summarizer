'use client';

import type { Episode } from '@/lib/types';
import { EpisodeCard } from '@/components/episode-card';

interface PodcastPageClientProps {
  episodes: Episode[];
}

export function PodcastPageClient({ episodes }: PodcastPageClientProps) {
  return (
    <div className="space-y-6">
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
}
