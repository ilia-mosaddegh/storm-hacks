import type { ResultPayload } from '@/types/app';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Convert URL params (strings) into the shape we want
  const fromParams: Partial<ResultPayload> = {
    landmarkId: typeof params.landmarkId === 'string' ? params.landmarkId : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
    location: typeof params.location === 'string' ? params.location : undefined,
    summary: typeof params.summary === 'string' ? params.summary : undefined,
    story: typeof params.story === 'string' ? params.story : undefined,
    imageUrl: typeof params.imageUrl === 'string' ? params.imageUrl : undefined,
    durationSec: params.durationSec ? Number(params.durationSec) : undefined,
    language: typeof params.language === 'string' ? params.language : undefined,
  };

  // React state to store AI's 

  // Fallback mock if any key is missing
  const landmark: ResultPayload = {
    landmarkId: fromParams.landmarkId ?? 'gastown_steam_clock',
    title: fromParams.title ?? 'Gastown Steam Clock',
    location: fromParams.location ?? 'Vancouver, BC',
    summary:
      fromParams.summary ??
      'Built in 1977 by Raymond Saunders, the Gastown Steam Clock was designed to harness steam power from the city’s underground system.',
    story:
      fromParams.story ??
      'In the heart of Gastown, a curious clock breathes steam instead of ticking time. This Victorian-style landmark was built in 1977 and has become one of Vancouver’s most photographed attractions...',
    imageUrl:
      fromParams.imageUrl ??
      'https://upload.wikimedia.org/wikipedia/commons/2/2a/Gastown_Steam_Clock_2023.jpg',
    durationSec: fromParams.durationSec ?? 75,
    language: fromParams.language ?? 'en',
  };

  const [expanded, setExpanded] = useState(false);

    <ScrollView style={styles.container}>
      {/* landmark image */}
      <Image source={{ uri: landmark.imageUrl }} style={styles.headerImage} />

      {/* title + location */}
      <Text style={styles.title}>{landmark.title}</Text>
      <Text style={styles.location}>{landmark.location}</Text>

      {/* summary */}
      <Text style={styles.summary}>{landmark.summary}</Text>

      {/* story text */}
      <Text style={styles.story}>
        {expanded ? landmark.story : landmark.story.slice(0, 150) + '...'}
      </Text>

      {/* read more toggle */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.readMore}>{expanded ? 'Read less' : 'Read more'}</Text>
      </TouchableOpacity>

      {/* main buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/nowplaying')}
      >
        <Text style={styles.primaryButtonText}>Play Narration</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => alert('Bookmarked! (mock)')}
      >
        <Text style={styles.secondaryButtonText}>Bookmark</Text>
      </TouchableOpacity>

      {/* retry button (for demo of error state) */}
      {/* <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Retry</Text>
      </TouchableOpacity> */}
    </ScrollView> ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    color: '#E6E9EF',
    fontSize: 24,
    fontWeight: '700',
  },
  location: {
    color: '#9AA3B2',
    fontSize: 16,
    marginBottom: 10,
  },
  summary: {
    color: '#E6E9EF',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  story: {
    color: '#E6E9EF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  readMore: {
    color: '#7C9CFF',
    fontWeight: '600',
    marginBottom: 25,
  },
  primaryButton: {
    backgroundColor: '#7C9CFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#7C9CFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 60,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#7C9CFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
