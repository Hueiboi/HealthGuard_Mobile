import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export const useDiagnosisData = () => {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(true);

  // Lấy danh sách triệu chứng khi mở màn hình
  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};
      
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Symptoms`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAvailableSymptoms(data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy triệu chứng:", error);
    } finally {
      setIsLoadingSymptoms(false);
    }
  };

  // Hàm gửi dữ liệu chẩn đoán
  const submitDiagnosis = async (mainSymptomDescription, painLevel, symptomIds) => {
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};

      const response = await fetch(`${API_BASE_URL}/api/Mobile/Diagnose`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mainSymptomDescription,
          painLevel,
          symptomIds
        })
      });
      
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Lỗi gửi chẩn đoán:", error);
      return { success: false, message: "Không thể kết nối đến máy chủ." };
    }
  };

  return { availableSymptoms, isLoadingSymptoms, submitDiagnosis };
};