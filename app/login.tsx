import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // New state to toggle mode
  const router = useRouter();

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Email Required", "Please enter your email address first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) Alert.alert("Error", error.message);
    else
      Alert.alert("Check your email", "A password reset link has been sent.");
  }

  async function handleSubmit() {
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert("Sign Up Error", error.message);
      else Alert.alert("Success!", "Account created! You can now sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) Alert.alert("Login Failed", error.message);
      else router.replace("/(tabs)");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white p-8 justify-center">
      {/* Add a fixed height container for the header text */}
      <View style={{ height: 110 }} className="mb-6 justify-end">
        <Text className="text-4xl font-extrabold text-gray-900 mb-2">
          {isSignUp ? "Join the Club" : "Welcome Back"}
        </Text>
        <Text className="text-gray-500 text-lg">
          {isSignUp
            ? "Create an account to start hiking."
            : "Sign in to see your next adventure."}
        </Text>
      </View>

      <TextInput
        className="w-full border border-gray-200 p-4 rounded-2xl mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border border-gray-200 p-4 rounded-2xl mb-8 bg-gray-50"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View className="mb-4">
        <TouchableOpacity
          onPress={handleForgotPassword}
          // 2. Disable the button interaction when in Sign Up mode
          disabled={isSignUp}
          // 3. Use opacity to hide it visually without removing the space
          className={isSignUp ? "opacity-0" : "opacity-100"}
        >
          <Text className="text-right text-gray-500 font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-ngoGreen w-full py-4 rounded-2xl mb-6 shadow-md"
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text className="text-center text-ngoGreen font-semibold">
          {isSignUp
            ? "Already have an account? Sign In"
            : "New hiker? Create an account"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
