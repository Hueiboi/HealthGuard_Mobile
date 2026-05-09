import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import { ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

// NOTE: Bổ sung tham số route để nhận dữ liệu truyền từ màn hình Login sang
const OTPScreen = ({ navigation, route }) => {
  // Lấy hàm verifyOtp và sendOtp từ context
  const { verifyOtp, sendOtp } = useAuth(); 
  
  // Lấy số điện thoại từ route (mặc định rỗng nếu không có)
  const phoneNumber = route.params?.phoneNumber || ''; 

  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false); // Quản lý trạng thái loading

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
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleConfirm = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < otpLength) return;
    
    setIsVerifying(true);

    // Gọi API xác thực thật
    const result = await verifyOtp(phoneNumber, otpCode);

    if (result.success) {
      // Nếu thành công, Context sẽ tự update State và đẩy vào App chính
    } else {
      Alert.alert('Xác thực thất bại', result.message);
    }

    setIsVerifying(false);
  };

  // Logic gọi API gửi lại mã
  const handleResend = async () => {
    setTimer(59);
    const result = await sendOtp(phoneNumber);
    if (result.success) {
      // Có thể dùng Toast/Alert báo gửi thành công nếu muốn
    } else {
      Alert.alert('Lỗi', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={32} color={tokens.colors.brand.primary} />
            </View>
          </View>

          <Text style={styles.title}>Xác thực số điện thoại</Text>
          <Text style={styles.subtitle}>
            {/* Cập nhật subtitle để hiển thị số điện thoại thực tế */}
            Mã xác thực đã được gửi đến số {phoneNumber}
          </Text>

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
                  autoFocus={index === 0}
                  selectionColor={tokens.colors.brand.primary}
                  editable={!isVerifying} // Khóa nhập liệu khi đang xác thực
                />
              </View>
            ))}
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Chưa nhận được mã? </Text>
            <TouchableOpacity 
              disabled={timer > 0 || isVerifying} 
              onPress={handleResend}
            >
              <Text style={[styles.resendLink, timer > 0 ? { opacity: 0.5 } : {}]}>
                Gửi lại mã {timer > 0 ? `(00:${timer < 10 ? '0' + timer : timer})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.confirmButton, 
              (otp.join('').length < otpLength || isVerifying) ? styles.buttonDisabled : {}
            ]}
            onPress={handleConfirm}
            disabled={otp.join('').length < otpLength || isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isVerifying}
          >
            <ArrowLeft size={16} color={tokens.colors.text.secondary} />
            <Text style={styles.backButtonText}>Quay lại phương thức đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ... [Giữ nguyên toàn bộ StyleSheet.create của bạn ở dưới này] ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { marginBottom: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: tokens.colors.text.primary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: tokens.colors.text.secondary, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20, marginBottom: 40 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 32 },
  otpBox: { width: 48, height: 56, borderWidth: 1, borderColor: tokens.colors.surface.muted, borderRadius: 12, backgroundColor: tokens.colors.surface.muted, justifyContent: 'center', alignItems: 'center' },
  otpBoxActive: { borderColor: tokens.colors.brand.primary, backgroundColor: '#FFFFFF' },
  otpInput: { fontSize: 20, fontWeight: '700', color: tokens.colors.text.primary, textAlign: 'center', width: '100%', height: '100%' },
  resendContainer: { flexDirection: 'row', marginBottom: 40 },
  resendText: { fontSize: 14, color: tokens.colors.text.secondary },
  resendLink: { fontSize: 14, fontWeight: '700', color: tokens.colors.brand.primary },
  confirmButton: { backgroundColor: tokens.colors.brand.primary, height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 32 },
  buttonDisabled: { opacity: 0.6 },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginRight: 8 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backButtonText: { fontSize: 14, color: tokens.colors.text.secondary, marginLeft: 8 }
});

export default OTPScreen;