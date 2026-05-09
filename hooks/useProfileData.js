import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProfileData = () => {
  const queryClient = useQueryClient();
  const { user, updateUserData } = useAuth();
  
  // 1. State để quản lý form (User gõ gì vào đây)
  const [formData, setFormData] = useState({
    fullName: '', phoneNumber: '', dateOfBirth: '', gender: 'Nam', 
    bloodType: 'Chưa rõ', height: '', weight: '', medicalHistory: '', allergies: '',
    avatarUrl: null
  });

  // 2. Query lấy dữ liệu Profile
  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Profile`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const result = await response.json();
      if (!result.success) throw new Error("Không thể tải hồ sơ");
      return result.data;
    },
    enabled: !!user?.token
  });

  // 3. ĐỒNG BỘ: Khi Query lấy được data, đổ nó vào formData lần đầu tiên
  useEffect(() => {
    if (profileQuery.data) {
      const d = profileQuery.data;
      setFormData({
        fullName: d.fullName || '',
        phoneNumber: d.phoneNumber || '',
        dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split('T')[0] : '',
        gender: d.gender || 'Nam',
        bloodType: d.bloodType || 'Chưa rõ',
        height: d.height?.toString() || '',
        weight: d.weight?.toString() || '',
        medicalHistory: d.medicalHistory || '',
        allergies: d.allergies || '',
        avatarUrl: d.avatarUrl || null
      });
    }
  }, [profileQuery.data]);

  // 4. Mutation cập nhật Profile
  const updateMutation = useMutation({
    mutationFn: async (newData) => {
      const response = await fetch(`${API_BASE_URL}/api/Mobile/Profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      return response.json();
    },
    onSuccess: async (result) => { // Thêm async ở đây
      if (result.success) {
        if (updateUserData) updateUserData({ fullName: formData.fullName });
        
        // LƯU AVATAR VÀO MÁY
        if (formData.avatarUrl && user?.phoneNumber) {
          await AsyncStorage.setItem(`@user_avatar_${user.phoneNumber}`, formData.avatarUrl);
        }

        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    }
  });

  return {
    formData, setFormData, // Để UI gắn vào các TextInput
    isLoading: profileQuery.isLoading,
    isUpdating: updateMutation.isPending,
    updateProfile: () => updateMutation.mutateAsync(formData) // Gửi toàn bộ formData đi
  };
};
