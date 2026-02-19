import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Linking,
  Platform,
  Alert,
} from "react-native";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Navigation,
  Edit,
  Trash2,
} from "lucide-react-native";
import { useLanguage } from "@/hooks/useLanguage";
import { useRegistration } from "@/hooks/useRegistration";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import CreateEventModal from "./CreateEventModal";

interface EventDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  event: any;
  onRefresh?: () => void;
}

export default function EventDetailModal({
  isVisible,
  onClose,
  event,
  onRefresh,
}: EventDetailModalProps) {
  const { t, lang } = useLanguage();
  const { profile } = useProfile();
  const { isSignedUp, status, signUp, cancel, checkIn } = useRegistration(
    event?.id,
    profile?.id
  );

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  if (!event) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(lang, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date(dateString));
    } catch (e) { return dateString; }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(lang, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch (e) { return ""; }
  };

  const openMap = () => {
    const encodedLocation = encodeURIComponent(event.location);
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedLocation}`,
      android: `geo:0,0?q=${encodedLocation}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleDelete = async () => {
    const performDelete = async () => {
      const { error } = await supabase.from("events").delete().eq("id", event.id);
      if (error) {
        Alert.alert(t("error"), error.message);
      } else {
        if (onRefresh) onRefresh();
        onClose();
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(t("confirmDelete") || "Are you sure?")) performDelete();
    } else {
      Alert.alert(t("deleteEvent"), t("confirmDelete"), [
        { text: t("cancel"), style: "cancel" },
        { text: t("delete"), style: "destructive", onPress: performDelete },
      ]);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="bg-white rounded-t-[40px] h-[85%] px-6 pt-8 pb-10 shadow-2xl">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-black text-gray-900 leading-tight">
                {event.title}
              </Text>
            </View>

            {/* Admin Actions */}
            {profile?.role === "admin" && (
              <View className="flex-row items-center gap-x-2 mr-2">
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(true)}
                  className="bg-blue-50 p-2 rounded-full"
                >
                  <Edit size={20} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  className="bg-red-50 p-2 rounded-full"
                >
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stats Row */}
            <View className="flex-row flex-wrap gap-4 mb-8">
              <View className="bg-gray-50 p-4 rounded-2xl flex-1 min-w-[140px] border border-gray-100">
                <Calendar size={20} color="#228B22" />
                <Text className="text-gray-400 text-[10px] uppercase font-black mt-2 tracking-widest">{t("eventDate")}</Text>
                <Text className="text-gray-800 font-bold mt-1">{formatDate(event.date)}</Text>
              </View>
              <View className="bg-gray-50 p-4 rounded-2xl flex-1 min-w-[140px] border border-gray-100">
                <Clock size={20} color="#228B22" />
                <Text className="text-gray-400 text-[10px] uppercase font-black mt-2 tracking-widest">{t("time")}</Text>
                <Text className="text-gray-800 font-bold mt-1">{formatTime(event.date)}</Text>
              </View>
            </View>

            {/* Location */}
            <TouchableOpacity onPress={openMap} className="bg-ngoGreen/5 border border-ngoGreen/10 p-5 rounded-3xl flex-row items-center mb-8 active:opacity-70">
              <View className="bg-ngoGreen p-3 rounded-2xl">
                <Navigation size={20} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-ngoGreen font-black text-[10px] uppercase tracking-widest">{t("location")}</Text>
                <Text className="text-gray-700 font-bold text-lg" numberOfLines={1}>{event.location}</Text>
              </View>
            </TouchableOpacity>

            <Text className="text-gray-400 text-[10px] uppercase font-black tracking-[2px] mb-3 ml-1">{t("description")}</Text>
            <Text className="text-gray-600 text-lg leading-7 mb-10">{event.description || "..."}</Text>
          </ScrollView>

          {/* Registration Actions */}
          <View className="pt-4 border-t border-gray-100">
            {!isSignedUp ? (
              <TouchableOpacity onPress={signUp} className="bg-ngoGreen h-16 rounded-2xl flex-row items-center justify-center shadow-lg active:scale-95">
                <Text className="text-white font-black text-lg">{t("signUp")}</Text>
              </TouchableOpacity>
            ) : (
              <View className="gap-y-3">
                {status !== "attended" && (
                  <TouchableOpacity onPress={checkIn} className="bg-blue-600 h-16 rounded-2xl flex-row items-center justify-center shadow-lg active:scale-95">
                    <CheckCircle2 color="white" size={20} />
                    <Text className="text-white font-black text-lg ml-2">{t("checkIn")}</Text>
                  </TouchableOpacity>
                )}
                {status === "attended" && (
                  <View className="bg-gray-100 h-16 rounded-2xl flex-row items-center justify-center border border-gray-200">
                    <CheckCircle2 color="#228B22" size={20} />
                    <Text className="text-ngoGreen font-black text-lg ml-2">{t("verifiedAttendee")}</Text>
                  </View>
                )}
                <TouchableOpacity onPress={cancel} className="h-12 items-center justify-center">
                  <Text className="text-red-500 font-bold">{t("cancelRegistration")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <CreateEventModal
        isVisible={isEditModalVisible}
        initialEvent={event}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={() => {
          setIsEditModalVisible(false);
          if (onRefresh) onRefresh();
          onClose(); 
        }}
      />
    </Modal>
  );
}