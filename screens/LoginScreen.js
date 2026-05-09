import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import { ArrowRight, Fingerprint, Smartphone } from 'lucide-react-native'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useAuth } from '../context/AuthContext'; 

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendOtp } = useAuth();

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }

    setIsSending(true);
    const result = await sendOtp(phoneNumber);

    if (result.success) {
      navigation.navigate('OTP', { phoneNumber: phoneNumber });
    } else {
      Alert.alert('Không thể gửi mã', result.message);
    }
    setIsSending(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Bao trọn toàn bộ nội dung vào trong 1 Card màu trắng */}
          <View style={styles.mainCard}>
            
            {/* Header (Logo + Title) */}
            <View style={styles.header}>
              <View style={styles.logoBox}>
                {/* Dùng icon hệt màn hình Splash, hoặc bạn có thể bật lại Image nếu muốn */}
                <FontAwesome5 name="briefcase-medical" size={28} color="#FFFFFF" />
                {/* <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" /> */}
              </View>
              <Text style={styles.brandTitle}>HealthGuard</Text>
              <Text style={styles.brandSubtitle}>Hệ thống chẩn đoán y khoa chuyên sâu</Text>
            </View>

            {/* Input Form */}
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
                  editable={!isSending}
                />
              </View>
            </View>

            {/* Nút Gửi OTP */}
            <TouchableOpacity 
              style={[styles.primaryButton, isSending && { opacity: 0.7 }]}
              onPress={handleSendOtp}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Gửi mã OTP</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Nút Sinh trắc học */}
            <TouchableOpacity style={styles.secondaryButton} disabled={isSending}>
              <Fingerprint size={20} color={tokens.colors.brand.primary} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryButtonText}>Đăng nhập bằng sinh trắc học</Text>
            </TouchableOpacity>

            {/* Footer Links (Bên trong Card) */}
            <View style={styles.footerLinks}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Bản quyền (Bên ngoài Card) */}
          <Text style={styles.copyright}>© 2026 HealthGuard Systems. Bảo mật y tế mức độ cao.</Text>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F7FA' // Màu nền xám/xanh rất nhạt để làm nổi bật Card trắng
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', // Canh giữa toàn bộ nội dung theo chiều dọc
    padding: 20 
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32, // Bo góc to mềm mại như thiết kế
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#004AAD',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  logoBox: { 
    width: 64, 
    height: 64, 
    backgroundColor: tokens.colors.brand.primary, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16,
  },
  logo: { 
    width: 40, 
    height: 40, 
    tintColor: '#FFFFFF' 
  },
  brandTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: tokens.colors.brand.primary,
    marginBottom: 6
  },
  brandSubtitle: { 
    fontSize: 13, 
    color: tokens.colors.text.secondary 
  },
  inputGroup: { 
    marginBottom: 24 
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: tokens.colors.text.primary, 
    marginBottom: 8 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', // Nền input xám nhạt
    borderRadius: 12, 
    paddingHorizontal: 16, 
    height: 56 
  },
  inputIcon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: tokens.colors.text.primary 
  },
  primaryButton: { 
    backgroundColor: tokens.colors.brand.primary, 
    height: 56, 
    borderRadius: 28, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700', 
    marginRight: 8 
  },
  secondaryButton: { 
    height: 56, 
    borderRadius: 28, 
    borderWidth: 1.5, 
    borderColor: '#EEF2F6', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 32 
  },
  secondaryButtonText: { 
    color: tokens.colors.brand.primary, // Đổi màu chữ thành xanh cho đồng bộ icon
    fontSize: 15, 
    fontWeight: '700' 
  },
  footerLinks: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  footerText: { 
    fontSize: 14, 
    color: tokens.colors.text.secondary 
  },
  linkText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: tokens.colors.brand.primary 
  },
  copyright: { 
    textAlign: 'center', 
    fontSize: 12, 
    color: tokens.colors.text.secondary, 
    marginTop: 32, 
  }
});

export default LoginScreen;