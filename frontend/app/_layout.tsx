import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import Toast, { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';
import { NotecardProvider } from '@/context/NotecardContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { setupAuthToken } from './apiService';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#FF0000' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log('Auth token loaded:', token ? 'exists' : 'missing');
      } catch (error) {
        console.error('Error loading auth token:', error);
      }
    };
    
    setupAuth();
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const isValid = await setupAuthToken();
        setIsAuthenticated(isValid);
        if (isValid) {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isLoading && loaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [isLoading, loaded]);

  if (!loaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NotecardProvider>
      <View style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
            {isAuthenticated && (
              <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
              </>
            )}
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
        <Toast config={toastConfig} />
      </View> 
    </NotecardProvider>
  );
}
