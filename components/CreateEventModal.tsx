import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { X, Save } from "lucide-react-native";
import { supabase } from "@/lib/supabase";

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEventModal({ visible, onClose, onSuccess }: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  async function handleCreateEvent() {
    if (!title || !location || !date) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) {
      Alert.alert("Invalid Date", "Use format: YYYY-MM-DD HH:MM");
      return;
    }

    const { error } = await supabase
      .from("events")
      .insert([{ 
        title, 
        location, 
        date: new Date(timestamp).toISOString() 
      }]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Hike published!");
      setTitle(""); setLocation(""); setDate(""); 
      onSuccess();
      onClose();
    }
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-[40px] p-8 h-[80%]">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-black text-gray-900">New Event</Text>
            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <X color="black" size={20} />
            </TouchableOpacity>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-gray-400 font-bold mb-2 ml-1">EVENT NAME</Text>
              <TextInput 
                value={title} onChangeText={setTitle} placeholder="e.g. Blue Ridge Summit"
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              />
            </View>

            <View>
              <Text className="text-gray-400 font-bold mb-2 ml-1">LOCATION</Text>
              <TextInput 
                value={location} onChangeText={setLocation} placeholder="e.g. National Park"
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              />
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2 ml-1">
                <Text className="text-gray-400 font-bold">DATE & TIME</Text>
                <Text className="text-ngoGreen text-xs font-bold">YYYY-MM-DD HH:MM</Text>
              </View>
              <TextInput 
                value={date} onChangeText={setDate} placeholder="2026-05-20 09:00"
                keyboardType="numbers-and-punctuation"
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
              />
            </View>

            <TouchableOpacity 
              onPress={handleCreateEvent}
              className="bg-ngoGreen flex-row items-center justify-center p-5 rounded-2xl mt-4 shadow-md"
            >
              <Save color="white" size={20} />
              <Text className="text-white font-bold text-lg ml-2">Publish Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}