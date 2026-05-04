import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { tokens } from '../theme/tokens';
import { ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const OTPScreen = ({ navigation }) => {
  const { login } = useAuth();
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [timer, setTimer] = useState(59);

  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    if (!cleanText && text !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanText.slice(-1);
    setOtp(newOtp);

    if(cleanText && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyPress = (e, index) => {
    // Xử lý xóa ngược (Backspace)
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Nếu ô hiện tại trống, quay lại ô trước và xóa
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleConfirm = () => {
    const otpCode = otp.join('');
    if (otpCode.length < otpLength) {
      return;
    }
    // Mock login
    login({ id: '1', name: 'Dr. Hueiboi', phone: '0987654321' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={32} color={tokens.colors.brand.primary} />
            </View>
          </View>

          <Text style={styles.title}>Xác thực số điện thoại</Text>
          <Text style={styles.subtitle}>
            Mã xác thực đã được gửi đến số điện thoại của bạn
          </Text>

          {/* OTP Input Group */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View 
                key={index} 
                style={[
                  styles.otpBox, 
                  digit ? styles.otpBoxActive : {},
                ]}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  // Optimization: Không dùng autoFocus cho tất cả, chỉ ô đầu tiên
                  autoFocus={index === 0}
                  selectionColor={tokens.colors.brand.primary}
                />
              </View>
            ))}
          </View>

          {/* Timer & Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Chưa nhận được mã? </Text>
            <TouchableOpacity 
              disabled={timer > 0} 
              onPress={() => {
                setTimer(59);
                // Logic gọi API gửi lại mã tại đây
              }}
            >
              <Text style={[styles.resendLink, timer > 0 ? { opacity: 0.5 } : {}]}>
                Gửi lại mã {timer > 0 ? `(00:${timer < 10 ? '0' + timer : timer})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <TouchableOpacity 
            style={[
              styles.confirmButton, 
              otp.join('').length < otpLength ? styles.buttonDisabled : {}
            ]}
            onPress={handleConfirm}
            disabled={otp.join('').length < otpLength}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={16} color={tokens.colors.text.secondary} />
            <Text style={styles.backButtonText}>Quay lại phương thức đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: tokens.colors.surface.muted,
    borderRadius: 12,
    backgroundColor: tokens.colors.surface.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxActive: {
    borderColor: tokens.colors.brand.primary,
    backgroundColor: '#FFFFFF',
  },
  otpInput: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.brand.primary,
  },
  confirmButton: {
    backgroundColor: tokens.colors.brand.primary,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginLeft: 8,
  },
});

export default OTPScreen;
