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
import { useAttendees } from "@/hooks/useAttendees";
import CreateEventModal from "./CreateEventModal";
import AttendeeManager from "./AttendeeManager"; // Import the new component

export default function EventDetailModal({
  isVisible,
  onClose,
  event,
  onRefresh,
}: any) {
  const { t, lang } = useLanguage();
  const { profile } = useProfile();
  const { isSignedUp, status, signUp, cancel, checkIn } = useRegistration(
    event?.id,
    profile?.id,
  );
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const {
    attendees,
    loading: loadingAttendees,
    refresh: refreshAttendees,
  } = useAttendees(profile?.role === "admin" ? event?.id : null);

  if (!event) return null;

  const toggleCheckIn = async (
    registrationId: string,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "attended" ? "signed_up" : "attended";
    const { error } = await supabase
      .from("registrations")
      .update({ status: newStatus })
      .eq("id", registrationId);
    if (error) Alert.alert(t("error"), error.message);
    else refreshAttendees();
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    if (error) Alert.alert(t("error"), error.message);
    else {
      onRefresh?.();
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="bg-white rounded-t-[40px] h-[85%] px-6 pt-8 pb-10">
          {/* Header Section */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-gray-900 flex-1">
              {event.title}
            </Text>
            {profile?.role === "admin" && (
              <View className="flex-row gap-x-2 mr-2">
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(true)}
                  className="bg-blue-50 p-2 rounded-full"
                >
                  <Edit size={20} color="#2563eb" />
                </TouchableOpacity>
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
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 p-2 rounded-full"
            >
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Event Description */}
            <Text className="text-gray-600 text-lg leading-7 mb-6">
              {event.description}
            </Text>

            {/* ADMIN ONLY SECTION */}
            {profile?.role === "admin" && (
              <AttendeeManager
                attendees={attendees}
                loading={loadingAttendees}
                onToggleCheckIn={toggleCheckIn}
              />
            )}
          </ScrollView>

          {/* Registration Footer */}
          <View className="pt-4 border-t border-gray-100">
            {!isSignedUp ? (
              <TouchableOpacity
                onPress={signUp}
                className="bg-ngoGreen h-16 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-black text-lg">
                  {t("signUp")}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="gap-y-3">
                <TouchableOpacity
                  onPress={status === "attended" ? undefined : checkIn}
                  className={`h-16 rounded-2xl flex-row items-center justify-center ${status === "attended" ? "bg-gray-100" : "bg-blue-600"}`}
                >
                  <CheckCircle2
                    color={status === "attended" ? "#228B22" : "white"}
                    size={20}
                  />
                  <Text
                    className={`font-black text-lg ml-2 ${status === "attended" ? "text-ngoGreen" : "text-white"}`}
                  >
                    {status === "attended"
                      ? t("verifiedAttendee")
                      : t("checkIn")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancel}
                  className="h-12 items-center justify-center"
                >
                  <Text className="text-red-500 font-bold">
                    {t("cancelRegistration")}
                  </Text>
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
