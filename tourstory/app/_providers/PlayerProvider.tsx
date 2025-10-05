// app/_providers/PlayerProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackStatusSuccess, AVPlaybackSource } from 'expo-av';

type Track = {
  title: string;
  imageUrl?: string;     // shown in Now Playing
  source: AVPlaybackSource; // require(...) or { uri: string }
};

type PlayerState = {
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  track?: Track;
};

type PlayerAPI = {
  state: PlayerState;
  loadAndPlay: (track: Track) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (millis: number) => Promise<void>;
};

const PlayerCtx = createContext<PlayerAPI | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [state, setState] = useState<PlayerState>({
    isLoaded: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    track: undefined,
  });

  // iOS: allow playback in silent mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    }).catch(() => {});
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const onStatusUpdate = (st: AVPlaybackStatusSuccess) => {
    if (!st.isLoaded) return;
    setState(prev => ({
      ...prev,
      isLoaded: true,
      isPlaying: st.isPlaying,
      positionMillis: st.positionMillis ?? 0,
      durationMillis: st.durationMillis ?? 0,
    }));
  };

  const unloadSound = async () => {
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current.setOnPlaybackStatusUpdate(null as any);
      soundRef.current = null;
    }
  };

  const loadAndPlay = async (track: Track) => {
    await unloadSound();
    const { sound } = await Audio.Sound.createAsync(track.source, { shouldPlay: true });
    soundRef.current = sound;
    sound.setOnPlaybackStatusUpdate((st) => {
      if (st && 'isLoaded' in st && st.isLoaded) onStatusUpdate(st);
    });
    setState({
      isLoaded: true,
      isPlaying: true,
      positionMillis: 0,
      durationMillis: 0,
      track,
    });
  };

  const play = async () => {
    if (!soundRef.current) return;
    await soundRef.current.playAsync();
  };

  const pause = async () => {
    if (!soundRef.current) return;
    await soundRef.current.pauseAsync();
  };

  const stop = async () => {
    if (!soundRef.current) return;
    await soundRef.current.stopAsync();
  };

  const seek = async (millis: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(millis);
  };

  const api: PlayerAPI = { state, loadAndPlay, play, pause, stop, seek };
  return <PlayerCtx.Provider value={api}>{children}</PlayerCtx.Provider>;
}

export const usePlayer = () => {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
