// app/(tabs)/nowplaying.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { usePlayer } from '../../providers/PlayerProvider';

const DEFAULT_AUDIO_URL = 'https://your-audio-url.mp3'; // TODO: put your real audio URL

export default function NowPlaying() {
  const player = usePlayer(); // { state, isPlaying, url, play, pause, stop }

  const onTogglePlay = () => {
    if (player.isPlaying) {
      player.pause();
    } else {
      // Use existing url if present, otherwise a default one
      player.play(player.url ?? DEFAULT_AUDIO_URL);
    }
  };

  return (
    <View style={styles.container}>
      {/* If you have a cover image URL, render it here.
         Since our PlayerProvider doesn't expose track/cover, we'll show a placeholder. */}
      <View style={[styles.cover, styles.coverPlaceholder]}>
        {/* You can swap the placeholder with an actual image later:
            <Image source={{ uri: coverUrl }} style={styles.cover} contentFit="cover" />
        */}
      </View>

      <Text style={styles.title}>Tour Story</Text>
      <Text style={styles.subtitle}>Status: {player.state}</Text>

      <TouchableOpacity
        style={[styles.btn, player.isPlaying && styles.btnActive]}
        onPress={onTogglePlay}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>{player.isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>

      {/* Optional Stop button */}
      <TouchableOpacity style={[styles.btn, styles.mt8]} onPress={() => player.stop()} activeOpacity={0.8}>
        <Text style={styles.btnText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0B0F19', alignItems:'center', justifyContent:'center', padding:16 },
  cover:{ width:'86%', height:260, borderRadius:14, backgroundColor:'#222', marginBottom:14 },
  coverPlaceholder:{ borderWidth:1, borderColor:'#333' },
  title:{ color:'#E6E9EF', fontSize:20, fontWeight:'700', marginBottom:6, textAlign:'center' },
  subtitle:{ color:'#9AA3B2', marginBottom:14 },
  btn:{ borderWidth:1, borderColor:'#7C9CFF', paddingVertical:12, paddingHorizontal:18, borderRadius:10 },
  btnActive:{ backgroundColor:'#7C9CFF' },
  btnText:{ color:'#E6E9EF', fontWeight:'600' },
  mt8:{ marginTop:8 }
});
