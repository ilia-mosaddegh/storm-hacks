import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const router = useRouter();

  async function onPickFromGallery() {
    try {
      // no need for explicit permissions if you use launchImageLibraryAsync (Expo handles it)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,          // full quality (0–1)
        allowsEditing: false, // no crop UI
        exif: false,
        base64: false,
      });

      if (result.canceled) {
        console.log('User canceled image selection');
        return;
      }

      const imageUri = result.assets[0].uri;
      router.push({
        pathname: '/result',
        params: { imageUrl: imageUri, requestId: String(Date.now()) },
      });
    } catch (err) {
      console.error('Error picking image:', err);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/location-removebg-preview.png')}
        style={styles.headerImage}
      />

      <Text style={styles.title}>Tour Story 🎧</Text>
      <Text style={styles.subtitle}>Point at a landmark. Hear its story.</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/camera')}
      >
        <Text style={styles.primaryButtonText}>Scan Landmark</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onPickFromGallery}
      >
        <Text style={styles.secondaryButtonText}>Choose Photo from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', alignItems: 'center', justifyContent: 'center' },
  headerImage: { width: 220, height: 150, resizeMode: 'contain', marginBottom: 30 },
  title: { color: '#E6E9EF', fontSize: 24, fontWeight: '600' },
  subtitle: { color: '#9AA3B2', fontSize: 16, marginVertical: 10, textAlign: 'center' },
  primaryButton: { backgroundColor: '#7C9CFF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginTop: 30 },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: '#7C9CFF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginTop: 15 },
  secondaryButtonText: { color: '#7C9CFF', fontWeight: '600', fontSize: 16 },
});
