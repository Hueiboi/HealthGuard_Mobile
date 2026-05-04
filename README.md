# HealthGuard - Mobile Application Guide

## Dự án HealthGuard
Dự án di động hỗ trợ chẩn đoán y tế dựa trên AI, được xây dựng bằng **Expo** và **React Native**.

## 🛠 Tech Stack
- **Core:** React Native (Expo SDK)
- **Styling:** StyleSheet (Vanilla CSS approach) - Đã tối ưu cho Windows/Mobile.
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **State:** Context API (Auth & User session)
- **Icons:** Lucide React Native

---

## Hướng dẫn Kết nối API & Dữ liệu động (Dynamic Data)

Để chuyển từ giao diện tĩnh sang dữ liệu thực tế từ Backend, bạn cần thực hiện các bước sau:

### 1. Tổ chức Service Layer
Nên tạo một thư mục `services/` để quản lý các cuộc gọi API.

```javascript
// services/api.js
const BASE_URL = 'https://api.yourdomain.com/v1';

export const diagnosisService = {
  // Gửi triệu chứng để AI phân tích
  startDiagnosis: async (data) => {
    const response = await fetch(`${BASE_URL}/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  // Lấy chi tiết một bản ghi chẩn đoán
  getDiagnosisDetail: async (id) => {
    const response = await fetch(`${BASE_URL}/diagnosis/${id}`);
    return response.json();
  }
};
```

### 2. Xử lý Luồng Chẩn đoán (Summary -> Detail)

#### Bước A: Hiển thị kết quả tóm tắt (Card)
Trong `DiagnosisScreen.js`, sau khi gọi API thành công, bạn lưu kết quả vào `state`.

```javascript
const [diagnosisResult, setDiagnosisResult] = useState(null);

const handleStartDiagnosis = async () => {
  setIsAnalyzing(true);
  try {
    const res = await diagnosisService.startDiagnosis({ symptoms, painLevel });
    setDiagnosisResult(res); // Lưu DTO tóm tắt vào state
  } catch (error) {
    console.error(error);
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### Bước B: Chuyển sang trang Chi tiết (Dynamic Detail)
Khi người dùng ấn "Xem chi tiết", bạn điều hướng và truyền `ID` hoặc toàn bộ object kết quả.

```javascript
// Trong DiagnosisScreen
<TouchableOpacity 
  onPress={() => navigation.navigate('DiagnosisDetail', { diagnosisId: diagnosisResult.id })}
>
  <Text>Xem chi tiết</Text>
</TouchableOpacity>
```

#### Bước C: Nhận dữ liệu tại trang Chi tiết
Tại màn hình chi tiết, sử dụng `useRoute` để lấy tham số đã truyền.

```javascript
// screens/DiagnosisDetailScreen.js
import { useRoute } from '@react-navigation/native';

const DiagnosisDetailScreen = () => {
  const route = useRoute();
  const { diagnosisId } = route.params;
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    // Gọi API lấy full thông tin dựa trên ID
    const fetchDetail = async () => {
      const data = await diagnosisService.getDiagnosisDetail(diagnosisId);
      setDetail(data);
    };
    fetchDetail();
  }, [diagnosisId]);

  if (!detail) return <LoadingIndicator />;

  return (
    <View>
      <Text>{detail.fullAnalysis}</Text>
      <Text>{detail.recommendations}</Text>
    </View>
  );
};
```

### 3. Lưu ý về DTO (Data Transfer Object)
*   **Card Summary**: Chỉ nên chứa các field nhẹ như `title`, `accuracy`, `status`.
*   **Detail View**: Chứa các field nặng như `fullDescription`, `medicalReferences`, `suggestedHospitals`.
*   Việc tách rời như vậy giúp app tải nhanh hơn (Lazy loading) và tiết kiệm băng thông.

---

## Cấu trúc Thư mục Hiện tại
- `/components`: Các thành phần dùng chung (Header, FeedbackModal...).
- `/context`: Quản lý trạng thái (AuthContext).
- `/navigation`: Cấu hình luồng đi của App (AppNavigator).
- `/screens`: Các màn hình chính (Home, Diagnosis, Record, Profile...).
- `/theme`: Định nghĩa màu sắc, font chữ (tokens.js).
