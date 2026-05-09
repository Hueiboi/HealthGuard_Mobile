import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Platform, Alert } from 'react-native';
import { tokens } from '../theme/tokens';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { User, ChevronRight, Activity, Calendar, ShieldCheck, Bell, LogOut, Pencil } from 'lucide-react-native';

const MenuItem = ({ icon: Icon, title, subtitle, onPress, isDestructive = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuIconContainer, isDestructive && { backgroundColor: '#FEF2F2' }]}>
        <Icon size={22} color={isDestructive ? '#EF4444' : tokens.colors.brand.primary} />
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {!isDestructive && <ChevronRight size={20} color={tokens.colors.text.secondary} />}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation(); 

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
    }, [user]) 
  );

  // NOTE: HÀM HIỂN THỊ THÔNG BÁO TÍNH NĂNG ĐANG PHÁT TRIỂN
  const handleFeatureUnderDevelopment = () => {
    Alert.alert(
      "Đang phát triển ",
      "Tính năng này đang được chúng tôi hoàn thiện và sẽ sớm ra mắt trong các bản cập nhật tiếp theo. Vui lòng quay lại sau nhé!",
      [{ text: "Đã hiểu", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showActions={false} showSettings={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={avatarUri ? { uri: avatarUri } : require('../assets/images/avatar.png')} 
              style={styles.largeAvatar} 
            />
          </View>
          <Text style={styles.profileName}>{user?.fullName || user?.phoneNumber || 'Hồ sơ chưa có tên'}</Text>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem 
            icon={Activity} 
            title="Hồ sơ sức khỏe cá nhân" 
            subtitle="Chỉ số và tiền sử bệnh án"
            onPress={() => navigation.navigate('UpdateProfile')} 
          />
          {/* GẮN HÀM THÔNG BÁO VÀO CÁC NÚT CHƯA PHÁT TRIỂN */}
          <MenuItem 
            icon={Calendar} 
            title="Lịch hẹn khám của tôi" 
            subtitle="Quản lý lịch khám sắp tới" 
            onPress={handleFeatureUnderDevelopment} 
          />
          <MenuItem 
            icon={ShieldCheck} 
            title="Gói bảo hiểm y tế" 
            subtitle="Thông tin và quyền lợi bảo hiểm" 
            onPress={handleFeatureUnderDevelopment} 
          />
          <MenuItem 
            icon={Bell} 
            title="Cài đặt thông báo" 
            subtitle="Tùy chỉnh nhận cảnh báo" 
            onPress={handleFeatureUnderDevelopment} 
          />
        </View>

        <View style={styles.logoutSection}>
          <MenuItem icon={LogOut} title="Đăng xuất" isDestructive={true} onPress={logout} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  largeAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFFFFF', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }, android: { elevation: 8 } }) },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#FFFFFF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 4 } }) },
  profileName: { fontSize: 24, fontWeight: '800', color: tokens.colors.text.primary },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, marginBottom: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15 }, android: { elevation: 2 } }) },
  logoutSection: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15 }, android: { elevation: 2 } }) },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: tokens.colors.text.primary, marginBottom: 2 },
  menuSubtitle: { fontSize: 12, color: tokens.colors.text.secondary }
});

export default ProfileScreen;