import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { X, CheckCircle2, Edit, Trash2 } from "lucide-react-native";
import { useLanguage } from "@/hooks/useLanguage";
import { useRegistration } from "@/hooks/useRegistration";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useAttendees } from "@/hooks/useAttendees";
import CreateEventModal from "./CreateEventModal";
import AttendeeManager from "./AttendeeManager";

export default function EventDetailModal({ isVisible, onClose, event, onRefresh }: any) {
  const { t } = useLanguage();
  const { profile } = useProfile();
  
  // Registration hook for the CURRENT user/admin
  const { isSignedUp, registrationId, status, signUp, cancel, checkIn, checkStatus } =
    useRegistration(event?.id, profile?.id);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hook for the full attendee list
  const {
    attendees,
    loading: loadingAttendees,
    refresh: refreshAttendees,
  } = useAttendees(profile?.role === "admin" ? event?.id : null);

  // Background Polling (1 minute)
  useEffect(() => {
    let interval: any;
    if (isVisible && profile?.role === "admin") {
      interval = setInterval(() => { refreshAttendees(); }, 60000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isVisible, profile?.role, refreshAttendees]);

  if (!event) return null;

  // --- ACTION HANDLERS ---

  const handleSignUp = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const result = await signUp();
    if (result && !result.error) await refreshAttendees();
    setIsProcessing(false);
  };

  const handleCheckIn = async () => {
    if (isProcessing || status === "attended") return;
    setIsProcessing(true);
    const result = await checkIn();
    if (result && !result.error) await refreshAttendees();
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const result = await cancel();
    if (result && !result.error) await refreshAttendees();
    setIsProcessing(false);
  };

  const toggleAdminCheckIn = async (id: string, currentStatus: string) => {
  const newStatus = currentStatus === "attended" ? "signed_up" : "attended";
  
  // 1. Perform the update
  const { error } = await supabase
    .from("registrations")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    Alert.alert(t("error"), error.message);
  } else {
    // 2. Refresh the attendee list (the faces/names)
    await refreshAttendees();
    
    // 3. CRITICAL: If the ID we just toggled belongs to the LOGGED-IN user,
    // we must tell useRegistration to re-fetch the status for the footer bar.
    if (id === registrationId) {
      await checkStatus();
    }
  }
};

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View className="flex-1 bg-black/60 justify-end">
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <View className="bg-white rounded-t-[40px] h-[90%] px-6 pt-8 pb-10 shadow-2xl">
          
          {/* SECTION: HEADER & ADMIN CONTROLS */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black text-gray-900 flex-1 pr-2">
              {event.title}
            </Text>
            {profile?.role === "admin" && (
              <View className="flex-row gap-x-2 mr-2">
                <TouchableOpacity onPress={() => setIsEditModalVisible(true)} className="bg-blue-50 p-2 rounded-full">
                  <Edit size={20} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} className="bg-red-50 p-2 rounded-full">
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* SECTION: EVENT BODY (Description & Attendees) */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-gray-600 text-lg leading-7 mb-8">
              {event.description}
            </Text>

            {/* Attendee List (John Travolta lives here) */}
            {profile?.role === "admin" && (
              <AttendeeManager
                attendees={attendees}
                loading={loadingAttendees}
                onToggleCheckIn={toggleAdminCheckIn}
              />
            )}
          </ScrollView>

          {/* SECTION: BOTTOM ACTION BAR (Sign-up / Check-in) */}
          <View className="pt-4 border-t border-gray-100">
            {!isSignedUp ? (
              /* Case: Not Registered */
              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isProcessing}
                className="bg-ngoGreen h-16 rounded-2xl items-center justify-center shadow-lg active:scale-95"
              >
                {isProcessing ? <ActivityIndicator color="white" /> : <Text className="text-white font-black text-lg">{t("signUp")}</Text>}
              </TouchableOpacity>
            ) : (
              /* Case: Registered - Show Check-in and Cancel options */
              <View className="gap-y-3">
                <TouchableOpacity
                  onPress={status === "attended" ? undefined : handleCheckIn}
                  disabled={isProcessing}
                  className={`h-16 rounded-2xl flex-row items-center justify-center shadow-md ${
                    status === "attended" ? "bg-gray-50 border border-gray-100" : "bg-blue-600 active:scale-95"
                  }`}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={status === "attended" ? "#228B22" : "white"} />
                  ) : (
                    <>
                      <CheckCircle2 color={status === "attended" ? "#228B22" : "white"} size={20} />
                      <Text className={`font-black text-lg ml-2 ${status === "attended" ? "text-ngoGreen" : "text-white"}`}>
                        {status === "attended" ? t("verifiedAttendee") : t("checkIn")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCancel} disabled={isProcessing} className="h-12 items-center justify-center">
                  <Text className={`font-bold ${isProcessing ? "text-gray-300" : "text-red-500"}`}>{t("cancelRegistration")}</Text>
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