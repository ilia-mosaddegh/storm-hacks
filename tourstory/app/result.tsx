// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
// import { Image } from 'expo-image';
// import { useLocalSearchParams } from 'expo-router';
// import { Audio } from 'expo-av';
// // (Ionicons is optional; if you don't have @expo/vector-icons installed, remove icon usage)
// // import { Ionicons } from '@expo/vector-icons';

// type ResultStatus =
//   | 'queued'
//   | 'identifying'
//   | 'facts_fetching'
//   | 'story_writing'
//   | 'tts_rendering'
//   | 'done';

// type ResultPayload = {
//   requestId: string;
//   imageUrl?: string;
//   status: ResultStatus;
//   title?: string;
//   location?: string;
//   summary?: string;
//   story?: string;
//   durationSec?: number;
// };

// export default function ResultScreen() {
//   const params = useLocalSearchParams<{ requestId?: string; imageUrl?: string }>();
//   const requestId = String(params.requestId ?? '');
//   const imageUrl = String(params.imageUrl ?? '');

//   const [data, setData] = useState<ResultPayload>({
//     requestId,
//     imageUrl,
//     status: 'queued',
//   });

//   // ---- Simulate backend processing (your existing code) ----
//   useEffect(() => {
//     const steps: ResultStatus[] = [
//       'queued',
//       'identifying',
//       'facts_fetching',
//       'story_writing',
//       'tts_rendering',
//       'done',
//     ];
//     let i = 0;
//     setData((d) => ({ ...d, status: steps[i] }));

//     const timer = setInterval(() => {
//       i++;
//       if (i < steps.length) {
//         if (steps[i] === 'done') {
//           setData((d) => ({
//             ...d,
//             status: 'done',
//             title: 'Vancouver Art Gallery',
//             location: 'Vancouver, BC',
//             summary:
//               'A former 1906 courthouse transformed into a major art institution showcasing Canadian and Indigenous art.',
//             story:
//               'Once a neoclassical courthouse, this building became a cultural hub after the 1983 transformation. Its steps have seen protests, performances, and countless first dates. Inside, rotating exhibitions tell layered stories of the city’s artists and visitors.',
//             durationSec: 42,
//           }));
//           clearInterval(timer);
//         } else {
//           setData((d) => ({ ...d, status: steps[i] }));
//         }
//       }
//     }, 900);

//     return () => clearInterval(timer);
//   }, []);

//   // ---- AUDIO: state + cleanup ----
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // (iOS) allow playback even if the silent switch is on
//   useEffect(() => {
//     Audio.setAudioModeAsync({
//       allowsRecordingIOS: false,
//       playsInSilentModeIOS: true,
//       staysActiveInBackground: false,
//     }).catch(() => {});
//   }, []);

//   // unload sound when component unmounts or sound instance changes
//   useEffect(() => {
//     return () => {
//       sound?.unloadAsync().catch(() => {});
//     };
//   }, [sound]);

//   // ---- AUDIO: play/pause toggle ----
//   async function togglePlay() {
//     try {
//       if (!sound) {
//         const { sound: s } = await Audio.Sound.createAsync(
//           require('@/assets/audio/story.mp3'),
//           { shouldPlay: true }
//         );
//         setSound(s);
//         setIsPlaying(true);
//         s.setOnPlaybackStatusUpdate((st) => {
//           if (!st || !('isLoaded' in st) || !st.isLoaded) return;
//           if ('didJustFinish' in st && st.didJustFinish) {
//             setIsPlaying(false);
//           }
//         });
//       } else {
//         const status = await sound.getStatusAsync();
//         if ('isPlaying' in status && status.isPlaying) {
//           await sound.pauseAsync();
//           setIsPlaying(false);
//         } else {
//           await sound.playAsync();
//           setIsPlaying(true);
//         }
//       }
//     } catch (e) {
//       console.warn('Audio error', e);
//     }
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       {/* Header image */}
//       {!!imageUrl && (
//         <Image source={{ uri: imageUrl }} style={styles.headerImage} contentFit="cover" />
//       )}

//       {/* Status chips */}
//       <View style={styles.chipsRow}>
//         {(['queued','identifying','facts_fetching','story_writing','tts_rendering','done'] as const).map(
//           (s) => (
//             <View
//               key={s}
//               style={[
//                 styles.chip,
//                 data.status === s && styles.chipActive,
//               ]}
//             >
//               <Text style={styles.chipText}>{s.replace('_', ' ')}</Text>
//             </View>
//           )
//         )}
//       </View>

//       {/* Loading state while not done */}
//       {data.status !== 'done' && (
//         <View style={styles.loadingBox}>
//           <ActivityIndicator />
//           <Text style={styles.loadingText}>
//             {data.status === 'queued' && 'Queuing your request…'}
//             {data.status === 'identifying' && 'Identifying the landmark…'}
//             {data.status === 'facts_fetching' && 'Fetching historical facts…'}
//             {data.status === 'story_writing' && 'Writing your audio story…'}
//             {data.status === 'tts_rendering' && 'Rendering narration…'}
//           </Text>
//         </View>
//       )}

//       {/* Final content */}
//       {data.status === 'done' && (
//         <View style={styles.card}>
//           <Text style={styles.title}>{data.title}</Text>
//           <Text style={styles.location}>{data.location}</Text>
//           <Text style={styles.summary}>{data.summary}</Text>
//           <Text style={styles.story}>{data.story}</Text>

//           {/* Play / Pause button */}
//           <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
//             {/* If using Ionicons:
//             <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#fff" style={{ marginRight: 6 }} />
//             */}
//             <Text style={styles.playBtnText}>{isPlaying ? 'Pause' : 'Play'} story</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121828' },
//   content: { padding: 16, alignItems: 'center' },
//   headerImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
//   chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, justifyContent: 'center' },
//   chip: { borderColor: '#5085bbff', borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
//   chipActive: { backgroundColor: '#5085bbff' },
//   chipText: { color: '#E6E9EF', fontSize: 12, textTransform: 'capitalize' },
//   loadingBox: { alignItems: 'center', marginVertical: 12 },
//   loadingText: { color: '#9AA3B2', marginTop: 8 },
//   card: { backgroundColor: '#232b42ff', borderRadius: 12, padding: 16, gap: 8, width: '100%' },
//   title: { color: '#E6E9EF', fontSize: 22, fontWeight: '700' },
//   location: { color: '#A6B0C3' },
//   summary: { color: '#C9D1E1', marginTop: 6 },
//   story: { color: '#C9D1E1', marginTop: 10, lineHeight: 20 },
//   playBtn: { marginTop: 12, backgroundColor: '#5085bbff', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignSelf: 'flex-start' },
//   playBtnText: { color: '#fff', fontWeight: '600' },
// });

// app/src/result.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePlayer } from './_providers/PlayerProvider';

type ResultStatus =
  | 'queued'
  | 'identifying'
  | 'facts_fetching'
  | 'story_writing'
  | 'tts_rendering'
  | 'done'
  | 'error';

type ResultPayload = {
  requestId: string;
  imageUrl?: string;
  status: ResultStatus;
  title?: string;
  location?: string;
  summary?: string;
  story?: string;
  durationSec?: number;
  audioUrl?: string;       // <-- TTS file from backend
  errorMessage?: string;   // optional
};

const API_BASE =
  Platform.select({
    android: 'http://10.0.2.2:3000', // Android emulator → host machine
    default: 'http://localhost:3000', // iOS simulator / web / desktop
  })!;

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // inputs that may arrive from /result?imageUrl=... or /result?requestId=...
  const initialImageUrl = useMemo(() => (params.imageUrl ? String(params.imageUrl) : ''), [params.imageUrl]);
  const initialRequestId = useMemo(() => (params.requestId ? String(params.requestId) : ''), [params.requestId]);

  // UI state we will drive from the backend
  const [data, setData] = useState<ResultPayload>({
    requestId: initialRequestId || '',
    imageUrl: initialImageUrl || undefined,
    status: initialRequestId ? 'queued' : initialImageUrl ? 'identifying' : 'error',
  });

  // audio (via global player)
  const { isPlaying, isLoading, currentUrl, loadAndPlay, pause, stop } = usePlayer();
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // kick off processing:
  // - if we only have imageUrl → POST /api/analyze to start a job and receive requestId
  // - if we already have requestId → start polling
  useEffect(() => {
    let cancelled = false;

    async function startFromImage() {
      try {
        setData(d => ({ ...d, status: 'identifying' }));

        const form = new FormData();
        form.append('image', {
          uri: initialImageUrl,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);

        const res = await fetch(`${API_BASE}/api/analyze`, {
          method: 'POST',
          body: form,
          // do NOT set Content-Type manually for multipart
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`analyze failed: ${res.status} ${text}`);
        }

        const json = await res.json();

        // Two possible backends:
        // A) returns a job id to poll: { requestId }
        // B) returns the full result immediately
        if (json.requestId) {
          if (!cancelled) {
            setData(d => ({
              ...d,
              requestId: json.requestId,
              status: 'queued',
            }));
            beginPolling(json.requestId);
          }
        } else {
          // assume it's a full result payload
          if (!cancelled) {
            setData(d => ({
              ...d,
              status: 'done',
              title: json.title,
              location: json.location,
              summary: json.summary,
              story: json.story,
              durationSec: json.durationSec,
              audioUrl: json.audioUrl,
            }));
          }
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) {
          setData(d => ({ ...d, status: 'error', errorMessage: err?.message || 'Analyze failed' }));
        }
      }
    }

    async function startFromRequestId() {
      beginPolling(initialRequestId);
    }

    function beginPolling(id: string) {
      // clear any existing
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);

      // immediate fetch + then poll every 1.5s
      fetchStatus(id).catch(() => {});
      pollTimerRef.current = setInterval(() => {
        fetchStatus(id).catch(() => {});
      }, 1500);
    }

    async function fetchStatus(id: string) {
      try {
        const res = await fetch(`${API_BASE}/api/result?requestId=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`result failed: ${res.status}`);
        const json = await res.json();

        // expected shapes:
        // { status: 'queued' | 'identifying' | 'facts_fetching' | 'story_writing' | 'tts_rendering' }
        // or when done:
        // { status: 'done', title, location, summary, story, durationSec, audioUrl }
        if (cancelled) return;

        setData(d => ({
          ...d,
          status: json.status as ResultStatus,
          title: json.title ?? d.title,
          location: json.location ?? d.location,
          summary: json.summary ?? d.summary,
          story: json.story ?? d.story,
          durationSec: json.durationSec ?? d.durationSec,
          audioUrl: json.audioUrl ?? d.audioUrl,
          requestId: id,
        }));

        if (json.status === 'done' || json.status === 'error') {
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
        }
      } catch (err: any) {
        console.error(err);
        // show a soft error but keep polling a couple more times
      }
    }

    if (!initialImageUrl && !initialRequestId) {
      setData(d => ({ ...d, status: 'error', errorMessage: 'No image or request id provided' }));
      return;
    }

    if (initialRequestId) startFromRequestId();
    else if (initialImageUrl) startFromImage();

    return () => {
      cancelled = true;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [initialImageUrl, initialRequestId]);

  const friendly = (s: string) => s.replace(/_/g, ' ');
  const canListen = !!data.audioUrl;

  const onListen = async () => {
    try {
      if (!data.audioUrl) return;
      // toggle play/pause for this specific track
      if (isPlaying && currentUrl === data.audioUrl) {
        await pause();
      } else {
        await loadAndPlay(data.audioUrl);
      }
    } catch (e: any) {
      Alert.alert('Audio error', e?.message ?? 'Could not play audio');
    }
  };

  const onStop = async () => {
    try {
      await stop();
    } catch {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Result</Text>

        {/* STATUS */}
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <View style={styles.chips}>
            {['queued','identifying','facts_fetching','story_writing','tts_rendering','done'].map(step => {
              const active = data.status === step;
              const passed =
                ['identifying','facts_fetching','story_writing','tts_rendering','done'].includes(step) &&
                ['facts_fetching','story_writing','tts_rendering','done'].includes(data.status);
              return (
                <View
                  key={step}
                  style={[
                    styles.chip,
                    active && styles.chipActive,
                    passed && styles.chipPassed,
                  ]}
                >
                  <Text style={styles.chipText}>{friendly(step)}</Text>
                </View>
              );
            })}
            {data.status === 'error' && (
              <View style={[styles.chip, styles.chipError]}>
                <Text style={styles.chipText}>error</Text>
              </View>
            )}
          </View>
        </View>

        {['queued','identifying','facts_fetching','story_writing','tts_rendering'].includes(data.status) && (
          <View style={styles.loadingBox}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Working…</Text>
          </View>
        )}

        {/* CONTENT */}
        {data.status === 'done' && (
          <>
            <Text style={styles.title}>{data.title || 'Unknown landmark'}</Text>
            <Text style={styles.location}>{data.location || ''}</Text>

            {data.summary ? (
              <>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.paragraph}>{data.summary}</Text>
              </>
            ) : null}

            {data.story ? (
              <>
                <Text style={styles.sectionTitle}>Story</Text>
                <Text style={styles.paragraph}>{data.story}</Text>
              </>
            ) : null}

            {/* AUDIO CONTROLS */}
            <View style={styles.audioRow}>
              <TouchableOpacity
                style={[styles.btn, canListen ? styles.btnPrimary : styles.btnDisabled]}
                onPress={onListen}
                disabled={!canListen || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>
                  {!canListen ? 'No audio' : isPlaying && currentUrl === data.audioUrl ? 'Pause' : 'Listen'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnGhost]}
                onPress={onStop}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Stop</Text>
              </TouchableOpacity>
            </View>

            {typeof data.durationSec === 'number' && (
              <Text style={styles.meta}>Duration: ~{Math.round(data.durationSec)}s</Text>
            )}
          </>
        )}

        {data.status === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>
              {data.errorMessage || 'Unable to process this image.'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={[styles.btn, styles.mt16]} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { color: '#dfe7f3', fontSize: 22, fontWeight: '700', marginBottom: 10 },
  row: { marginBottom: 10 },
  label: { color: '#8ea2c9', marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: '#334155', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  chipActive: { backgroundColor: '#26334d', borderColor: '#7C9CFF' },
  chipPassed: { backgroundColor: '#1a263d', borderColor: '#475569' },
  chipError: { backgroundColor: '#3b1f2a', borderColor: '#b91c1c' },
  chipText: { color: '#dbe4f4', fontSize: 12 },

  loadingBox: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  loadingText: { color: '#9AA3B2' },

  title: { color: '#E6E9EF', fontSize: 20, fontWeight: '700', marginTop: 6 },
  location: { color: '#9AA3B2', marginTop: 2, marginBottom: 12 },
  sectionTitle: { color: '#c6d4ee', fontWeight: '700', marginTop: 12, marginBottom: 6 },
  paragraph: { color: '#c9d3e6', lineHeight: 21 },

  audioRow: { flexDirection: 'row', gap: 10, marginTop: 14, alignItems: 'center' },
  btn: { borderWidth: 1, borderColor: '#7C9CFF', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  btnPrimary: { backgroundColor: '#7C9CFF' },
  btnGhost: { backgroundColor: 'transparent' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#E6E9EF', fontWeight: '600' },
  meta: { color: '#6f7a8a', marginTop: 8, fontSize: 12 },

  errorBox: { backgroundColor: '#2a1a1e', borderColor: '#b91c1c', borderWidth: 1, padding: 12, borderRadius: 10, marginTop: 8 },
  errorTitle: { color: '#ffb4b4', fontWeight: '700', marginBottom: 4 },
  errorText: { color: '#ffd6d6' },

  mt16: { marginTop: 16 },
});
