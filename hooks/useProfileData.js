import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProfileData = () => {
  const auth = useAuth();
  const user = auth?.user;
  const updateUserData = auth?.updateUserData;
  
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '', phoneNumber: '', dateOfBirth: '', gender: 'Nam', 
    bloodType: 'Chưa rõ', height: '', weight: '', medicalHistory: '', allergies: '',
    email: '', emergencyContact: '', avatarUrl: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Mobile/Profile`, {
          headers: { 
            'Authorization': `Bearer ${user?.token}`,
            'Accept': 'application/json'
          }
        });
        
        const rawText = await response.text(); 
        
        if (response.ok && rawText && rawText.trim() !== '') {
          try {
            const result = JSON.parse(rawText);
            if (result.success && result.data) {
              const dob = result.data.dateOfBirth ? result.data.dateOfBirth.split('T')[0] : '';
              const fetchedAvatar = result.data.avatarUrl || null;

              setFormData(prev => ({
                ...prev,
                fullName: result.data.fullName || user?.fullName || '',
                phoneNumber: result.data.phoneNumber || user?.phoneNumber || '',
                dateOfBirth: dob,
                height: result.data.height ? result.data.height.toString() : '',
                weight: result.data.weight ? result.data.weight.toString() : '',
                medicalHistory: result.data.medicalHistory || '',
                bloodType: result.data.bloodType || 'Chưa rõ',
                email: result.data.email || user?.email || 'chua-cap-nhat@email.com',
                emergencyContact: result.data.emergencyContact || '0000000000',
                avatarUrl: fetchedAvatar,
                // NOTE: BỔ SUNG ĐỌC DỮ LIỆU TỪ SERVER
                allergies: result.data.allergies || '',
                gender: result.data.gender || 'Nam'
              }));

              if (fetchedAvatar && user?.phoneNumber) {
                 await AsyncStorage.setItem(`@user_avatar_${user.phoneNumber}`, fetchedAvatar);
              }
            }
          } catch (e) {
            console.log("Lỗi Parse Profile. Data:", rawText);
          }
        }
      } catch (error) {
        console.error("Lỗi Network Profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.token) fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    setIsUpdating(true);
    try {
      let validDob = null;
      if (formData.dateOfBirth && formData.dateOfBirth.trim() !== '') {
        validDob = formData.dateOfBirth; 
      }

      const response = await fetch(`${API_BASE_URL}/api/Mobile/UpdateProfile`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user?.token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: validDob,
          height: parseFloat(formData.height) || 0,
          weight: parseFloat(formData.weight) || 0,
          medicalHistory: formData.medicalHistory,
          bloodType: formData.bloodType === 'Chưa rõ' ? null : formData.bloodType,
          Email: formData.email, 
          EmergencyContact: formData.emergencyContact,
          AvatarUrl: formData.avatarUrl,
          // NOTE: BỔ SUNG GỬI LÊN SERVER
          Allergies: formData.allergies,
          Gender: formData.gender 
        })
      });
      
      const rawText = await response.text();
      
      if (response.ok && rawText && rawText.trim() !== '') {
        try {
          const result = JSON.parse(rawText);
          if (result.success) {
            if (updateUserData) {
               await updateUserData({ fullName: formData.fullName });
            }
            if (formData.avatarUrl && user?.phoneNumber) {
               await AsyncStorage.setItem(`@user_avatar_${user.phoneNumber}`, formData.avatarUrl);
            }
            Alert.alert("Thành công", "Hồ sơ đã được cập nhật!", [
              { text: "OK", onPress: () => navigation.goBack() }
            ]);
          } else { Alert.alert("Lỗi", result.message); }
        } catch (e) { Alert.alert("Lỗi", "Dữ liệu máy chủ trả về không hợp lệ."); }
      } else {
        try {
          const errorData = JSON.parse(rawText);
          if (errorData.errors) {
            let errorDetails = [];
            for (let field in errorData.errors) {
              errorDetails.push(`${field}: ${errorData.errors[field].join(', ')}`);
            }
            Alert.alert("Lỗi Dữ Liệu Từ Server", errorDetails.join('\n'));
            return;
          }
        } catch(e) {}
        console.log("Chi tiết lỗi lưu hồ sơ:", response.status, rawText);
        Alert.alert("Lỗi", `Không thể lưu hồ sơ (Mã lỗi: ${response.status})`);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
    } finally {
      setIsUpdating(false);
    }
  };

  return { formData, setFormData, isLoading, isUpdating, updateProfile };
};