"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchPodcasts } from "@/lib/data";
import { PodcastCard } from "@/components/podcast-card";
import type { Podcast } from "@/lib/types";
import { Spinner } from "@/components/spinner";

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (term: string) => {
    if (term === "") {
      return;
    }
    setIsLoading(true);
    const results = await searchPodcasts(term);
    setPodcasts(results);
    setIsLoading(false);
  }, []);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [
    handleSearch,
  ]);

  useEffect(() => {
    handleSearch("");
  }, [handleSearch]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsLoading(true);
    debouncedSearch(newSearchTerm);
  };

  return (
    <main className="container mx-auto px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-primary text-center mb-4">
        🎧 Discover. Listen. Understand.
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-10">
        AI-powered podcast summaries — explore smarter, faster, and deeper.
      </p>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for podcasts..."
            className="w-full pl-12 h-14 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-accent"
            value={searchTerm}
            onChange={onInputChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center col-span-full py-16">
          <Spinner className="h-10 w-10 text-primary" />
        </div>
      ) : podcasts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      ) : (
        <div className="text-center col-span-full py-16">
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? `No podcasts found for "${searchTerm}".`
              : "Start by searching for a podcast."}
          </p>
        </div>
      )}
    </main>
  );
}
