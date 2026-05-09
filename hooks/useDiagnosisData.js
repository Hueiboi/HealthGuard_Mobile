import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useDiagnosisData = () => {
  const queryClient = useQueryClient();

  const getAuthHeader = async () => {
    const authData = await AsyncStorage.getItem('@AuthData');
    const { token } = authData ? JSON.parse(authData) : {};
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  }

  const symptomsQuery = useQuery({
    queryKey: ['symptoms'],
    queryFn: async () => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Symptoms`, { headers });
      const data = await response.json();
      if (!data.success) throw new Error("Không thể lấy danh sách triệu chứng");
      return data.data;
    }
  });

  // Hàm gửi dữ liệu chẩn đoán
  const submitDiagnosisMutation = useMutation({
    // Truyền variables vào đây để hàm linh hoạt hơn
    mutationFn: async (diagnosisData) => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Diagnose`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(diagnosisData) // diagnosisData chứa: { mainSymptomDescription, painLevel, symptomIds }
      });
      return response.json();
    },
    onSuccess: () => {
      // Sau khi chẩn đoán xong, có thể làm mới lịch sử ở màn hình khác
      queryClient.invalidateQueries({ queryKey: ['history'] });
    }
  });

  return { 
    availableSymptoms: symptomsQuery.data || [], 
    isLoadingSymptoms: symptomsQuery.isLoading,
    submitDiagnosis: submitDiagnosisMutation.mutateAsync
  };
};