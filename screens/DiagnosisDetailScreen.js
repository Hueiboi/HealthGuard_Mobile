import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Platform, ActivityIndicator } from 'react-native';
import { tokens } from '../theme/tokens';
import FeedbackModal from '../components/FeedbackModal';
import { ChevronLeft, Activity, ClipboardList, Stethoscope, Microscope, Send, CheckCircle2, FileText, User } from 'lucide-react-native';
import Badge from '../components/Badge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
// IMPORT HOOK VÀO ĐÂY
import { useHistoryData } from '../hooks/useHistoryData';

const SymptomItem = ({ title, level, levelColor, description }) => (
  <View style={styles.symptomCard}>
    <View style={styles.symptomHeader}>
      <Text style={styles.symptomTitle}>{title}</Text>
      <Badge label={level} color={levelColor} backgroundColor={levelColor + '15'} />
    </View>
    <Text style={styles.symptomDesc}>{description}</Text>
  </View>
);

const RecommendationItem = ({ icon: Icon, text }) => (
  <View style={styles.recommendationItem}>
    <View style={styles.recommendationIcon}>
      <Icon size={18} color={tokens.colors.brand.primary} />
    </View>
    <Text style={styles.recommendationText}>{text}</Text>
  </View>
);

const DiagnosisDetailScreen = ({ navigation, route }) => {
  const { sessionId } = route.params || {};
  const [showFeedback, setShowFeedback] = useState(false);
  const { user } = useAuth();
  const [avatarUri, setAvatarUri] = useState(null);

  const { detailData, isLoadingDetail, fetchDetail } = useHistoryData();

  useEffect(() => {
  if (sessionId) fetchDetail(sessionId);
  
  const loadSavedAvatar = async () => {
    try {
      if (user && user.phoneNumber) {
        const savedImage = await AsyncStorage.getItem(`@user_avatar_${user.phoneNumber}`); 
        if (savedImage) setAvatarUri(savedImage);
      }
    } catch (error) { console.error("Lỗi lấy ảnh:", error); }
  };
  loadSavedAvatar();
}, [sessionId, fetchDetail, user]); 

  if (isLoadingDetail) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={tokens.colors.brand.primary} />
        <Text style={{marginTop: 10}}>Đang tải chi tiết bệnh án...</Text>
      </SafeAreaView>
    );
  }

  if (!detailData) return <SafeAreaView style={styles.container}><Text>Không tìm thấy dữ liệu.</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={tokens.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả chẩn đoán</Text>
        <View style={styles.avatarContainer}>
            {/* NẾU CÓ ẢNH Ở ASYNC STORAGE THÌ DÙNG, KHÔNG THÌ DÙNG ẢNH MẶC ĐỊNH */}
            <Image 
              source={avatarUri ? { uri: avatarUri } : require('../assets/images/avatar.png')} 
              style={styles.avatar} 
            />
          </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <Badge label="Chẩn đoán AI" variant="primary" icon={CheckCircle2} style={{ marginBottom: 12 }} />
            <Text style={styles.mainTitle}>{detailData.title}</Text>
            <Text style={styles.icdCode}>Mã ICD: {detailData.icdCode}</Text>
            
            <View style={styles.accuracyCard}>
              <Text style={styles.accuracyValue}>{detailData.accuracy}</Text>
              <Text style={styles.accuracyLabel}>Độ tin cậy AI</Text>
              <View style={styles.progressBar}><View style={[styles.progressFill, { width: detailData.accuracy }]} /></View>
            </View>
          </View>
          <View style={styles.microscopeIcon}><Microscope size={80} color="#F1F5F9" /></View>
        </View>

        
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Activity size={20} color={tokens.colors.brand.primary} /><Text style={styles.sectionTitle}>Triệu chứng đã chọn</Text></View>
          {detailData.symptoms.map((s, i) => <SymptomItem key={i} {...s} />)}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Stethoscope size={20} color={tokens.colors.brand.primary} /><Text style={styles.sectionTitle}>Khuyến nghị điều trị</Text></View>
          <View style={styles.recommendationsCard}>
            {detailData.recommendations.map((r, i) => {
              const Icon = r.type === 'file' ? FileText : (r.type === 'activity' ? Activity : User);
              return <RecommendationItem key={i} icon={Icon} text={r.text} />;
            })}
          </View>
        </View>

        {detailData.differential && detailData.differential.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><ClipboardList size={20} color={tokens.colors.brand.primary} /><Text style={styles.sectionTitle}>Có thể liên quan đến</Text></View>
            <View style={styles.tableCard}>
              {detailData.differential.map((d, i) => (
                <View key={i} style={[styles.tableRow, i === detailData.differential.length - 1 && { borderBottomWidth: 0 }]}><Text style={styles.tableName}>{d.name}</Text><Text style={styles.tableValue}>{d.value}</Text></View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.feedbackButton} onPress={() => setShowFeedback(true)}>
          <Send size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
          <Text style={styles.feedbackButtonText}>Đóng góp dữ liệu cho AI</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      <FeedbackModal 
        visible={showFeedback} 
        onClose={() => setShowFeedback(false)} 
        sessionId={sessionId} // 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  backButton: {
    padding: 8,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 20,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  mainCardContent: {
    flex: 1,
    zIndex: 1,
  },
  microscopeIcon: {
    position: 'absolute',
    right: -10,
    top: 20,
    opacity: 0.5,
  },
  mainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  mainBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.brand.primary,
    marginLeft: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: tokens.colors.text.primary,
    marginBottom: 4,
    lineHeight: 34,
  },
  icdCode: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    marginBottom: 20,
  },
  accuracyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    maxWidth: '100%',
  },
  accuracyValue: {
    fontSize: 24,
    fontWeight: '800',
    color: tokens.colors.brand.primary,
    textAlign: 'center',
  },
  accuracyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.brand.primary,
    borderRadius: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginLeft: 8,
  },
  symptomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  symptomDesc: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: tokens.colors.text.primary,
    lineHeight: 22,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableName: {
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  tableValue: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  feedbackButton: {
    backgroundColor: tokens.colors.brand.primary,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  printButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  printButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.brand.primary,
  },
});

export default DiagnosisDetailScreen;