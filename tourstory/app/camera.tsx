
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // ask permission on mount if not yet granted
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // if permission not asked yet
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  // if denied
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera access is required.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // if photo taken → show preview
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setPhoto(null)}>
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => alert('Use Photo pressed! (next step: upload)')}>
            <Text style={styles.primaryButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // live camera view
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      <TouchableOpacity
        style={styles.captureButton}
        onPress={async () => {
          if (cameraRef.current) {
            const result = await cameraRef.current.takePictureAsync();
            setPhoto(result.uri);
          }
        }}>
        <Text style={styles.primaryButtonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#E6E9EF', fontSize: 18 },
  camera: { flex: 1, width: '100%' },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#7C9CFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  preview: { width: '100%', height: '80%', resizeMode: 'contain' },
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 20 },
  primaryButton: {
    backgroundColor: '#7C9CFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#7C9CFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  secondaryButtonText: { color: '#7C9CFF', fontWeight: '600', fontSize: 16 },
});
