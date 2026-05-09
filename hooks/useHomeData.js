import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
// THÊM THƯ VIỆN NÀY ĐỂ BẮT SỰ KIỆN CHUYỂN TRANG
import { useFocusEffect } from '@react-navigation/native'; 

export const useHomeData = () => {
  const { user } = useAuth();
  const [homeData, setHomeData] = useState({
    bmi: '--', bmiStatus: 'Đang tải...', latestDisease: 'Đang tải...', diagnosisScore: '--%'
  });
  const [isLoading, setIsLoading] = useState(true);

  // THAY useEffect BẰNG useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/Mobile/Dashboard`, {
            headers: { 
              'Authorization': `Bearer ${user?.token}`, 
              'Accept': 'application/json' 
            }
          });
          
          const rawText = await response.text(); 
          
          if (response.ok && rawText && rawText.trim() !== '') {
            try {
              const data = JSON.parse(rawText);
              setHomeData({
                bmi: data.bmi || '--', 
                bmiStatus: data.bmiStatus || 'Chưa cập nhật',
                latestDisease: data.topDiseaseName || 'Chưa có', 
                diagnosisScore: data.diagnosisScore || '--%'
              });
            } catch (e) {
              console.log("Lỗi Parse JSON ở Home");
            }
          }
        } catch (error) {
          console.error("Lỗi tải Home:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      if (user?.token) fetchDashboardData();
    }, [user]) // Reload khi user thay đổi
  );

  return { homeData, isLoading };
};