import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { tokens } from '../theme/tokens';
import { ChevronRight, Fingerprint, Smartphone } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandTitle}>HealthGuard</Text>
            <Text style={styles.brandSubtitle}>Hệ thống chẩn đoán y khoa chuyên sâu</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <View style={styles.inputWrapper}>
                <Smartphone size={20} color={tokens.colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="09xx xxx xxx"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholderTextColor={tokens.colors.text.secondary}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('OTP')}
            >
              <Text style={styles.primaryButtonText}>Gửi mã OTP</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Fingerprint size={20} color={tokens.colors.brand.primary} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryButtonText}>Đăng nhập bằng sinh trắc học</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <Text style={styles.footerText}>Chưa có tài khoản lâm sàng? </Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.copyright}>© 2024 HealthGuard Systems. Bảo mật y tế mức độ cao.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: tokens.colors.brand.primary,
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: tokens.colors.brand.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logo: {
    width: 50,
    height: 50,
    tintColor: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.brand.primary,
  },
  brandSubtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface.muted,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: tokens.colors.text.primary,
  },
  primaryButton: {
    backgroundColor: tokens.colors.brand.primary,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: tokens.colors.surface.muted,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: tokens.colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.brand.primary,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: tokens.colors.text.secondary,
    marginTop: 40,
    opacity: 0.6,
  }
});

export default LoginScreen;
