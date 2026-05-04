import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  Platform 
} from 'react-native';
import { tokens } from '../theme/tokens';
import Header from '../components/Header';
import { 
  FileText,
  Search,
  SlidersHorizontal,
  Calendar,
  AlertCircle, 
  ChevronRight
} from 'lucide-react-native';
import { RECORDS_DATA } from '../constants/mock/records';
import Badge from '../components/Badge';

const RecordScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Header showActions={false} showSettings={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Lịch sử chẩn đoán</Text>
          <Text style={styles.mainSubtitle}>
            Xem lại các kết quả kiểm tra sức khỏe bằng AI của bạn. Hãy ưu tiên thăm khám các triệu chứng có cảnh báo.
          </Text>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={tokens.colors.text.secondary} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Tìm kiếm theo triệu chứng, ngày khám..."
              placeholderTextColor={tokens.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterChip}>
            <Calendar size={16} color={tokens.colors.text.primary} style={{ marginRight: 6 }} />
            <Text style={styles.filterText}>Hôm nay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
            <SlidersHorizontal size={16} color={tokens.colors.brand.primary} style={{ marginRight: 6 }} />
            <Text style={styles.filterTextActive}>Cần lưu ý (2)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconFilterButton}>
            <SlidersHorizontal size={18} color={tokens.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Latest Record Card */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>GẦN ĐÂY NHẤT • HÔM NAY, 14:30</Text>
        </View>

        <TouchableOpacity style={styles.latestCard}>
          <View style={styles.latestInfo}>
            <Text style={styles.latestTitle}>Hội chứng suy hô hấp cấp / Viêm phổi thùy</Text>
            
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Triệu chứng chính</Text>
                <Text style={styles.detailValue}>Khó thở, ho</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Phân loại</Text>
                <Text style={styles.detailValue}>Bệnh hô hấp</Text>
              </View>
            </View>

            <View style={styles.warningBadge}>
              <AlertCircle size={14} color="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={styles.warningText}>Khuyên gặp bác sĩ</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.circleChart}>
              <Text style={styles.chartValue}>90%</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Previous Records List */}
        <View style={styles.listContainer}>
          {RECORDS_DATA.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.recordItem}
              onPress={() => navigation.navigate('DiagnosisDetail')}
            >
              <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>{item.date}</Text>
                <Badge 
                  label={item.statusLabel} 
                  variant={item.status === 'completed' ? 'success' : 'warning'} 
                />
              </View>

              <Text style={styles.recordTitle}>{item.title}</Text>

              <View style={styles.recordFooter}>
                <View style={styles.accuracyBox}>
                  <FileText size={16} color={tokens.colors.text.secondary} style={{ marginRight: 6 }} />
                  <Text style={styles.accuracyLabel}>Mức độ phù hợp: </Text>
                  <Text style={styles.accuracyValue}>{item.accuracy}</Text>
                </View>
                <ChevronRight size={18} color={tokens.colors.text.secondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    lineHeight: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: tokens.colors.text.primary,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  filterChipActive: {
    backgroundColor: '#EEF6FF',
    borderWidth: 1,
    borderColor: tokens.colors.brand.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.text.primary,
  },
  filterTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.colors.brand.primary,
  },
  iconFilterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sectionLabelRow: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: tokens.colors.text.secondary,
    letterSpacing: 0.5,
  },
  latestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: tokens.colors.brand.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  latestInfo: {
    flex: 1,
  },
  latestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 16,
    lineHeight: 24,
  },
  detailGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    marginRight: 24,
  },
  detailLabel: {
    fontSize: 11,
    color: tokens.colors.text.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  circleChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: tokens.colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF6FF',
  },
  chartValue: {
    fontSize: 18,
    fontWeight: '800',
    color: tokens.colors.brand.primary,
  },
  listContainer: {
    gap: 16,
  },
  recordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordDate: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeSuccess: {
    backgroundColor: '#F0FDF4',
  },
  statusBadgeWarning: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: 16,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accuracyBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyLabel: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  accuracyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.brand.primary,
  },
});

export default RecordScreen;
