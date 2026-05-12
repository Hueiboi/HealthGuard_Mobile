import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native'; // 👉 ĐÃ THÊM THƯ VIỆN NÀY ĐỂ BẬT POPUP
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        setUser(JSON.parse(authDataSerialized));
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async (newData) => {
    if (user) {
      const updatedUser = { ...user, ...newData }; 
      setUser(updatedUser); 
      try {
        await AsyncStorage.setItem('@AuthData', JSON.stringify(updatedUser)); 
      } catch (e) {
        console.error("Lỗi cập nhật AuthData:", e);
      }
    }
  };

  const sendOtp = async (phoneNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Mobile/SendOtp`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await response.json();

      if (response.ok && data.success) {

        setTimeout(() => {
          Alert.alert(
            "📱 Tin nhắn SMS mới",
            `[HealthGuard] Mã xác thực OTP của bạn là: ${data.otp}. Mã có hiệu lực trong 60 giây. Vui lòng không chia sẻ mã này.`,
            [{ text: "Đóng" }]
          );
        }, 3000);
      }

      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: "Không thể kết nối đến máy chủ Backend." };
    }
  };

  const verifyOtp = async (phoneNumber, otpCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Mobile/VerifyOtp`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const userData = { 
          phoneNumber: phoneNumber, 
          token: data.token,
          fullName: data.fullName 
        };
        setUser(userData);
        await AsyncStorage.setItem('@AuthData', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: data.message || "Mã OTP không chính xác." };
      }
    } catch (error) {
      return { success: false, message: "Không thể kết nối đến máy chủ Backend." };
    }
  };

  const register = async (fullName, phoneNumber, dateOfBirth) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Register`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phoneNumber, dateOfBirth }),
      });
      const data = await response.json();

      if (!response.ok && !data.success && data.errors) {
        let errorDetails = [];
        for (let field in data.errors) {
          errorDetails.push(`${field}: ${data.errors[field].join(', ')}`);
        }
        return { success: false, message: "Lỗi dữ liệu gửi lên:\n" + errorDetails.join('\n') };
      }

      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Lỗi mạng khi gọi Register:", error);
      return { success: false, message: "Không thể kết nối đến máy chủ Backend." };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@AuthData');
  };

  return (
    <AuthContext.Provider value={{ user, sendOtp, verifyOtp, register, logout, isLoading, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);