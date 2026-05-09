import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useHistoryData = (sessionId = null) => {
  const queryClient = useQueryClient();

  const getAuthHeader = async () => {
    const authData = await AsyncStorage.getItem('@AuthData');
    const { token } = authData ? JSON.parse(authData) : {};
    return { 'Authorization': `Bearer ${token}` };
  }

  // Hàm gọi API lấy danh sách Lịch sử
  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const headers = await getAuthHeader()
      const response = await fetch(`${API_BASE_URL}/api/Mobile/History`, { headers });
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    }
  });

  // Hàm gọi API lấy Chi tiết một phiên khám
  const detailQuery = useQuery({
    queryKey: ['detail', sessionId],
    queryFn: async () => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/Mobile/DiagnosisDetail/${sessionId}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    },
    enabled: !!sessionId // Chỉ gọi API khi có sessionId
  });

  const deleteMutation = useMutation({
    mutationFn: async(sessionId) => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/Mobile/History/${sessionId}`, {
        method: 'DELETE',
        headers: headers
      });
      const result = await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['history']); // Gọi lại API lấy danh sách lịch sử
    },
    onError: () => {
      console.log('Lỗi xóa lịch sử');
    }
  })

  // Hàm xoá toàn bộ lịch sử chẩn đoán
  const deleteAllMutation = useMutation({
    mutationFn: async() => {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/api/Mobile/History`, {
        method: 'DELETE',
        headers: headers
      });
      const result = await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['history']); // Gọi lại API lấy danh sách lịch sử
    },
    onError: () => {
      console.log('Lỗi xóa toàn bộ lịch sử');
    }
  });

  return { 
    historyData: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
    fetchHistory: historyQuery.refetch,
    detailData: detailQuery.data || [],
    isLoadingDetail: detailQuery.isLoading,
    fetchDetail: detailQuery.refetch,
    deleteHistoryItem: deleteMutation.mutateAsync,
    deleteAllHistory: deleteAllMutation.mutateAsync 
  };
};