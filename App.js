import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}