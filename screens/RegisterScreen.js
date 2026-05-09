import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import { ArrowLeft, User, Phone, Calendar, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// REGEX KIỂM TRA ĐIỀU KIỆN
const VIETNAMESE_REGEX = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\'-]+$/;
const PHONE_PREFIX_REGEX = /^(03|05|07|08|09)/;

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // THÊM STATE ĐỂ LƯU LỖI CHO TỪNG Ô
  const [errors, setErrors] = useState({ fullName: '', phoneNumber: '', dateOfBirth: '' });

  // HÀM VALIDATE
  const validateFullName = (text) => {
    if (!text || text.trim() === '') return 'Vui lòng nhập họ và tên.';
    
    if (text.trim().split(/\s+/).length < 2) return 'Vui lòng nhập đầy đủ họ và tên (ít nhất 2 từ).';
    
    if (text.length < 2 || text.length > 50) return 'Họ tên phải từ 2 đến 50 ký tự.';
    if (/\s{2,}/.test(text)) return 'Không được chứa nhiều khoảng trắng liên tiếp.';
    if (!VIETNAMESE_REGEX.test(text)) return 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu \' và -.';
    return '';
  };

  const validatePhone = (text) => {
    if (!text) return 'Vui lòng nhập số điện thoại.';
    if (text.length !== 10) return 'Số điện thoại phải bao gồm đúng 10 chữ số.';
    if (!PHONE_PREFIX_REGEX.test(text)) return 'Đầu số không hợp lệ (Hỗ trợ: 03, 05, 07, 08, 09).';
    return '';
  };

  const validateDob = (text) => {
    if (!text) return 'Vui lòng nhập ngày sinh.';
    if (text.length < 10) return 'Ngày sinh chưa đủ định dạng (dd/mm/yyyy).';

    const [day, month, year] = text.split('/');
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    const dateObj = new Date(y, m - 1, d);
    if (dateObj.getFullYear() !== y || dateObj.getMonth() + 1 !== m || dateObj.getDate() !== d) {
      return 'Ngày sinh không hợp lệ.';
    }

    const today = new Date();
    if (dateObj > today) return 'Ngày sinh không được lớn hơn ngày hiện tại.';

    let age = today.getFullYear() - dateObj.getFullYear();
    const monthDiff = today.getMonth() - dateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate())) {
      age--;
    }

    if (age < 18) return 'Bạn phải đủ 18 tuổi để đăng ký tài khoản.';
    return '';
  };

  // XỬ LÝ KHI NGƯỜI DÙNG ĐANG NHẬP (REAL-TIME)
  const handleNameChange = (text) => {
    // Tự động viết hoa chữ cái đầu tiên của mỗi từ
    const formattedName = text.split(' ').map(word => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return '';
    }).join(' ');

    // Cập nhật vào State
    setFullName(formattedName);
    setErrors(prev => ({ ...prev, fullName: validateFullName(formattedName) }));
  };

  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/[\s\-\(\)a-zA-Z]/g, '');
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
    
    setPhoneNumber(cleaned);

    if (cleaned.length === 10 || cleaned.length === 0) {
      setErrors(prev => ({ ...prev, phoneNumber: validatePhone(cleaned) }));
    } else {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const handleDateChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.slice(0, 5) + '/' + cleaned.slice(4, 8);
    }
    setDateOfBirth(formatted);

    if (formatted.length === 10 || formatted.length === 0) {
      setErrors(prev => ({ ...prev, dateOfBirth: validateDob(formatted) }));
    } else {
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  // XỬ LÝ SUBMIT
  const handleRegister = async () => {
    const nameErr = validateFullName(fullName);
    const phoneErr = validatePhone(phoneNumber);
    const dobErr = validateDob(dateOfBirth);

    if (nameErr || phoneErr || dobErr) {
      setErrors({ fullName: nameErr, phoneNumber: phoneErr, dateOfBirth: dobErr });
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Điều khoản', 'Vui lòng đồng ý với các điều khoản và chính sách bảo mật.');
      return;
    }

    const [day, month, year] = dateOfBirth.split('/');
    const formattedDateForBackend = `${year}-${month}-${day}`;

    setIsRegistering(true);
    const result = await register(fullName, phoneNumber, formattedDateForBackend);
    setIsRegistering(false);

    if (result.success) {
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', [
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Lỗi đăng ký', result.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  const isSubmitDisabled = isRegistering || !!errors.fullName || !!errors.phoneNumber || !!errors.dateOfBirth || !fullName || !phoneNumber || !dateOfBirth || !agreeTerms;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color={tokens.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>HealthGuard</Text>
            <View style={styles.spacer} />
          </View>

          <Text style={styles.mainTitle}>Đăng ký tài khoản</Text>
          <Text style={styles.subtitle}>Tham gia cùng HealthGuard để quản lý sức khỏe của bạn</Text>

          <View style={styles.formContainer}>
            
            {/* INPUT HỌ VÀ TÊN */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Họ và tên <Text style={{color: '#EF4444'}}>*</Text></Text>
              <View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
                <User size={20} color={errors.fullName ? '#EF4444' : tokens.colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChangeText={handleNameChange}
                  onBlur={() => setErrors(prev => ({...prev, fullName: validateFullName(fullName)}))}
                  placeholderTextColor={tokens.colors.text.secondary}
                />
              </View>
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            {/* INPUT SỐ ĐIỆN THOẠI */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại <Text style={{color: '#EF4444'}}>*</Text></Text>
              <View style={[styles.inputWrapper, errors.phoneNumber && styles.inputError]}>
                <Phone size={20} color={errors.phoneNumber ? '#EF4444' : tokens.colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  onBlur={() => setErrors(prev => ({...prev, phoneNumber: validatePhone(phoneNumber)}))}
                  placeholderTextColor={tokens.colors.text.secondary}
                />
              </View>
              {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
            </View>

            {/* INPUT NGÀY SINH */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ngày sinh <Text style={{color: '#EF4444'}}>*</Text></Text>
              <View style={[styles.inputWrapper, errors.dateOfBirth && styles.inputError]}>
                <Calendar size={20} color={errors.dateOfBirth ? '#EF4444' : tokens.colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="dd/mm/yyyy" 
                  value={dateOfBirth}
                  onChangeText={handleDateChange} 
                  onBlur={() => setErrors(prev => ({...prev, dateOfBirth: validateDob(dateOfBirth)}))}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholderTextColor={tokens.colors.text.secondary}
                />
              </View>
              {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
            </View>

            {/* CHECKBOX */}
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <Check size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxText}>
                Tôi đồng ý với các <Text style={styles.linkText}>điều khoản</Text> và <Text style={styles.linkText}>chính sách bảo mật</Text>
              </Text>
            </TouchableOpacity>

            {/* NÚT SUBMIT */}
            <TouchableOpacity 
              style={[styles.primaryButton, isSubmitDisabled && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isSubmitDisabled}
            >
              {isRegistering ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <Text style={styles.footerText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' }, keyboardView: { flex: 1 }, scrollContent: { flexGrow: 1, padding: 24 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, marginTop: 50 }, backButton: { padding: 4 }, headerTitle: { fontSize: 16, fontWeight: '700', color: tokens.colors.text.primary }, spacer: { width: 24 }, mainTitle: { fontSize: 28, fontWeight: '800', color: tokens.colors.text.primary, marginBottom: 8 }, subtitle: { fontSize: 14, color: tokens.colors.text.secondary, marginBottom: 32 }, formContainer: { flex: 1 }, inputGroup: { marginBottom: 20 }, inputLabel: { fontSize: 14, fontWeight: '600', color: tokens.colors.text.primary, marginBottom: 8 }, inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.surface.muted, borderRadius: 12, paddingHorizontal: 16, height: 56 }, inputIcon: { marginRight: 12 }, input: { flex: 1, fontSize: 15, color: tokens.colors.text.primary }, checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, paddingRight: 20 }, checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#CBD5E1', marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }, checkboxActive: { backgroundColor: tokens.colors.brand.primary, borderColor: tokens.colors.brand.primary }, checkboxText: { flex: 1, fontSize: 14, color: tokens.colors.text.secondary, lineHeight: 20 }, linkText: { color: tokens.colors.brand.primary, fontWeight: '600' }, primaryButton: { backgroundColor: tokens.colors.brand.primary, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }, buttonDisabled: { opacity: 0.5 }, primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }, footerLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 }, footerText: { fontSize: 14, color: tokens.colors.text.secondary }, loginLink: { fontSize: 14, fontWeight: '700', color: tokens.colors.brand.primary },
  inputError: { borderWidth: 1, borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '500' }
});

export default RegisterScreen;