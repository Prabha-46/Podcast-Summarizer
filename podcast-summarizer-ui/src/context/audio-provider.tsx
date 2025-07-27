"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Episode } from "@/lib/types";

interface AudioContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  playEpisode: (episode: Episode) => void;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playEpisode = (episode: Episode) => {
    if (
      currentEpisode?.id === episode.id &&
      currentEpisode?.audio === episode.audio
    ) {
      togglePlayPause();
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (currentEpisode) {
      setIsPlaying((prev) => !prev);
    }
  };

  const value = {
    currentEpisode,
    isPlaying,
    playEpisode,
    togglePlayPause,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
