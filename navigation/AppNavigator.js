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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary placeholders for missing screens
const Placeholder = ({ route }) => (
  <View className="flex-1 bg-white justify-center items-center">
    <Text className="text-text-primary font-bold">{route.name} Screen</Text>
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

const AuthStack = ({ showOnboarding }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={showOnboarding ? "Onboarding" : "Login"}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
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
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth">
          {props => <AuthStack {...props} showOnboarding={showOnboarding} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
