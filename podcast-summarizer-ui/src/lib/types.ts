export interface Podcast {
  id: string;
  title: string;
  description: string;
  image: string;
  publisher: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  audio: string;
  pub_date: string;
  thumbnail: string;
  isAiSummarized?: boolean;
}
