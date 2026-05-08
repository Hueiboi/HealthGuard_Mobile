import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { FileText, Calendar, ChevronRight, Trash2, ClipboardList } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useHistoryData } from '../hooks/useHistoryData';

const RecordScreen = ({ navigation }) => {
  const { historyData, isLoadingHistory, fetchHistory, deleteHistoryItem, deleteAllHistory } = useHistoryData();  
  
  // STATE MỚI: LƯU NGÀY ĐANG ĐƯỢC CHỌN LỌC (Mặc định là 'Tất cả')
  const [selectedDate, setSelectedDate] = useState('Tất cả');

  useFocusEffect(
    useCallback(() => {
      fetchHistory(); 
    }, [fetchHistory])
  );

  // ==========================================
  // THUẬT TOÁN: LỌC RA CÁC NGÀY DUY NHẤT TỪ LỊCH SỬ
  // ==========================================
  const uniqueDates = useMemo(() => {
    const dates = ['Tất cả'];
    if (historyData && historyData.length > 0) {
      // Tách lấy phần ngày (trước dấu phẩy) từ chuỗi "06/05/2026, 20:58"
      const extractedDates = historyData.map(item => item.date.split(',')[0].trim());
      // Dùng Set để loại bỏ các ngày trùng lặp
      dates.push(...new Set(extractedDates));
    }
    return dates;
  }, [historyData]);

  // Lọc dữ liệu theo ngày được chọn
  const filteredHistory = historyData ? historyData.filter(item => {
    if (selectedDate === 'Tất cả') return true;
    return item.date.startsWith(selectedDate);
  }) : [];

  // ==========================================
  // XỬ LÝ XÓA
  // ==========================================
  const confirmDeleteOne = (id, title) => {
    Alert.alert(
      "Xóa kết quả này?",
      `Bạn có chắc chắn muốn xóa kết quả "${title}" không? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => deleteHistoryItem(id) }
      ]
    );
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Xóa TẤT CẢ lịch sử?",
      "Toàn bộ kết quả chẩn đoán của bạn sẽ bị xóa sạch. Bạn có chắc chắn không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa sạch", style: "destructive", onPress: () => {
          deleteAllHistory();
          setSelectedDate('Tất cả'); // Trả về 'Tất cả' sau khi xóa
        }}
      ]
    );
  };

  // Chỉ hiển thị thẻ "Gần đây nhất" nếu đang xem Tất cả (để tránh trùng lặp khi lọc 1 ngày)
  const showLatestCard = selectedDate === 'Tất cả' && historyData && historyData.length > 0;
  const latestRecord = showLatestCard ? historyData[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Header showActions={false} showSettings={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.headerSection, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mainTitle}>Lịch sử chẩn đoán</Text>
            <Text style={styles.mainSubtitle}>Xem lại các kết quả kiểm tra sức khỏe bằng AI của bạn.</Text>
          </View>
          {historyData && historyData.length > 0 && (
            <TouchableOpacity onPress={confirmDeleteAll} style={{ padding: 8 }}>
              <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600' }}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ========================================== */}
        {/* GIAO DIỆN BỘ LỌC NGÀY (THAY THẾ THANH TÌM KIẾM) */}
        {/* ========================================== */}
        {uniqueDates.length > 1 && (
          <View style={styles.dateFilterContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.dateFilterScroll}
            >
              {uniqueDates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateChip, selectedDate === date && styles.dateChipActive]}
                  onPress={() => setSelectedDate(date)}
                >
                  {date === 'Tất cả' && <Calendar size={14} color={selectedDate === date ? '#FFFFFF' : tokens.colors.text.secondary} style={{marginRight: 6}} />}
                  <Text style={[styles.dateChipText, selectedDate === date && styles.dateChipTextActive]}>
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* THẺ BỆNH GẦN ĐÂY NHẤT */}
        {latestRecord && (
          <>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>GẦN ĐÂY NHẤT • {latestRecord.date.toUpperCase()}</Text>
            </View>

            <TouchableOpacity style={styles.latestCard} onPress={() => navigation.navigate('DiagnosisDetail', { sessionId: latestRecord.id })}>
              <View style={styles.latestInfo}>
                <Text style={styles.latestTitle}>{latestRecord.title}</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Triệu chứng</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>{latestRecord.mainSymptoms}</Text>
                  </View>
                </View>
                <Badge label="HOÀN TẤT" variant="success" />
              </View>
              <View style={styles.chartContainer}>
                <View style={styles.circleChart}>
                  <Text style={styles.chartValue}>{latestRecord.accuracy}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* DANH SÁCH LỊCH SỬ ĐÃ LỌC */}
        <View style={styles.listContainer}>
          {isLoadingHistory ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tokens.colors.brand.primary} />
              <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
            </View>
          ) : filteredHistory.length === 0 ? (
            // GIAO DIỆN TRỐNG KHI KHÔNG CÓ DỮ LIỆU HOẶC TÌM KHÔNG THẤY
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <ClipboardList size={56} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>
                {historyData?.length === 0 ? 'Chưa có hồ sơ chẩn đoán' : 'Không có hồ sơ trong ngày này'}
              </Text>
              <Text style={styles.emptyDesc}>
                {historyData?.length === 0 
                  ? 'Khi bạn thực hiện chẩn đoán bệnh bằng AI, các kết quả sẽ được tự động lưu trữ và hiển thị tại đây.'
                  : 'Vui lòng chọn một ngày khác để xem lịch sử chẩn đoán của bạn.'}
              </Text>
            </View>
          ) : (
            filteredHistory.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.recordItem}
                onPress={() => navigation.navigate('DiagnosisDetail', { sessionId: item.id })}
              >
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>{item.date}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Badge label={item.statusLabel} variant="success" />
                    <TouchableOpacity 
                      style={{ padding: 4, marginLeft: 12 }} 
                      onPress={() => confirmDeleteOne(item.id, item.title)}
                    >
                      <Trash2 size={18} color="#EF4444" opacity={0.7} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.recordTitle}>{item.title}</Text>
                <View style={styles.recordFooter}>
                  <View style={styles.accuracyBox}>
                    <FileText size={16} color={tokens.colors.text.secondary} style={{ marginRight: 6 }} />
                    <Text style={styles.accuracyLabel}>Độ tin cậy: </Text>
                    <Text style={styles.accuracyValue}>{item.accuracy}</Text>
                  </View>
                  <ChevronRight size={18} color={tokens.colors.text.secondary} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// THÊM CSS CHO CHIP LỌC NGÀY VÀ GIỮ NGUYÊN CSS CŨ
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  headerSection: { marginBottom: 20 },
  mainTitle: { fontSize: 24, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 8 },
  mainSubtitle: { fontSize: 14, color: tokens.colors.text.secondary, lineHeight: 20 },
  
  // --- CSS MỚI CHO THANH LỌC THEO NGÀY ---
  dateFilterContainer: { marginBottom: 24, marginHorizontal: -20 },
  dateFilterScroll: { paddingHorizontal: 20 },
  dateChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }, android: { elevation: 1 } }) },
  dateChipActive: { backgroundColor: tokens.colors.brand.primary, borderColor: tokens.colors.brand.primary },
  dateChipText: { fontSize: 14, color: tokens.colors.text.secondary, fontWeight: '600' },
  dateChipTextActive: { color: '#FFFFFF' },
  // --------------------------------------

  sectionLabelRow: { marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: tokens.colors.text.secondary, letterSpacing: 0.5 },
  latestCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, flexDirection: 'row', marginBottom: 25, ...Platform.select({ ios: { shadowColor: tokens.colors.brand.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20 }, android: { elevation: 4 } }) },
  latestInfo: { flex: 1 },
  latestTitle: { fontSize: 18, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 16, lineHeight: 24 },
  detailGrid: { flexDirection: 'row', marginBottom: 16 },
  detailItem: { marginRight: 24 },
  detailLabel: { fontSize: 11, color: tokens.colors.text.secondary, marginBottom: 4 },
  detailValue: { fontSize: 13, fontWeight: '700', color: tokens.colors.text.primary },
  chartContainer: { justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  circleChart: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: tokens.colors.brand.primary, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEF6FF' },
  chartValue: { fontSize: 18, fontWeight: '800', color: tokens.colors.brand.primary },
  listContainer: { gap: 16 },
  recordItem: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10 }, android: { elevation: 2 } }) },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recordDate: { fontSize: 11, fontWeight: '600', color: tokens.colors.text.secondary },
  recordTitle: { fontSize: 15, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 16 },
  recordFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accuracyBox: { flexDirection: 'row', alignItems: 'center' },
  accuracyLabel: { fontSize: 12, color: tokens.colors.text.secondary },
  accuracyValue: { fontSize: 14, fontWeight: '700', color: tokens.colors.brand.primary },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: tokens.colors.text.secondary },
  
  // STYLE GIAO DIỆN TRỐNG (Empty State)
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 40 },
  emptyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: tokens.colors.text.secondary, textAlign: 'center', lineHeight: 22 }
});

export default RecordScreen;