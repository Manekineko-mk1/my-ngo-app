import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Modal,
  Pressable,
  Platform, Linking
} from "react-native";
import { useState } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Plus,
  Menu,
} from "lucide-react-native";
import { useEvents } from "@/hooks/useEvents";
import CreateEventModal from "@/components/CreateEventModal";
import EventDetailModal from "@/components/EventDetailModal"; // 1. Import Detail Modal
import { useLanguage } from "@/hooks/useLanguage";
import { useProfile } from "@/hooks/useProfile";

export default function HomeScreen() {
  const { t, setLang, lang } = useLanguage();
  const { profile } = useProfile();
  const { nextEvent, upcomingEvents, loading, refresh } = useEvents();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};
  
  // 2. Track which event is currently being viewed
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const showLanguageMenu = () => {
    setIsLangModalVisible(true);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator color="#228B22" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* 1. Header */}
        <View className="pt-20 pb-12 px-8 bg-ngoGreen rounded-b-[50px] shadow-2xl min-h-[220px] justify-center">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1">
                {t("welcome")}
              </Text>
              <Text className="text-white text-2xl font-black leading-tight" numberOfLines={3}>
                {t("orgName")}
              </Text>
            </View>

            <TouchableOpacity
              onPress={showLanguageMenu}
              className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/30"
            >
              <Menu color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

  <View className="p-6 -mt-3">
          {/* 2. Hero Section */}
          <Text className="text-gray-600 font-black mb-4 ml-1 uppercase text-xs tracking-[2px]">
            {t("upcomingEvent")}
          </Text>
          {nextEvent ? (
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setSelectedEvent(nextEvent)} // 3. Open Detail Modal
            >
              <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80" }}
                className="h-64 rounded-[32px] overflow-hidden shadow-xl"
              >
                <View className="flex-1 bg-black/30 p-6 justify-end">
                  <Text className="text-white text-2xl font-black mb-2">
                    {nextEvent.title}
                  </Text>
                  <View className="flex-row items-center mb-1">
                    <CalendarIcon color="white" size={14} />
                    <Text className="text-white/90 text-sm font-bold ml-2">
                      {formatDate(nextEvent.date)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MapPin color="white" size={14} />
                    <Text className="text-white/90 text-sm font-bold ml-2">
                      {nextEvent.location}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <View className="bg-white p-8 rounded-[32px] items-center border border-gray-100">
              <Text className="text-gray-400 font-bold">{t("noUpcomingEvents")}</Text>
            </View>
          )}

          {/* 3. Future Events Section */}
          <View className="mt-8">
            <Text className="text-gray-600 font-black mb-4 ml-1 uppercase text-xs tracking-[2px]">
              {t("futureEvents")}
            </Text>
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => setSelectedEvent(event)} // 4. Open Detail Modal
                className="bg-white p-4 rounded-3xl mb-4 flex-row items-center shadow-sm border border-gray-50"
              >
                <View className="w-16 h-16 bg-ngoGreen/10 rounded-2xl items-center justify-center">
                  <CalendarIcon color="#228B22" size={24} />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-800 font-bold text-lg leading-tight mb-1">
                    {event.title}
                  </Text>
                  <Text className="text-gray-500 text-xs font-medium">
                    {formatDate(event.date)} • {event.location}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Admin FAB */}
      {profile?.role === "admin" && (
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="absolute bottom-6 right-6 w-16 h-16 bg-ngoGreen rounded-full items-center justify-center shadow-xl border-4 border-white/20"
        >
          <Plus color="white" size={32} />
        </TouchableOpacity>
      )}

      {/* Modals */}
      <CreateEventModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          refresh(); // Refresh the list from useEvents hook
          setIsModalVisible(false);
        }}
      />

      <EventDetailModal
        isVisible={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRefresh={refresh} // Pass the refresh function here too
      />

      {/* 5. The Event Detail Modal */}
      <EventDetailModal 
        isVisible={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

      {/* Language Selection Modal */}
      <Modal
        visible={isLangModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-6">
          <View className="bg-white w-full max-w-md rounded-2xl p-6">
            <Text className="text-lg font-bold mb-4">Select Language / 選擇語言</Text>
            {/* ... rest of your language modal buttons ... */}
            <TouchableOpacity
              onPress={() => { setLang("en"); setIsLangModalVisible(false); }}
              className="py-3"
            >
              <Text className="text-base">English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setLang("zh"); setIsLangModalVisible(false); }}
              className="py-3"
            >
              <Text className="text-base">繁體中文</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setLang("fr"); setIsLangModalVisible(false); }}
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