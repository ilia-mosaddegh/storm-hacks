import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
// (Ionicons is optional; if you don't have @expo/vector-icons installed, remove icon usage)
// import { Ionicons } from '@expo/vector-icons';

type ResultStatus =
  | 'queued'
  | 'identifying'
  | 'facts_fetching'
  | 'story_writing'
  | 'tts_rendering'
  | 'done';

type ResultPayload = {
  requestId: string;
  imageUrl?: string;
  status: ResultStatus;
  title?: string;
  location?: string;
  summary?: string;
  story?: string;
  durationSec?: number;
};

export default function ResultScreen() {
  const params = useLocalSearchParams<{ requestId?: string; imageUrl?: string }>();
  const requestId = String(params.requestId ?? '');
  const imageUrl = String(params.imageUrl ?? '');

  const [data, setData] = useState<ResultPayload>({
    requestId,
    imageUrl,
    status: 'queued',
  });

  // ---- Simulate backend processing (your existing code) ----
  useEffect(() => {
    const steps: ResultStatus[] = [
      'queued',
      'identifying',
      'facts_fetching',
      'story_writing',
      'tts_rendering',
      'done',
    ];
    let i = 0;
    setData((d) => ({ ...d, status: steps[i] }));

    const timer = setInterval(() => {
      i++;
      if (i < steps.length) {
        if (steps[i] === 'done') {
          setData((d) => ({
            ...d,
            status: 'done',
            title: 'Vancouver Art Gallery',
            location: 'Vancouver, BC',
            summary:
              'A former 1906 courthouse transformed into a major art institution showcasing Canadian and Indigenous art.',
            story:
              'Once a neoclassical courthouse, this building became a cultural hub after the 1983 transformation. Its steps have seen protests, performances, and countless first dates. Inside, rotating exhibitions tell layered stories of the city’s artists and visitors.',
            durationSec: 42,
          }));
          clearInterval(timer);
        } else {
          setData((d) => ({ ...d, status: steps[i] }));
        }
      }
    }, 900);

    return () => clearInterval(timer);
  }, []);

  // ---- AUDIO: state + cleanup ----
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // (iOS) allow playback even if the silent switch is on
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    }).catch(() => {});
  }, []);

  // unload sound when component unmounts or sound instance changes
  useEffect(() => {
    return () => {
      sound?.unloadAsync().catch(() => {});
    };
  }, [sound]);

  // ---- AUDIO: play/pause toggle ----
  async function togglePlay() {
    try {
      if (!sound) {
        const { sound: s } = await Audio.Sound.createAsync(
          require('@/assets/audio/story.mp3'),
          { shouldPlay: true }
        );
        setSound(s);
        setIsPlaying(true);
        s.setOnPlaybackStatusUpdate((st) => {
          if (!st || !('isLoaded' in st) || !st.isLoaded) return;
          if ('didJustFinish' in st && st.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } else {
        const status = await sound.getStatusAsync();
        if ('isPlaying' in status && status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header image */}
      {!!imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.headerImage} contentFit="cover" />
      )}

      {/* Status chips */}
      <View style={styles.chipsRow}>
        {(['queued','identifying','facts_fetching','story_writing','tts_rendering','done'] as const).map(
          (s) => (
            <View
              key={s}
              style={[
                styles.chip,
                data.status === s && styles.chipActive,
              ]}
            >
              <Text style={styles.chipText}>{s.replace('_', ' ')}</Text>
            </View>
          )
        )}
      </View>

      {/* Loading state while not done */}
      {data.status !== 'done' && (
        <View style={styles.loadingBox}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>
            {data.status === 'queued' && 'Queuing your request…'}
            {data.status === 'identifying' && 'Identifying the landmark…'}
            {data.status === 'facts_fetching' && 'Fetching historical facts…'}
            {data.status === 'story_writing' && 'Writing your audio story…'}
            {data.status === 'tts_rendering' && 'Rendering narration…'}
          </Text>
        </View>
      )}

      {/* Final content */}
      {data.status === 'done' && (
        <View style={styles.card}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.location}>{data.location}</Text>
          <Text style={styles.summary}>{data.summary}</Text>
          <Text style={styles.story}>{data.story}</Text>

          {/* Play / Pause button */}
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
            {/* If using Ionicons:
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#fff" style={{ marginRight: 6 }} />
            */}
            <Text style={styles.playBtnText}>{isPlaying ? 'Pause' : 'Play'} story</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  content: { padding: 16, alignItems: 'center' },
  headerImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, justifyContent: 'center' },
  chip: { borderColor: '#7C9CFF', borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  chipActive: { backgroundColor: '#7C9CFF' },
  chipText: { color: '#E6E9EF', fontSize: 12, textTransform: 'capitalize' },
  loadingBox: { alignItems: 'center', marginVertical: 12 },
  loadingText: { color: '#9AA3B2', marginTop: 8 },
  card: { backgroundColor: '#121828', borderRadius: 12, padding: 16, gap: 8, width: '100%' },
  title: { color: '#E6E9EF', fontSize: 22, fontWeight: '700' },
  location: { color: '#A6B0C3' },
  summary: { color: '#C9D1E1', marginTop: 6 },
  story: { color: '#C9D1E1', marginTop: 10, lineHeight: 20 },
  playBtn: { marginTop: 12, backgroundColor: '#7C9CFF', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignSelf: 'flex-start' },
  playBtnText: { color: '#fff', fontWeight: '600' },
});
