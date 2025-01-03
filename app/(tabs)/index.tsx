import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
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
});
