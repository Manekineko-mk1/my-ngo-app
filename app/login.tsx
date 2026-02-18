import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) Alert.alert('Check your email for the confirmation link!');
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white p-8 justify-center">
      <Text className="text-3xl font-bold text-gray-900 mb-2">NGO Hiker Portal</Text>
      <Text className="text-gray-500 mb-8">Sign in to join your next adventure.</Text>

      <TextInput
        className="w-full border border-gray-200 p-4 rounded-xl mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        className="w-full border border-gray-200 p-4 rounded-xl mb-6 bg-gray-50"
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        onPress={signInWithEmail}
        disabled={loading}
        className="bg-ngoGreen w-full py-4 rounded-xl mb-4 shadow-sm"
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? 'Processing...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signUpWithEmail}>
        <Text className="text-center text-ngoGreen font-medium">
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}