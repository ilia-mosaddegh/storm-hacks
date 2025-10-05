// app/_providers/PlayerProvider.tsx
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Audio } from 'expo-av';

export type PlayerAPI = {
  isPlaying: boolean;
  isLoading: boolean;
  currentUrl: string | null;
  loadAndPlay: (url: string) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
};

const PlayerContext = createContext<PlayerAPI | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
  }, []);

  const loadAndPlay = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      await unload();
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      soundRef.current = sound;
      setCurrentUrl(url);
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate(s => { if (s.isLoaded) setIsPlaying(s.isPlaying); });
    } finally {
      setIsLoading(false);
    }
  }, [unload]);

  const pause = useCallback(async () => { if (soundRef.current) await soundRef.current.pauseAsync(); }, []);
  const stop  = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setIsPlaying(false);
    }
  }, []);

  const value: PlayerAPI = { isPlaying, isLoading, currentUrl, loadAndPlay, pause, stop };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

/** <-- THIS is the export your other files should import */
export function usePlayer(): PlayerAPI {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
