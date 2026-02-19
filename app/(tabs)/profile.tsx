import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import {
  User,
  Languages,
  LogOut,
  Save,
  Shield,
  ChevronRight,
} from "lucide-react-native";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function ProfileScreen() {
  const { profile, loading, updateProfile } = useProfile();
  const { t, lang, setLang } = useLanguage(); // Now works after fixing the hook!
  const [name, setName] = useState("");
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  // Sync internal input state with profile data when it loads
  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile]);

  const handleSave = async () => {
    const { error } = await updateProfile({
      full_name: name,
      preferred_lang: lang,
    });

    if (error) {
      const message =
        typeof error === "string"
          ? error
          : ((error as any)?.message ?? String(error));
      Alert.alert(t("error"), message);
    } else {
      Alert.alert("✨", t("updateSuccess"));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center bg-gray-50">
        <ActivityIndicator color="#228B22" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header / Avatar Section */}
        <View className="pt-20 pb-12 px-8 bg-ngoGreen rounded-b-[50px] shadow-2xl items-center">
          <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center border-2 border-white/50 mb-4">
            {name ? (
              <Text className="text-white text-4xl font-black">
                {name.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <User color="white" size={40} />
            )}
          </View>

          <Text className="text-white text-2xl font-black text-center">
            {name || "..."}
          </Text>

          <View className="bg-white/20 px-4 py-1.5 rounded-full mt-3 border border-white/30">
            <Text className="text-white text-[10px] font-black uppercase tracking-widest">
              {profile?.role === "admin" ? t("adminBadge") : t("memberBadge")}
            </Text>
          </View>
        </View>

        <View className="p-6 -mt-4">
          {/* Settings Card */}
          <View className="bg-white rounded-[32px] p-8 shadow-sm mb-6">
            <Text className="text-gray-400 font-black mb-6 ml-1 uppercase text-[10px] tracking-[2px]">
              {t("settings")}
            </Text>

            <View>
              {/* Name Input */}
              <View className="mb-8">
                <Text className="text-gray-400 text-xs font-bold mb-2 ml-1">
                  {t("displayNameLabel")}
                </Text>
                <View className="flex-row items-center border-b border-gray-100 pb-2">
                  <User size={18} color="#228B22" />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className="flex-1 ml-4 text-lg font-bold text-gray-800"
                    placeholder="..."
                  />
                </View>
              </View>

              {/* Language Selection Trigger */}
              <TouchableOpacity
                onPress={() => setIsLangModalVisible(true)}
                className="active:opacity-60"
              >
                <Text className="text-gray-400 text-xs font-bold mb-2 ml-1">
                  {t("langPref")}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Languages size={18} color="#228B22" />
                    <Text className="ml-4 text-lg font-bold text-gray-800">
                      {lang === "en"
                        ? "English"
                        : lang === "zh"
                          ? "繁體中文"
                          : "Français"}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#ccc" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-ngoGreen p-5 rounded-2xl flex-row items-center justify-center shadow-lg mb-4"
          >
            <Save color="white" size={20} />
            <Text className="text-white font-black text-lg ml-2">
              {t("saveBtn")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => supabase.auth.signOut()}
            className="bg-white p-5 rounded-2xl flex-row items-center justify-center border border-red-100"
          >
            <LogOut color="#ef4444" size={20} />
            <Text className="text-red-500 font-bold text-lg ml-2">
              {t("logoutBtn")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLangModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangModalVisible(false)}
      >
        <View className="flex-1 justify-end items-center bg-black/50">
          <Pressable
            className="absolute inset-0"
            onPress={() => setIsLangModalVisible(false)}
          />
          <View className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl pb-12">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />
            <Text className="text-xl font-black text-gray-800 mb-6">
              {t("langPref")}
            </Text>

            <View className="gap-y-3">
              {[
                { code: "en", label: "English" },
                { code: "zh", label: "繁體中文" },
                { code: "fr", label: "Français" },
              ].map((l) => (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => {
                    setLang(l.code as any);
                    setIsLangModalVisible(false);
                  }}
                  className={`flex-row items-center justify-between p-5 rounded-2xl ${
                    lang === l.code
                      ? "bg-ngoGreen/10 border border-ngoGreen/20"
                      : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-base font-bold ${lang === l.code ? "text-ngoGreen" : "text-gray-600"}`}
                  >
                    {l.label}
                  </Text>
                  {lang === l.code && <Shield size={16} color="#228B22" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
