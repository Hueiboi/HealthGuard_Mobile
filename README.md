# HealthGuard - Mobile Application Setup

## Tổng quan dự án
Dự án di động hỗ trợ chẩn đoán y tế dựa trên AI, được xây dựng bằng **Expo**, **React Native** và **NativeWind (Tailwind CSS)**. Hệ thống được thiết kế theo kiến trúc Modular đảm bảo tính mở rộng (Scalability) và bảo mật thông tin y tế.

## Tech Stack & Dependencies
- **Styling:** `NativeWind` (Tailwind CSS v3)
- **Navigation:** `@react-navigation/native` (Stack & Bottom Tabs)
- **State Management (Auth):** React Context API + `AsyncStorage`
- **Icons:** `lucide-react-native`
- **Safe Area:** `react-native-safe-area-context` (Sử dụng Hook `useSafeAreaInsets`)
- **Babel:** `babel-preset-expo`
```js
// Mẫu khi sử dụng với NativeWind
import { View, Text, Pressable } from 'react-native';

const HealthCard = ({ title, value, unit }) => {
  return (
    // Dùng rounded-md vì đã config 18px trong tailwind.config.js
    <Pressable className="bg-surface-base p-4 rounded-md border border-surface-muted shadow-sm">
      <Text className="text-text-secondary text-caption uppercase font-medium">
        {title}
      </Text>
      <View className="flex-row items-baseline mt-2">
        <Text className="text-text-primary text-h2 font-semibold">
          {value}
        </Text>
        <Text className="text-text-secondary ml-1">
          {unit}
        </Text>
      </View>
    </Pressable>
  );
};
```

### Lệnh cài đặt nhanh:
```bash
npx expo install nativewind tailwindcss @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context lucide-react-native 
npm install react-native-safe-area-context
```# HealthGuard_Mobile
