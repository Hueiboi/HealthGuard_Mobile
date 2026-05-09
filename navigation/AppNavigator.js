import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Text } from 'react-native';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import DiagnosisScreen from '../screens/DiagnosisScreen';
import RecordScreen from '../screens/RecordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiagnosisDetailScreen from '../screens/DiagnosisDetailScreen';
import { Home, Activity, User, ClockFading, Stethoscope, ClipboardList } from 'lucide-react-native';
import RegisterScreen from '../screens/RegisterScreen';

import UpdateProfileScreen from '../screens/UpdateProfileScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// TẠO MÀN HÌNH TẠM CHO CÁC TÍNH NĂNG CHƯA CODE (Ví dụ: Feedback)
const Placeholder = ({ route }) => (
  <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: '700', color: '#004AAD' }}>
      Màn hình {route.name} đang phát triển...
    </Text>
  </View>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#004AAD',
        tabBarInactiveTintColor: '#7C7C7C',
        tabBarStyle: { height: 60, paddingBottom: 10 },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: 'Trang chủ'
        }}
      />
      <Tab.Screen 
        name="Diagnosis" 
        component={DiagnosisScreen} 
        options={{
          tabBarIcon: ({ color }) => <Stethoscope color={color} size={24} />,
          tabBarLabel: 'Chẩn đoán'
        }}
      />
      <Tab.Screen 
        name="Records" 
        component={RecordScreen} 
        options={{
          tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} />,
          tabBarLabel: 'Lịch sử'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          tabBarLabel: 'Hồ sơ'
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      // ⚠️ ĐỂ TEST ONBOARDING: Bỏ comment dòng dưới đây để app "quên" đi việc bạn đã từng xem Onboarding
      await AsyncStorage.removeItem('@onboarding_completed');
      
      const completed = await AsyncStorage.getItem('@onboarding_completed');
      setShowOnboarding(completed !== 'true');
    };
    checkOnboarding();
  }, []);

  if (isLoading || showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#004AAD" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? ( // Màn hình hiển thị dựa trên user có tồn tại hay không
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetailScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="Feedback" component={Placeholder} />
        </>
      ) : (
        <>
          {showOnboarding && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};