import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export const useHistoryData = () => {
  // State cho màn hình Lịch sử (Record)
  const [historyData, setHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // State cho màn hình Chi tiết (DiagnosisDetail)
  const [detailData, setDetailData] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  const [userProfile, setUserProfile] = useState(null);

  // 1. Hàm gọi API lấy danh sách Lịch sử
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};
      
      const response = await fetch(`${API_BASE_URL}/api/Mobile/History`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        setHistoryData(result.data);
      }
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // 2. Hàm gọi API lấy Chi tiết một phiên khám
  const fetchDetail = useCallback(async (sessionId) => {
    setIsLoadingDetail(true);
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};
      
      const response = await fetch(`${API_BASE_URL}/api/Mobile/DiagnosisDetail/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        setDetailData(result.data);
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};
      
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        setUserProfile(result.data);
      }
    } catch (error) {
      console.error("Lỗi lấy Profile:", error);
    }
  }, []);

  const deleteHistoryItem = async (sessionId) => {
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};
      
      const response = await fetch(`${API_BASE_URL}/api/Mobile/History/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        // Cập nhật lại danh sách trên màn hình ngay lập tức mà không cần load lại API
        setHistoryData(prev => prev.filter(item => item.id !== sessionId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi xóa lịch sử:", error);
      return false;
    }
  };

  // THÊM HÀM XÓA TẤT CẢ
  const deleteAllHistory = async () => {
    try {
      const authData = await AsyncStorage.getItem('@AuthData');
      const { token } = authData ? JSON.parse(authData) : {};
      
      const response = await fetch(`${API_BASE_URL}/api/Mobile/History`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        setHistoryData([]); // Làm trống mảng dữ liệu
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi xóa toàn bộ lịch sử:", error);
      return false;
    }
  };

  return { 
    historyData, isLoadingHistory, fetchHistory,
    detailData, isLoadingDetail, fetchDetail,
    deleteHistoryItem, deleteAllHistory 
  };
};