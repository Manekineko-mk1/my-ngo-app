import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextEvent() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(1)
        .single();

      if (!error) setNextEvent(data);
      setLoading(false);
    }
    fetchNextEvent();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Header Section with Logo */}
      <View className="pt-16 pb-6 px-6 bg-ngoGreen items-center rounded-b-[40px] shadow-lg">
        <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-2">
          <Text className="text-3xl">🌲</Text>
        </View>
        <Text className="text-white text-2xl font-black tracking-tight">NGO HIKER</Text>
      </View>

      <View className="p-6 -mt-8">
        <Text className="text-gray-900 text-xl font-bold mb-4">Your Next Adventure</Text>
        
        {loading ? (
          <View className="h-48 justify-center bg-gray-50 rounded-3xl">
            <ActivityIndicator color="#228B22" />
          </View>
        ) : nextEvent ? (
          <TouchableOpacity className="overflow-hidden rounded-3xl shadow-xl bg-slate-900 h-64">
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000' }}
              className="flex-1 justify-end p-6"
            >
              {/* Gradient Overlay Effect */}
              <View className="absolute inset-0 bg-black/40" />
              
              <View>
                <Text className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
                  {new Date(nextEvent.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </Text>
                <Text className="text-white text-3xl font-black mb-2">{nextEvent.title}</Text>
                <View className="flex-row items-center">
                  <Text className="text-white/90 font-medium italic">{nextEvent.location}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-100 p-8 rounded-3xl items-center border border-dashed border-gray-300">
            <Text className="text-gray-400 font-medium text-center">No hikes scheduled yet. Check back soon!</Text>
          </View>
        )}
      </View>
    </View>
  );
}