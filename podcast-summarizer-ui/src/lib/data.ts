import type { Podcast, Episode } from "./types";

const API_BASE_URL = "http://localhost:8000";

export async function searchPodcasts(
  query: string,
  page: number = 0
): Promise<Podcast[]> {
  try {
    const endpoint = `${API_BASE_URL}/search?q=${encodeURIComponent(
      query
    )}&page=${page}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error(
        "API Error searching podcasts:",
        response.status,
        await response.text()
      );
      return [];
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return [];
  }
}

export async function getEpisodes(id: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/episodes/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(
        "API Error fetching podcast:",
        response.status,
        await response.text()
      );
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch podcast:", error);
    return null;
  }
}

export async function summarizeEpisode(episode: Episode): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/summary-path/${episode.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: episode.audio,
      }),
    });
    if (!response.ok) {
      console.error(
        "API Error summarizing episode:",
        response.status,
        await response.text()
      );
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to summarize episode:", error);
    return null;
  }
}
