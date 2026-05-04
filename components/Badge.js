import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

const Badge = ({ 
  label, 
  variant = 'default', 
  color, 
  backgroundColor, 
  icon: Icon,
  style 
}) => {
  // Determine colors based on variant if not explicitly provided
  let finalColor = color;
  let finalBg = backgroundColor;

  if (!finalColor || !finalBg) {
    switch (variant) {
      case 'success':
        finalColor = '#10B981';
        finalBg = '#DCFCE7';
        break;
      case 'warning':
        finalColor = '#F59E0B';
        finalBg = '#FEF3C7';
        break;
      case 'error':
        finalColor = '#EF4444';
        finalBg = '#FEE2E2';
        break;
      case 'primary':
        finalColor = tokens.colors.brand.primary;
        finalBg = '#EEF6FF';
        break;
      default:
        finalColor = tokens.colors.text.secondary;
        finalBg = '#F1F5F9';
    }
  }

  return (
    <View style={[styles.badge, { backgroundColor: finalBg }, style]}>
      {Icon && <Icon size={12} color={finalColor} style={{ marginRight: 4 }} />}
      <Text style={[styles.label, { color: finalColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default Badge;
