import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from '../theme/tokens';

const OnboardingScreen = ({ navigation }) => {
  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>HealthGuard</Text>
          <Text style={styles.subtitle}>Hệ thống chẩn đoán y khoa chuyên sâu</Text>
        </View>

        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleComplete}
        >
          <Text style={styles.nextButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface.base,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0FE',
    shadowColor: tokens.colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.colors.brand.primary,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 16,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: tokens.colors.brand.primary,
    width: 24,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
  },
  nextButtonText: {
    color: tokens.colors.brand.primary,
    fontWeight: '600',
    fontSize: 18,
  }
});

export default OnboardingScreen;
