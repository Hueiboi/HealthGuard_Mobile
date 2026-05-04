import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { tokens } from '../theme/tokens';
import { Bell, Search, Settings } from 'lucide-react-native';

const Header = ({ showActions = true, showSettings = false }) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image 
          source={require('../assets/images/avatar.png')} 
          style={styles.avatar} 
        />
        <View style={styles.userText}>
          <Text style={styles.greeting}>Xin chào 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Dr. Hueiboi'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {showActions && (
          <>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={22} color={tokens.colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={22} color={tokens.colors.text.primary} />
            </TouchableOpacity>
          </>
        )}
        {showSettings && (
          <TouchableOpacity style={styles.iconButton}>
            <Settings size={22} color={tokens.colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: tokens.colors.brand.primary,
  },
  userText: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 11,
    color: tokens.colors.text.secondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: tokens.colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default Header;
