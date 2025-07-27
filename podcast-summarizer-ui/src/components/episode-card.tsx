"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAudio } from "@/context/audio-provider";
import type { Episode } from "@/lib/types";
import { Loader2, Pause, Play, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { summarizeEpisode } from "@/lib/data";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { playEpisode, currentEpisode, isPlaying } = useAudio();
  const [isSummarizing, setIsSummarizing] = useState(false);

  const isActive = currentEpisode?.id === episode.id;

  const handleAIPlay = (episode: Episode) => {
    setIsSummarizing(true);
    // TODO: Need To pass episode itself
    summarizeEpisode(episode)
      .then((data) => {
        const ai_summaried_episode = {
          ...episode,
          isAiSummarized: true,
          audio: data.presigned_url,
        };
        playEpisode(ai_summaried_episode);
      })
      .finally(() => {
        setIsSummarizing(false);
      });
  };

  return (
    <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg">
      <CardContent className="p-4 flex items-center gap-4">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          width={100}
          height={100}
          className="rounded-md aspect-square object-cover hidden sm:block"
          data-ai-hint="podcast episode cover"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline text-lg font-semibold">
                {episode.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {/* AI Play Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleAIPlay({ ...episode })}
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full flex-shrink-0 bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
                      aria-label="AI Play"
                    >
                      {isSummarizing ? (
                        <Loader2 className="h-6 w-6 text-accent-foreground fill-current animate-spin" />
                      ) : (
                        <Sparkles className="h-6 w-6 fill-current" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm">
                    AI Play
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Regular Play/Pause Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => playEpisode({ ...episode })}
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-full flex-shrink-0 bg-accent/20 hover:bg-accent/40 text-accent-foreground"
                      aria-label={isActive && isPlaying ? "Pause" : "Play"}
                    >
                      {isActive && isPlaying ? (
                        <Pause className="h-6 w-6 text-accent-foreground fill-current" />
                      ) : (
                        <Play className="h-6 w-6 text-accent-foreground fill-current" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm">
                    Play / Pause
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div
            className="mt-2 text-sm text-foreground/80"
            dangerouslySetInnerHTML={{ __html: episode.description }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
