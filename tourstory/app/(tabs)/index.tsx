import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* header image */}
      <Image
        source={require('@/assets/images/location-removebg-preview.png')}
        style={styles.headerImage}
      />

      {/* title + subtitle */}
      <Text style={styles.title}>Tour Story 🎧</Text>
      <Text style={styles.subtitle}>Point at a landmark. Hear its story.</Text>

      {/* buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/camera')}   // 👈 navigate to new screen
      >
        <Text style={styles.primaryButtonText}>Scan Landmark</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Choose Photo from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: 220,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    color: '#E6E9EF',
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: '#9AA3B2',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#7C9CFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#7C9CFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#7C9CFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
