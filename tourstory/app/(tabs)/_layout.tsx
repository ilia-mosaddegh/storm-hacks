import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 👇 Import the PlayerProvider (adjust the path if needed)
import { PlayerProvider } from '../_providers/PlayerProvider'; 
// If your folder structure is different, try './_providers/PlayerProvider' or '../../_providers/PlayerProvider'

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // 👇 Wrap Tabs inside PlayerProvider
    <PlayerProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="nowplaying"
          options={{
            title: 'Now Playing',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="headphones" color={color} />,
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: 'Bookmarks',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="bookmark" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape" color={color} />,
          }}
        />
      </Tabs>
    </PlayerProvider>
  );
}
