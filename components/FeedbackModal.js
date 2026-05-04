import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { tokens } from '../theme/tokens';
import { 
  X, 
  Star, 
  Smile, 
  Meh, 
  Frown,
  Send
} from 'lucide-react-native';

const FeedbackModal = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [sentiment, setSentiment] = useState(null);
  const [comment, setComment] = useState('');

  const handleRating = (value) => setRating(value);

  const handleSubmit = () => {
    onSubmit({ rating, sentiment, comment });
    setRating(0);
    setSentiment(null);
    setComment('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={tokens.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đóng góp ý kiến</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.subtitle}>
              Phản hồi của bạn giúp chúng tôi cải thiện độ chính xác của hệ thống Chẩn đoán AI.
            </Text>

            {/* Star Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Đánh giá độ chính xác của AI</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                    <Star 
                      size={32} 
                      color={star <= rating ? '#F59E0B' : '#CBD5E1'} 
                      fill={star <= rating ? '#F59E0B' : 'transparent'} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingHint}>Chọn số sao để đánh giá</Text>
            </View>

            {/* Sentiment Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bạn cảm thấy thế nào về kết quả?</Text>
              <View style={styles.sentimentList}>
                <TouchableOpacity 
                  style={[styles.sentimentItem, sentiment === 'happy' && styles.sentimentActive]}
                  onPress={() => setSentiment('happy')}
                >
                  <Smile size={24} color={sentiment === 'happy' ? tokens.colors.brand.primary : tokens.colors.text.secondary} />
                  <Text style={[styles.sentimentText, sentiment === 'happy' && styles.sentimentTextActive]}>Rất hữu ích</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.sentimentItem, sentiment === 'neutral' && styles.sentimentActive]}
                  onPress={() => setSentiment('neutral')}
                >
                  <Meh size={24} color={sentiment === 'neutral' ? tokens.colors.brand.primary : tokens.colors.text.secondary} />
                  <Text style={[styles.sentimentText, sentiment === 'neutral' && styles.sentimentTextActive]}>Bình thường</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.sentimentItem, sentiment === 'sad' && styles.sentimentActive]}
                  onPress={() => setSentiment('sad')}
                >
                  <Frown size={24} color={sentiment === 'sad' ? tokens.colors.brand.primary : tokens.colors.text.secondary} />
                  <Text style={[styles.sentimentText, sentiment === 'sad' && styles.sentimentTextActive]}>Cần cải thiện</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Comment Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chi tiết ý kiến (Không bắt buộc)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Vui lòng chia sẻ thêm chi tiết về trải nghiệm của bạn với kết quả chẩn đoán..."
                placeholderTextColor={tokens.colors.text.secondary}
                multiline
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, (!rating && !sentiment) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!rating && !sentiment}
            >
              <Text style={styles.submitButtonText}>Gửi ý kiến</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 24,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  ratingHint: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
  },
  sentimentList: {
    gap: 12,
  },
  sentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface.muted,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  sentimentActive: {
    backgroundColor: '#EEF6FF',
    borderColor: tokens.colors.brand.primary,
  },
  sentimentText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.text.primary,
    marginLeft: 12,
  },
  sentimentTextActive: {
    color: tokens.colors.brand.primary,
  },
  textArea: {
    backgroundColor: tokens.colors.surface.muted,
    borderRadius: 16,
    padding: 16,
    height: 120,
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  submitButton: {
    backgroundColor: tokens.colors.brand.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: tokens.colors.brand.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FeedbackModal;
