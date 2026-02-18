import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { MapPin, Calendar as CalendarIcon, Plus, Menu } from "lucide-react-native";
import { useEvents } from "@/hooks/useEvents";
import CreateEventModal from "@/components/CreateEventModal";
import { useLanguage } from "@/hooks/useLanguage";

export default function HomeScreen() {
  const { t, setLang } = useLanguage();
  const { nextEvent, upcomingEvents, loading, refresh } = useEvents();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  const showLanguageMenu = () => {
    // Use a custom Modal for cross-platform (web doesn't support Alert buttons)
    setIsLangModalVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* 1. Header */}
        <View className="pt-20 pb-12 px-8 bg-ngoGreen rounded-b-[50px] shadow-2xl">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white/70 font-bold uppercase tracking-widest text-xs">
                {t('welcome')}
              </Text>
              <Text className="text-white text-3xl font-black italic">{t('orgName')}</Text>
            </View>
            <TouchableOpacity
              onPress={showLanguageMenu}
              className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/30"
            >
              <Menu color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Hero Card */}
        <View className="px-6 -mt-6">
          <View className="bg-white p-2 rounded-[32px] shadow-sm">
            {loading ? (
              <View className="h-64 justify-center">
                <ActivityIndicator color="#228B22" />
              </View>
            ) : nextEvent ? (
              <TouchableOpacity
                activeOpacity={0.9}
                className="overflow-hidden rounded-[28px] h-80 bg-slate-200"
              >
                <ImageBackground
                  source={{ uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000" }}
                  className="flex-1 justify-end"
                >
                  <View className="absolute inset-0 bg-black/30" />
                  <View className="p-6">
                    <View className="bg-ngoGreen self-start px-3 py-1 rounded-full mb-2">
                      <Text className="text-white text-[10px] font-black uppercase tracking-tighter">
                        {t('nextHike')}
                      </Text>
                    </View>
                    <Text className="text-white text-3xl font-extrabold leading-tight mb-2">
                      {nextEvent.title}
                    </Text>
                    <View className="flex-row items-center opacity-90 mb-1">
                      <MapPin size={14} color="white" />
                      <Text className="text-white ml-1 font-medium">{nextEvent.location}</Text>
                    </View>
                    <View className="flex-row items-center opacity-90">
                      <CalendarIcon size={14} color="white" />
                      <Text className="text-white ml-1 font-medium">
                        {new Date(nextEvent.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ) : (
              <View className="p-10 items-center">
                <Text className="text-gray-400 font-bold">No upcoming hikes</Text>
              </View>
            )}
          </View>

          {/* 3. More Adventures */}
          <View className="mt-8 px-2 pb-24">
            <Text className="text-xl font-black text-gray-900 mb-4 px-2">
              {t('moreAdv')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 8, paddingRight: 20, paddingBottom: 10 }}
            >
              {upcomingEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={{ elevation: 2 }}
                  className="bg-white mr-4 p-4 rounded-3xl shadow-sm border border-gray-100 w-64"
                >
                  <View className="bg-gray-100 h-32 rounded-2xl mb-3 items-center justify-center overflow-hidden">
                    <Text className="text-3xl opacity-40">⛰️</Text>
                  </View>
                  <Text className="font-bold text-gray-900 text-lg" numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">{event.location}</Text>
                  <Text className="text-ngoGreen font-bold text-xs">
                    {new Date(event.date).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Admin FAB */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={{ elevation: 5 }}
        className="absolute bottom-6 right-6 bg-ngoGreen w-16 h-16 rounded-full items-center justify-center shadow-2xl z-50"
      >
        <Plus color="white" size={32} strokeWidth={3} />
      </TouchableOpacity>

      <CreateEventModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={refresh}
      />

      {/* Language selection modal (cross-platform) */}
      <Modal
        visible={isLangModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="bg-white w-full max-w-md rounded-2xl p-6">
            <Text className="text-lg font-bold mb-4">Select Language / 選擇語言</Text>

            <TouchableOpacity
              onPress={() => {
                setLang("en");
                setIsLangModalVisible(false);
              }}
              className="py-3"
            >
              <Text className="text-base">English</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setLang("zh");
                setIsLangModalVisible(false);
              }}
              className="py-3"
            >
              <Text className="text-base">繁體中文</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setLang("fr");
                setIsLangModalVisible(false);
              }}
              className="py-3"
            >
              <Text className="text-base">Français</Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => setIsLangModalVisible(false)}
              className="mt-4 py-3 items-center"
            >
              <Text className="text-ngoGreen font-bold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}