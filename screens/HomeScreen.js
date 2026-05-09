import React, { useState, useEffect } from 'react';
// ĐÃ THÊM LỆNH NHẬP 'Alert' Ở ĐÂY
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { Bot, Activity, FileText, Clock, ChevronRight, ShieldCheck, Stethoscope } from 'lucide-react-native';
import { ARTICLES_DATA } from '../constants/mock/articles';
import Badge from '../components/Badge';
import { useHomeData } from '../hooks/useHomeData';

const HomeScreen = () => {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const navigation = useNavigation();
  
  const {homeData, isLoading: loadingHome } = useHomeData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(ARTICLES_DATA);
      setLoadingArticles(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // HÀM HIỂN THỊ THÔNG BÁO TÍNH NĂNG ĐANG PHÁT TRIỂN
  const handleFeatureUnderDevelopment = () => {
    Alert.alert(
      "Đang phát triển ",
      "Tính năng Trò chuyện AI đang được chúng tôi hoàn thiện và sẽ sớm ra mắt. Vui lòng đón chờ nhé!",
      [{ text: "Đã hiểu", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner AI */}
        <View style={styles.aiBanner}>
          <View style={styles.aiContent}>
            <Badge label="AI Assistant" icon={Bot} color="#FFFFFF" backgroundColor="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
            <Text style={styles.aiTitle}>Bạn cần hỗ trợ gì hôm nay?</Text>
            <Text style={styles.aiSubtitle}>Hỏi về triệu chứng hoặc đọc kết quả xét nghiệm ngay.</Text>
            {/* ĐÃ GẮN SỰ KIỆN onPress VÀO ĐÂY */}
            <TouchableOpacity style={styles.aiButton} onPress={handleFeatureUnderDevelopment}>
              <ShieldCheck size={20} color="#0053AD" style={{ marginRight: 6 }} />
              <Text style={styles.aiButtonText}>Trò chuyện ngay</Text>
            </TouchableOpacity>
          </View>
          <Image source={require('../assets/images/logo.png')} style={styles.aiImage} />
        </View>

        {/* 3 Nút Tiện Ích */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích nhanh</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Diagnosis')}>
              <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}><Activity size={24} color="#0053AD" /></View>
              <Text style={styles.actionLabel}>Chẩn đoán</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Profile')}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}><FileText size={24} color="#F97316" /></View>
              <Text style={styles.actionLabel}>Hồ sơ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Records')}>
              <View style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}><Clock size={24} color="#8B5CF6" /></View>
              <Text style={styles.actionLabel}>Lịch sử</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chỉ số Backend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chỉ số & Kết quả</Text>
            <TouchableOpacity><Text style={styles.viewMore}>Tất cả</Text></TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <View style={styles.statHeader}>
                <Activity size={20} color="#22C55E" />
                <Text style={styles.statLabel}>Chỉ số BMI</Text>
              </View>
              {loadingHome ? <ActivityIndicator size="small" color="#22C55E" /> : (
                <>
                  <Text style={styles.statValue}>{homeData.bmi}</Text>
                  <Text style={[styles.statStatus, { color: '#22C55E' }]}>{homeData.bmiStatus}</Text>
                </>
              )}
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
              <View style={styles.statHeader}>
                <Stethoscope size={20} color="#EF4444" />
                <Text style={styles.statLabel}>Chẩn đoán mới</Text>
              </View>
              {loadingHome ? <ActivityIndicator size="small" color="#EF4444" /> : (
                <>
                  <Text style={[styles.statValue, { fontSize: 18, marginTop: 4 }]} numberOfLines={1}>{homeData.latestDisease}</Text>
                  <Text style={[styles.statStatus, { color: '#EF4444', marginTop: 4 }]}>Tỷ lệ: {homeData.diagnosisScore}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Bài viết */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Góc sức khoẻ</Text>
          {loadingArticles ? (
            <View style={styles.loadingContainer}><ActivityIndicator size="large" color={tokens.colors.brand.primary} /></View>
          ) : (
            articles.map((article) => (
              <TouchableOpacity key={article.id} style={styles.articleCard}>
                <Image source={require('../assets/images/article.png')} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <Badge label={article.tag} variant="primary" style={{ marginBottom: 6 }} />
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={styles.articleFooter}>
                    <Text style={styles.articleDate}>{article.date}</Text>
                    <ChevronRight size={16} color={tokens.colors.text.secondary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  aiBanner: { backgroundColor: tokens.colors.brand.primary, borderRadius: 24, padding: 20, flexDirection: 'row', overflow: 'hidden', marginBottom: 25 },
  aiContent: { flex: 1, zIndex: 1 },
  aiTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  aiSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 16, lineHeight: 18 },
  aiButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  aiButtonText: { color: tokens.colors.brand.primary, fontSize: 13, fontWeight: '700' },
  aiImage: { width: 100, height: 100, position: 'absolute', right: -10, bottom: -10, opacity: 0.2, tintColor: '#FFFFFF' },
  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 15 },
  viewMore: { fontSize: 14, color: tokens.colors.brand.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center', width: '30%' }, 
  actionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: tokens.colors.text.primary },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { width: '48%', borderRadius: 20, padding: 16 },
  statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 13, fontWeight: '600', color: tokens.colors.text.secondary, marginLeft: 6 },
  statValue: { fontSize: 24, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 4 },
  statStatus: { fontSize: 12, fontWeight: '600' },
  articleCard: { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 3 } }) },
  articleImage: { width: '100%', height: 160 },
  articleContent: { padding: 16 },
  articleTitle: { fontSize: 16, fontWeight: '700', color: tokens.colors.text.primary, lineHeight: 22, marginBottom: 12 },
  articleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  articleDate: { fontSize: 12, color: tokens.colors.text.secondary },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' }
});

export default HomeScreen;