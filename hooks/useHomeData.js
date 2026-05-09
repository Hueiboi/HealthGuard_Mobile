import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
// THÊM THƯ VIỆN NÀY ĐỂ BẮT SỰ KIỆN CHUYỂN TRANG
import { useFocusEffect } from '@react-navigation/native'; 
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useHomeData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const homeQuery = useQuery(
  {
    queryKey: ['homeData', user?.id],
    queryFn: async () => {
      // Response là chuỗi json, cần response.json() để dịch thành object js để truy cập
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Dashboard`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      
      const data = await response.json(); 
      return {
        bmi: data.bmi || '--',
        bmiStatus: data.bmiStatus || 'Chưa cập nhật',
        latestDisease: data.topDiseaseName || 'Chưa có',
        diagnosisScore: data.diagnosisScore || '--%'
      }
    },
    enabled: !!user?.token 
  });

  // THAY useEffect BẰNG useFocusEffect
  useFocusEffect(
    useCallback(() => {
     homeQuery.refetch();
    }, [])
  );

  return { 
    homeData: homeQuery.data || { // Dữ liệu giả lập khi đang tải tránh dữ liệu null, UI thiếu
    bmi: '--',
    bmiStatus: 'Đang tải dữ liệu...',
    latestDisease: 'Đang tải dữ liệu...',
    diagnosisScore: '--%'
  }, isLoading: homeQuery.isLoading };
};