import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, Leaf, User } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';

export default function TabLayout() {
  const { t } = useLanguage();
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#228B22', // Forest Green
      headerShown: false,
      tabBarStyle: { height: 60, paddingBottom: 9 }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('events'),
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          title: t('mission'),
          tabBarIcon: ({ color }) => <Leaf size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}