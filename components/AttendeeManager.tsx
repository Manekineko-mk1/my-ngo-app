import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Users, CheckCircle } from "lucide-react-native";
import { useLanguage } from "@/hooks/useLanguage";

interface AttendeeManagerProps {
  attendees: any[];
  loading: boolean;
  onToggleCheckIn: (id: string, currentStatus: string) => void;
}

export default function AttendeeManager({
  attendees,
  loading,
  onToggleCheckIn,
}: AttendeeManagerProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <View className="py-8 items-center">
        <ActivityIndicator color="#228B22" />
      </View>
    );
  }

  return (
    <View className="mt-4 mb-10 pt-6 border-t border-gray-100">
      <View className="flex-row items-center mb-4 gap-2">
        <Users size={18} color="#9ca3af" />
        <Text className="text-gray-400 text-[10px] uppercase font-black tracking-widest">
          {t("attendees") || "Attendees"} ({attendees.length})
        </Text>
      </View>

      <View className="gap-y-3">
        {attendees.map((item) => (
          <View
            key={item.id}
            className="bg-gray-50 p-4 rounded-2xl flex-row items-center border border-gray-100"
          >
            <View className="w-10 h-10 bg-ngoGreen/10 rounded-full items-center justify-center">
              <Text className="text-ngoGreen font-bold">
                {item.profiles?.full_name?.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="ml-4 flex-1">
              <Text className="font-bold text-gray-800">
                {item.profiles?.full_name}
              </Text>
              <Text className="text-gray-400 text-xs">
                {item.profiles?.contact_number || "No contact info"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => onToggleCheckIn(item.id, item.status)}
              activeOpacity={0.7}
            >
              <View
                className={`flex-row items-center px-3 py-1.5 rounded-lg border ${
                  item.status === "attended"
                    ? "bg-ngoGreen/10 border-ngoGreen/20"
                    : "bg-white border-gray-200"
                }`}
              >
                {item.status === "attended" && (
                  <CheckCircle size={14} color="#228B22" />
                )}
                <Text
                  className={`text-[10px] font-black uppercase ${
                    item.status === "attended"
                      ? "text-ngoGreen ml-1"
                      : "text-gray-500"
                  }`}
                >
                  {item.status === "attended" ? "Verified" : "Check In"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}

        {attendees.length === 0 && (
          <Text className="text-gray-400 italic text-center text-sm py-4">
            No hikers signed up yet.
          </Text>
        )}
      </View>
    </View>
  );
}
