export type ResultPayload = {
  landmarkId: string;
  title: string;
  location: string;
  summary: string;
  story: string;
  imageUrl: string;   // https:// or file://
  durationSec: number;
  language: string;
};

export type NowPlayingState = {
  title: string;
  audioUrl: string;
  durationSec: number;
  positionSec: number;
  isPlaying: boolean;
};

export type PlaylistItem = {
  id: string;
  title: string;
  artist: string;
  previewUrl: string;
  externalUrl: string;
};
