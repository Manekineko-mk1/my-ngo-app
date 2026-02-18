import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, Heart, BookOpen } from 'lucide-react-native';
import { useLanguage } from "@/hooks/useLanguage";

export default function MissionScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="pt-20 pb-12 px-8 bg-ngoGreen rounded-b-[50px] shadow-2xl">
        <Text className="text-white text-4xl font-black italic">
          {t('missionTitle')}
        </Text>
      </View>

      <View className="p-8 -mt-10 bg-white rounded-t-[40px] flex-1">
        {/* Mission Body */}
        <View className="mb-10">
          <View className="flex-row items-center mb-4">
            <BookOpen color="#228B22" size={20} />
            <Text className="text-ngoGreen font-bold uppercase tracking-widest ml-2">HKCLS</Text>
          </View>
          <Text className="text-gray-700 text-lg leading-7 text-justify">
            {t('missionBody')}
          </Text>
        </View>

        {/* Pillars Section - Fetches the array from useLanguage */}
        <View className="flex-row justify-between mb-8">
          {t('pillars').map((pillar: string, i: number) => (
            <View key={i} className="bg-gray-50 items-center justify-center p-4 rounded-3xl border border-gray-100 w-[30%]">
              <Heart color="#228B22" size={18} fill="#228B22" opacity={0.2} />
              <Text className="font-bold text-gray-800 mt-2 text-xs">{pillar}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}