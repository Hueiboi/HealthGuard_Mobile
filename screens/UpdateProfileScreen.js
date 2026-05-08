import React, { useState, useCallback } from 'react'; 
// ĐÃ THÊM IMPORT 'Keyboard'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform, Image, KeyboardAvoidingView, ActivityIndicator, Modal, Keyboard } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { ArrowLeft, Pencil, Smartphone, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react-native';
import { tokens } from '../theme/tokens';
import { useProfileData } from '../hooks/useProfileData';
import { API_BASE_URL } from '../config/api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const BLOOD_TYPES = ['Chưa rõ', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Nam', 'Nữ', 'Khác'];

const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const { formData, setFormData, isLoading, isUpdating, updateProfile } = useProfileData();
  
  const [showBloodTypeModal, setShowBloodTypeModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false); 
  const [cacheAvatar, setCacheAvatar] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadCache = async () => {
        try {
          const savedImage = await AsyncStorage.getItem(`@user_avatar_${formData.phoneNumber}`);
          if (savedImage) setCacheAvatar(savedImage);
        } catch (e) { console.log(e); }
      };
      if (formData.phoneNumber) loadCache();
    }, [formData.phoneNumber])
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập ảnh để đổi avatar!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.8, 
    });

    if (!result.canceled && result.assets[0].uri) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }], 
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const base64Image = `data:image/jpeg;base64,${manipResult.base64}`;
      setFormData({...formData, avatarUrl: base64Image}); 
      
      if (formData.phoneNumber) {
        await AsyncStorage.setItem(`@user_avatar_${formData.phoneNumber}`, base64Image);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tokens.colors.brand.primary} />
      </View>
    );
  }

  const renderAvatarSource = () => {
    if (formData.avatarUrl) {
      return { uri: formData.avatarUrl.startsWith('data:image') ? formData.avatarUrl : `${API_BASE_URL}${formData.avatarUrl}` };
    }
    if (cacheAvatar) return { uri: cacheAvatar };
    return require('../assets/images/avatar.png');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color={tokens.colors.brand.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cập nhật hồ sơ</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
                <Image source={renderAvatarSource()} style={styles.avatar} />
                <View style={styles.editIcon}><Pencil size={12} color="#FFFFFF" /></View>
              </TouchableOpacity>
              <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
              
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} value={formData.fullName} onChangeText={(t) => setFormData({...formData, fullName: t})} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1.2, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Ngày sinh</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={formData.dateOfBirth} onChangeText={(t) => setFormData({...formData, dateOfBirth: t})} />
                    <Calendar size={18} color={tokens.colors.text.secondary} />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Giới tính</Text>
                  {/* FIX LỖI: HẠ BÀN PHÍM TRƯỚC KHI BẬT MODAL */}
                  <TouchableOpacity style={styles.inputWrapper} onPress={() => { Keyboard.dismiss(); setShowGenderModal(true); }}>
                    <Text style={styles.inputText}>{formData.gender}</Text>
                    <ChevronDown size={18} color={tokens.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <Text style={styles.readOnlyText}>Chỉ đọc</Text>
              </View>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <Smartphone size={18} color={tokens.colors.text.secondary} style={{ marginRight: 8 }} />
                <TextInput style={[styles.input, { color: tokens.colors.text.secondary }]} value={formData.phoneNumber} editable={false} />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Thông tin y tế</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Nhóm máu</Text>
                  {/* FIX LỖI: HẠ BÀN PHÍM TRƯỚC KHI BẬT MODAL */}
                  <TouchableOpacity style={styles.inputWrapper} onPress={() => { Keyboard.dismiss(); setShowBloodTypeModal(true); }}>
                    <Text style={styles.inputText}>{formData.bloodType || 'Chưa rõ'}</Text>
                    <ChevronDown size={18} color={tokens.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Chiều cao</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} value={formData.height} keyboardType="numeric" onChangeText={(t) => setFormData({...formData, height: t})} />
                    <Text style={styles.unitText}>cm</Text>
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Cân nặng</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput style={styles.input} value={formData.weight} keyboardType="numeric" onChangeText={(t) => setFormData({...formData, weight: t})} />
                    <Text style={styles.unitText}>kg</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.inputLabel}>Tiền sử bệnh lý</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput 
                  style={styles.textArea} multiline textAlignVertical="top"
                  placeholder="Nhập các bệnh lý mãn tính..." placeholderTextColor={tokens.colors.text.secondary}
                  value={formData.medicalHistory} onChangeText={(t) => setFormData({...formData, medicalHistory: t})}
                />
              </View>

              <Text style={styles.inputLabel}>Dị ứng</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput 
                  style={styles.textArea} multiline textAlignVertical="top"
                  placeholder="Ví dụ: Penicillin, hải sản..." placeholderTextColor={tokens.colors.text.secondary}
                  value={formData.allergies} onChangeText={(t) => setFormData({...formData, allergies: t})}
                />
              </View>
            </View>

            <TouchableOpacity style={[styles.primaryButton, isUpdating && { opacity: 0.7 }]} onPress={updateProfile} disabled={isUpdating}>
              {isUpdating ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <CheckCircle2 size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Cập nhật hồ sơ</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal visible={showBloodTypeModal} transparent={true} animationType="slide" onRequestClose={() => setShowBloodTypeModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowBloodTypeModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn nhóm máu</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {BLOOD_TYPES.map((type, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.modalItem, formData.bloodType === type && styles.modalItemActive]}
                  onPress={() => {
                    setFormData({...formData, bloodType: type});
                    setShowBloodTypeModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, formData.bloodType === type && styles.modalItemTextActive]}>{type}</Text>
                  {formData.bloodType === type && <CheckCircle2 size={20} color={tokens.colors.brand.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowBloodTypeModal(false)}>
              <Text style={styles.modalCancelText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showGenderModal} transparent={true} animationType="slide" onRequestClose={() => setShowGenderModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn giới tính</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {GENDERS.map((type, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.modalItem, formData.gender === type && styles.modalItemActive]}
                  onPress={() => {
                    setFormData({...formData, gender: type});
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, formData.gender === type && styles.modalItemTextActive]}>{type}</Text>
                  {formData.gender === type && <CheckCircle2 size={20} color={tokens.colors.brand.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowGenderModal(false)}>
              <Text style={styles.modalCancelText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 20, backgroundColor: '#FFFFFF', paddingBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: tokens.colors.brand.primary },
  scrollContent: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#FFFFFF' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: tokens.colors.brand.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  changeAvatarText: { fontSize: 13, color: tokens.colors.text.secondary, marginTop: 12, fontWeight: '500' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }) },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 20 },
  row: { flexDirection: 'row', marginBottom: 16 },
  inputGroup: { flex: 1 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: tokens.colors.text.primary, marginBottom: 8 },
  readOnlyText: { fontSize: 11, color: tokens.colors.text.secondary, fontStyle: 'italic' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F7FA', borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  inputDisabled: { backgroundColor: '#E2E8F0', opacity: 0.7 },
  input: { flex: 1, fontSize: 14, color: tokens.colors.text.primary },
  inputText: { flex: 1, fontSize: 14, color: tokens.colors.text.primary },
  unitText: { fontSize: 13, color: tokens.colors.text.secondary, fontWeight: '600' },
  textAreaWrapper: { height: 80, alignItems: 'flex-start', paddingTop: 12 },
  textArea: { flex: 1, width: '100%', fontSize: 14, color: tokens.colors.text.primary },
  primaryButton: { backgroundColor: tokens.colors.brand.primary, height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end', margin: 0 },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '80%', width: '100%' },
  modalHeader: { alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: tokens.colors.text.primary },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  modalItemActive: { backgroundColor: '#F0F7FF', borderRadius: 12, paddingHorizontal: 12, borderBottomWidth: 0 },
  modalItemText: { fontSize: 16, color: tokens.colors.text.primary, fontWeight: '500' },
  modalItemTextActive: { color: tokens.colors.brand.primary, fontWeight: '700' },
  modalCancelButton: { marginTop: 16, backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: tokens.colors.text.primary }
});

export default UpdateProfileScreen;