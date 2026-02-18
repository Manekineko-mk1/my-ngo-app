import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { User, LogOut, ShieldCheck } from 'lucide-react-native';

export default function ProfileScreen() {
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-20 pb-10 px-6 items-center border-b border-gray-100">
        <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
          <User size={48} color="#228B22" />
        </View>
        <Text className="text-2xl font-bold text-gray-900">Hiker Profile</Text>
        <Text className="text-gray-500">Member since 2026</Text>
      </View>

      <View className="p-6">
        <TouchableOpacity 
          onPress={handleSignOut}
          className="flex-row items-center bg-red-50 p-5 rounded-2xl"
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="ml-3 text-red-500 font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}