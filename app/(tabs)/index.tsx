import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      {/* Brand Logo Container */}
      <View className="w-24 h-24 bg-ngoGreen rounded-full items-center justify-center mb-6 shadow-xl">
        <Text className="text-white text-4xl">🌲</Text>
      </View>

      <Text className="text-3xl font-extrabold text-gray-900 text-center">
        Welcome, Hiker
      </Text>
      
      <Text className="text-gray-500 text-lg text-center mt-2 mb-10 px-4">
        Ready for your next adventure with the NGO?
      </Text>

      {/* Primary Action Button */}
      <TouchableOpacity 
        className="bg-ngoGreen w-full py-4 rounded-2xl shadow-lg active:opacity-90"
      >
        <Text className="text-white text-center font-bold text-xl">
          Browse June Events
        </Text>
      </TouchableOpacity>
      
      <Text className="mt-6 text-gray-400 text-sm italic">
        NativeWind Styling: Active
      </Text>
    </View>
  );
}