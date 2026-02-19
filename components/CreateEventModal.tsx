import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Save, MapPin, Calendar, Type } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/hooks/useLanguage"; // Added import

interface CreateEventModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateEventModal({
  isVisible,
  onClose,
}: CreateEventModalProps) {
  const { t } = useLanguage(); // Initialize translation hook
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateEvent() {
    // Use localized alert messages
    if (!title || !location || !date) {
      Alert.alert(t("error"), t("missingInfo"));
      return;
    }

    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) {
      Alert.alert(t("error"), t("invalidDate"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        description,
        date: new Date(timestamp).toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert(t("error"), error.message);
    } else {
      // Clear form on success
      setTitle("");
      setLocation("");
      setDate("");
      setDescription("");
      onClose();
    }
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] h-[90%] p-8">
            {/* Header - Renamed to New Event */}
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-black text-gray-800">
                {t("newEvent")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 p-2 rounded-full"
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="space-y-6"
            >
              {/* Event Title */}
              <View>
                <View className="flex-row items-center mb-2 ml-1">
                  <Type size={14} color="#9ca3af" />
                  <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest ml-2">
                    {t("eventTitle")}
                  </Text>
                </View>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Cultural Workshop"
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-gray-700"
                />
              </View>

              {/* Location */}
              <View>
                <View className="flex-row items-center mb-2 ml-1">
                  <MapPin size={14} color="#9ca3af" />
                  <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest ml-2">
                    {t("eventLocation")}
                  </Text>
                </View>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Community Center"
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-gray-700"
                />
              </View>

              {/* Date & Time */}
              <View>
                <View className="flex-row justify-between items-center mb-2 ml-1">
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#9ca3af" />
                    <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest ml-2">
                      {t("eventDate")}
                    </Text>
                  </View>
                  <Text className="text-ngoGreen text-[10px] font-bold">
                    YYYY-MM-DD HH:MM
                  </Text>
                </View>
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="2026-05-20 09:00"
                  keyboardType="numbers-and-punctuation"
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-gray-700"
                />
              </View>

              {/* Description */}
              <View>
                <Text className="text-gray-400 font-bold mb-2 ml-1 uppercase text-[10px] tracking-widest">
                  {t("eventDescription")}
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t("descPlaceholder")}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-700 h-32"
                />
              </View>

              {/* Submit Button - Localized */}
              <TouchableOpacity
                onPress={handleCreateEvent}
                disabled={loading}
                className={`bg-ngoGreen flex-row items-center justify-center p-5 rounded-2xl mt-4 shadow-md ${loading ? "opacity-50" : ""}`}
              >
                <Save color="white" size={20} />
                <Text className="text-white font-black text-lg ml-2">
                  {loading ? t("creating") : t("createBtn")}
                </Text>
              </TouchableOpacity>

              <View className="h-20" />
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
