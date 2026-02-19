import React, { useState, useEffect } from "react";
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
import { useLanguage } from "@/hooks/useLanguage";

interface CreateEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialEvent?: any; // Pass an event object here to enter "Edit Mode"
}

export default function CreateEventModal({
  isVisible,
  onClose,
  onSuccess,
  initialEvent,
}: CreateEventModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync state with initialEvent when it changes (Edit vs Create)
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || "");
      setLocation(initialEvent.location || "");
      setDescription(initialEvent.description || "");
      
      // Convert ISO string back to editable format: YYYY-MM-DD HH:MM
      if (initialEvent.date) {
        const d = new Date(initialEvent.date);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setDate(formattedDate);
      }
    } else {
      // Reset fields for "Create Mode"
      setTitle("");
      setLocation("");
      setDate("");
      setDescription("");
    }
  }, [initialEvent, isVisible]);

  async function handleSave() {
    if (!title || !location || !date) {
      Alert.alert(t("error"), t("missingInfo"));
      return;
    }

    const timestamp = Date.parse(date.replace(/-/g, '/'));
    if (isNaN(timestamp)) {
      Alert.alert(t("error"), t("invalidDate"));
      return;
    }

    setLoading(true);
    const eventData = {
      title,
      location,
      description,
      date: new Date(timestamp).toISOString(),
    };

    try {
      let error;
      if (initialEvent?.id) {
        // UPDATE Existing
        const { error: updateError } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", initialEvent.id);
        error = updateError;
      } else {
        // INSERT New
        const { error: insertError } = await supabase
          .from("events")
          .insert([eventData]);
        error = insertError;
      }

      if (error) throw error;

      Alert.alert("✨", initialEvent ? t("updateSuccess") : t("createSuccess") || "Success");
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert(t("error"), error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] h-[90%] px-6 pt-8">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-black text-gray-900">
                {initialEvent ? t("editEvent") : t("newEvent")}
              </Text>
              <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-y-6">
                {/* Title */}
                <View>
                  <Text className="text-gray-400 font-black mb-2 ml-1 uppercase text-[10px] tracking-widest">
                    {t("eventTitle")}
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <Type size={18} color="#9ca3af" />
                    <TextInput
                      value={title}
                      onChangeText={setTitle}
                      placeholder="e.g. Mont-Royal Hike"
                      className="flex-1 p-4 font-bold text-gray-700"
                    />
                  </View>
                </View>

                {/* Location */}
                <View>
                  <Text className="text-gray-400 font-black mb-2 ml-1 uppercase text-[10px] tracking-widest">
                    {t("eventLocation")}
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <MapPin size={18} color="#9ca3af" />
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      placeholder="e.g. Beaver Lake Entrance"
                      className="flex-1 p-4 font-bold text-gray-700"
                    />
                  </View>
                </View>

                {/* Date */}
                <View>
                  <View className="flex-row justify-between items-center mb-2 ml-1">
                    <Text className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
                      {t("eventDate")}
                    </Text>
                    <Text className="text-ngoGreen font-bold text-[10px]">YYYY-MM-DD HH:MM</Text>
                  </View>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <Calendar size={18} color="#9ca3af" />
                    <TextInput
                      value={date}
                      onChangeText={setDate}
                      placeholder="2026-05-20 09:00"
                      keyboardType="numbers-and-punctuation"
                      className="flex-1 p-4 font-bold text-gray-700"
                    />
                  </View>
                </View>

                {/* Description */}
                <View>
                  <Text className="text-gray-400 font-black mb-2 ml-1 uppercase text-[10px] tracking-widest">
                    {t("eventDescription")}
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t("descPlaceholder")}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-700 h-32 font-medium"
                  />
                </View>

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={loading}
                  className={`bg-ngoGreen flex-row items-center justify-center p-5 rounded-2xl mt-4 shadow-lg ${loading ? "opacity-50" : "active:scale-95"}`}
                >
                  <Save color="white" size={20} />
                  <Text className="text-white font-black text-lg ml-2">
                    {loading ? t("creating") : initialEvent ? t("saveBtn") : t("createBtn")}
                  </Text>
                </TouchableOpacity>

                <View className="h-20" />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}