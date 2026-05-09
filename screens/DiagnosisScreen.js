import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import Header from '../components/Header';
import FeedbackModal from '../components/FeedbackModal';
import { Stethoscope, AlertCircle, ClipboardList, Info, ChevronDown, ChevronUp } from 'lucide-react-native';

import { useDiagnosisData } from '../hooks/useDiagnosisData';

const DiagnosisScreen = ({ navigation }) => {
  const { availableSymptoms, isLoadingSymptoms, submitDiagnosis } = useDiagnosisData();

  const [symptoms, setSymptoms] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [diagnosisResults, setDiagnosisResults] = useState([]);
  
  // STATE ĐIỀU KHIỂN ĐÓNG/MỞ DANH SÁCH TRIỆU CHỨNG
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSymptom = (id) => {
    setSelectedSymptomIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id] 
    );
  };

  const handleStartDiagnosis = async () => {
    if (!symptoms && selectedSymptomIds.length === 0) return;
    
    setIsAnalyzing(true);
    setDiagnosisResults([]); 

    const response = await submitDiagnosis({ 
      mainSymptomDescription: symptoms,
      painLevel: painLevel,
      symptomIds: selectedSymptomIds
    });
    
    setIsAnalyzing(false);

    if (response.success && response.data) {
      setDiagnosisResults(response.data);
    } else {
      Alert.alert("Lỗi chẩn đoán", response.message || "Có lỗi xảy ra khi phân tích dữ liệu.");
    }
  };

  const handleSaveResult = () => setShowFeedback(true);
  const handleFeedbackSubmit = (data) => setShowFeedback(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header showActions={false} showSettings={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>Chẩn đoán Y khoa</Text>
          <Text style={styles.mainSubtitle}>Vui lòng cung cấp thông tin chi tiết về các triệu chứng để hệ thống AI hỗ trợ phân tích lâm sàng.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Stethoscope size={18} color={tokens.colors.brand.primary} />
            <Text style={styles.cardTitle}>Triệu chứng chính</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Mô tả chi tiết các triệu chứng, ví dụ: đau bụng dữ dội vùng thượng vị..."
            placeholderTextColor={tokens.colors.text.secondary}
            multiline textAlignVertical="top" value={symptoms} onChangeText={setSymptoms}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AlertCircle size={18} color={tokens.colors.brand.primary} />
            <Text style={styles.cardTitle}>Mức độ đau (1-10)</Text>
          </View>
          <View style={styles.painLabels}><Text style={styles.painLabel}>Nhẹ</Text><Text style={[styles.painLabel, { color: '#EF4444' }]}>Nặng</Text></View>
          <View style={styles.painScale}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <TouchableOpacity key={num} onPress={() => setPainLevel(num)} style={[styles.painNum, painLevel === num ? styles.painNumActive : {}]}>
                <Text style={[styles.painNumText, painLevel === num ? styles.painNumTextActive : {}]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ClipboardList size={18} color={tokens.colors.brand.primary} />
            <Text style={styles.cardTitle}>Triệu chứng kèm theo</Text>
          </View>
          
          {isLoadingSymptoms ? (
            <ActivityIndicator size="small" color={tokens.colors.brand.primary} />
          ) : availableSymptoms.length === 0 ? (
            <Text style={{ fontSize: 13, color: tokens.colors.text.secondary }}>Chưa có dữ liệu triệu chứng từ hệ thống.</Text>
          ) : (
            <View>
              {/* CẮT DANH SÁCH: CHỈ LẤY 6 CÁI ĐẦU NẾU CHƯA BUNG RA */}
              <View style={styles.checkboxGrid}>
                {(isExpanded ? availableSymptoms : availableSymptoms.slice(0, 6)).map((sym) => {
                  const isSelected = selectedSymptomIds.includes(sym.id);
                  return (
                    <TouchableOpacity 
                      key={sym.id}
                      style={[styles.checkboxItem, isSelected && styles.checkboxActive]} 
                      onPress={() => toggleSymptom(sym.id)}
                    >
                      <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]} />
                      <Text style={styles.checkboxLabel} numberOfLines={1}>{sym.symptomName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* NÚT BẤM XEM THÊM / THU GỌN */}
              {availableSymptoms.length > 6 && (
                <TouchableOpacity 
                  style={styles.toggleButton} 
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  <Text style={styles.toggleButtonText}>
                    {isExpanded ? 'Thu gọn bớt' : `Xem thêm ${availableSymptoms.length - 6} triệu chứng khác`}
                  </Text>
                  {isExpanded ? <ChevronUp size={16} color={tokens.colors.brand.primary} /> : <ChevronDown size={16} color={tokens.colors.brand.primary} />}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, (!symptoms && selectedSymptomIds.length === 0) && styles.buttonDisabled]} 
          onPress={handleStartDiagnosis}
          disabled={isAnalyzing || (!symptoms && selectedSymptomIds.length === 0)}
        >
          {isAnalyzing ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
            <><Stethoscope size={20} color="#FFFFFF" style={{ marginRight: 8 }} /><Text style={styles.primaryButtonText}>Bắt đầu Chẩn đoán</Text></>
          )}
        </TouchableOpacity>

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="small" color={tokens.colors.brand.primary} />
            <Text style={styles.analyzingText}>Đang phân tích dữ liệu lâm sàng...</Text>
          </View>
        )}

        {diagnosisResults.length > 0 && !isAnalyzing && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View><Text style={styles.resultLabel}>Kết quả phân tích AI</Text></View>
              <View style={styles.reliabilityBadge}>
                 <Info size={12} color={tokens.colors.brand.primary} />
                 <Text style={styles.reliabilityText}>Hỗ trợ quyết định</Text>
              </View>
            </View>

            {diagnosisResults.map((result, index) => (
              <View key={index} style={styles.resultInfoBox}>
                <Text style={styles.resultDescription}>
                   Nhận diện: <Text style={styles.boldText}>{result.diseaseName}</Text>
                </Text>
                <Text style={{fontSize: 13, color: '#EF4444', fontWeight: 'bold', marginTop: 4}}>
                   Độ tin cậy: {result.probability}%
                </Text>
                <Text style={{fontSize: 13, color: tokens.colors.text.secondary, marginTop: 8}}>
                   {result.description}
                </Text>
              </View>
            ))}

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.resultSaveButton} onPress={handleSaveResult}>
                <Text style={styles.resultSaveText}>Đóng góp ý kiến cho AI</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} onSubmit={handleFeedbackSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  introSection: { marginBottom: 24 },
  mainTitle: { fontSize: 22, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 8 },
  mainSubtitle: { fontSize: 14, color: tokens.colors.text.secondary, lineHeight: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }) },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: tokens.colors.text.primary, marginLeft: 8 },
  textArea: { backgroundColor: tokens.colors.surface.muted, borderRadius: 12, padding: 12, height: 120, fontSize: 14, color: tokens.colors.text.primary },
  painLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  painLabel: { fontSize: 12, fontWeight: '600', color: tokens.colors.text.secondary },
  painScale: { flexDirection: 'row', justifyContent: 'space-between' },
  painNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  painNumActive: { backgroundColor: tokens.colors.brand.primary },
  painNumText: { fontSize: 12, fontWeight: '600', color: tokens.colors.text.secondary },
  painNumTextActive: { color: '#FFFFFF' },
  checkboxGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.surface.muted, padding: 12, borderRadius: 12, width: '48%', marginBottom: 12 },
  checkboxActive: { backgroundColor: '#EEF6FF', borderColor: tokens.colors.brand.primary, borderWidth: 1 },
  checkCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 8 },
  checkCircleActive: { borderColor: tokens.colors.brand.primary, backgroundColor: tokens.colors.brand.primary },
  checkboxLabel: { fontSize: 13, fontWeight: '600', color: tokens.colors.text.primary },
  
  // STYLE MỚI CHO NÚT XEM THÊM / THU GỌN
  toggleButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  toggleButtonText: { fontSize: 14, fontWeight: '600', color: tokens.colors.brand.primary, marginRight: 4 },
  
  primaryButton: { backgroundColor: tokens.colors.brand.primary, height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  analyzingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  analyzingText: { fontSize: 14, color: tokens.colors.brand.primary, fontWeight: '600', marginLeft: 8 },
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderLeftWidth: 4, borderLeftColor: tokens.colors.brand.primary, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }, android: { elevation: 5 } }) },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  resultLabel: { fontSize: 13, color: tokens.colors.brand.primary, fontWeight: '700', marginBottom: 4 },
  reliabilityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  reliabilityText: { fontSize: 11, fontWeight: '700', color: tokens.colors.brand.primary, marginLeft: 4 },
  resultInfoBox: { backgroundColor: tokens.colors.surface.muted, padding: 16, borderRadius: 16, marginBottom: 12 },
  resultDescription: { fontSize: 14, color: tokens.colors.text.primary, lineHeight: 22 },
  boldText: { fontWeight: '700' },
  resultActions: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  resultSaveButton: { borderWidth: 1, borderColor: tokens.colors.surface.muted, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  resultSaveText: { fontSize: 14, fontWeight: '600', color: tokens.colors.text.primary }
});

export default DiagnosisScreen;