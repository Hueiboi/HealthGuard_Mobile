import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { tokens } from '../theme/tokens';
import { X, MessageSquareHeart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const FeedbackModal = ({ visible, onClose, sessionId }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung góp ý.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};

      // THAY ĐỔI ĐƯỜNG DẪN API SANG MOBILE CONTROLLER
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comments: comment,
          sessionId: sessionId // ID lấy từ props truyền xuống
        })
      });

      const result = await response.json();

      if (result.success) { // Kiểm tra success theo chuẩn API Mobile bạn đang dùng
        Alert.alert('Thành công', result.message);
        setComment('');
        onClose();
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể gửi phản hồi.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối tới máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          {/* Nút tắt */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={tokens.colors.text.secondary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MessageSquareHeart size={28} color={tokens.colors.brand.primary} />
            </View>
            <Text style={styles.title}>Đóng góp ý kiến</Text>
            <Text style={styles.subtitle}>
              Kết quả chẩn đoán này có chính xác với bạn không? Hãy để lại ý kiến để hệ thống AI cải thiện tốt hơn nhé.
            </Text>
          </View>

          {/* Input Text Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập ý kiến của bạn ở đây..."
              placeholderTextColor={tokens.colors.text.secondary}
              multiline={true}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {/* Nút Gửi */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitText}>Gửi phản hồi</Text>
            )}
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Nền tối mờ mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: tokens.colors.surface.muted,
    borderRadius: 16,
    padding: 16,
    height: 120,
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  submitButton: {
    backgroundColor: tokens.colors.brand.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FeedbackModal;