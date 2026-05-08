import Constants from 'expo-constants'; // tải npx expo install expo-constants trước nhé

// Lấy địa chỉ Host URI từ Expo (ví dụ: 192.168.1.5:8081)
const debuggerHost = Constants.expoConfig?.hostUri;

// Trích xuất địa chỉ IP, loại bỏ cổng
// Nếu không lấy được IP (ví dụ khi build ra file APK), nó sẽ fallback về 'localhost'
let ipAddress = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

// Mặc định cho Android Emulator khi không lấy được IP mạng LAN
if (ipAddress === 'localhost') {
  ipAddress = '10.0.2.2'; 
}

// LƯU Ý: Đảm bảo Backend ASP.NET Core của bạn đang chạy ở cổng 5000 (HTTP)
// Bạn có thể xem cổng này trong file launchSettings.json của Backend
export const API_BASE_URL = `https://bf94xw0s-5297.asse.devtunnels.ms`;

// Dòng này để bạn kiểm tra xem URL đã đúng chưa trên Terminal của Expo
console.log("[CONFIG] API Base URL:", API_BASE_URL);