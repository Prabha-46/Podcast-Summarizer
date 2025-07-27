"use client";

import { useAudio } from "@/context/audio-provider";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function AudioPlayer() {
  const { currentEpisode, isPlaying, togglePlayPause } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Audio play failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      audioRef.current.src = currentEpisode.audio;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Audio play failed:", error));
      }
    }
  }, [currentEpisode, isPlaying]);

  if (!currentEpisode) {
    return null;
  }

  return (
    <footer className="sticky bottom-0 left-0 right-0 z-50">
      <div className="bg-card/80 backdrop-blur-md border-t p-4 shadow-lg transition-transform duration-300 ease-in-out">
        <div className="container mx-auto flex items-center gap-4">
          <Image
            src={currentEpisode.thumbnail}
            alt={currentEpisode.title}
            width={56}
            height={56}
            className="rounded-md"
            data-ai-hint="podcast cover"
          />
          {currentEpisode.isAiSummarized ? (
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 fill-current text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                AI Powered Summary
              </span>
            </div>
          ) : (
            <></>
          )}
          <div className="flex-grow">
            <h3 className="font-headline font-semibold">
              {currentEpisode.title}
            </h3>
          </div>
          <audio
            ref={audioRef}
            src={currentEpisode.audio}
            onEnded={togglePlayPause}
            controls
          />
        </div>
      </div>
    </footer>
  );
}
