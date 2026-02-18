import { Tabs } from 'expo-router';
import { Home, Calendar, Leaf, User } from 'lucide-react-native';

const FOREST_GREEN = "#228B22"; // Our NGO Brand Color

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: FOREST_GREEN,
      tabBarStyle: { borderTopWidth: 1, borderTopColor: '#f3f4f6' },
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { fontWeight: 'bold', color: FOREST_GREEN },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          title: 'Mission',
          tabBarIcon: ({ color }) => <Leaf size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}