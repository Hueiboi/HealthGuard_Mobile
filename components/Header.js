import React, { useState, useCallback } from 'react';
// 1. ĐÃ THÊM 'Alert' VÀO ĐÂY
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { Bell, Settings } from 'lucide-react-native';
import { tokens } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Header = ({ showActions = true, showSettings = false }) => {
  const { user } = useAuth();
  
  const [avatarUri, setAvatarUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadAvatar = async () => {
        try {
          if (user && user.phoneNumber) {
            const savedImage = await AsyncStorage.getItem(`@user_avatar_${user.phoneNumber}`);
            if (savedImage) setAvatarUri(savedImage);
          }
        } catch (e) { console.log(e); }
      };
      loadAvatar();
    }, [user]) // Nhớ gắn [user] vào đây
  );

  // 2. HÀM HIỂN THỊ THÔNG BÁO TÍNH NĂNG ĐANG PHÁT TRIỂN
  const handleFeatureUnderDevelopment = () => {
    Alert.alert(
      "Đang phát triển ",
      "Hệ thống thông báo và cài đặt đang được chúng tôi nâng cấp. Vui lòng quay lại sau nhé!",
      [{ text: "Đã hiểu", style: "default" }]
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image 
          source={avatarUri ? { uri: avatarUri } : require('../assets/images/avatar.png')} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.greeting}>Xin chào 👋</Text>
          <Text style={styles.userName}>{user?.fullName || user?.phoneNumber || 'Bệnh nhân'}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {showActions && (
          // 3. GẮN SỰ KIỆN onPress VÀO NÚT CHUÔNG THÔNG BÁO
          <TouchableOpacity style={styles.iconButton} onPress={handleFeatureUnderDevelopment}>
            <View style={styles.badge} />
            <Bell size={24} color={tokens.colors.text.primary} />
          </TouchableOpacity>
        )}
        {showSettings && (
          // 3. GẮN SỰ KIỆN onPress VÀO NÚT CÀI ĐẶT LUÔN CHO ĐỒNG BỘ
          <TouchableOpacity style={styles.iconButton} onPress={handleFeatureUnderDevelopment}>
            <Settings size={24} color={tokens.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ... TOÀN BỘ CSS PHÍA DƯỚI GIỮ NGUYÊN ...
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.status.error,
    zIndex: 1,
  },
});

export default Header;