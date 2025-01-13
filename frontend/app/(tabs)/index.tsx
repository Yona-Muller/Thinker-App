import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      Toast.show({
        type: 'success',
        text1: 'התנתקת בהצלחה',
        position: 'bottom',
        visibilityTime: 2000,
      });
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'שגיאה בהתנתקות',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        onPress={handleLogout} 
        style={styles.logoutButton}
      >
        <ThemedText style={styles.logoutText}>התנתק</ThemedText>
      </TouchableOpacity>

      <ParallaxScrollView
        headerBackgroundColor={{ light: '#e6f8fa', dark: '#1D3D47' }}
        headerImage={
          <ThemedView style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.thinkerLogo}
            />
            <ThemedText style={styles.headerText}>Thinker</ThemedText>
          </ThemedView>
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: </ThemedText>
          <ThemedText>
            בסייעתא דשמיא
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: </ThemedText>
          <ThemedText>
            בסייעתא דשמיא
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      <SearchBar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 100,
    left: 35,
    top: 100,
    backgroundColor: 'transparent', 
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3e4d4f',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    height: 150,
    marginBottom: 8,
  },
  thinkerLogo: {
    height: 178,
    width: 90,
    bottom: 0,
    left: 250,
    position: 'absolute',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999,
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
