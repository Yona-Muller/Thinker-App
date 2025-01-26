import { Image, StyleSheet, Platform, TouchableOpacity, FlatList, RefreshControl, Modal } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import Toast from 'react-native-toast-message';
import React, { useEffect, useState } from 'react';
import { NoteCard } from '@/components/NoteCard';
import { NoteCardDetails } from '@/components/NoteCardDetails';

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
  const [notecards, setNotecards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchNotecards = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Fetching notecards with token:', token);

      const response = await fetch('http://192.168.1.21:4000/notecards', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched notecards:', data);
      
      setNotecards(data);
    } catch (error) {
      console.error('Error fetching notecards:', error);
      Toast.show({
        type: 'error',
        text1: 'שגיאה בטעינת הכרטיסים',
        position: 'bottom',
      });
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchNotecards();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNotecards();
  }, []);

  const handleNoteCardCreated = (newNoteCard) => {
    setNotecards(prevCards => [newNoteCard, ...prevCards]);
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

            <FlatList
              data={notecards}
              numColumns={3}
              renderItem={({ item }) => (
                <NoteCard notecard={item} onPress={() => setSelectedCard(item)} />
              )}
              keyExtractor={item => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
      
            <Modal
              visible={!!selectedCard}
              animationType="slide"
              onRequestClose={() => setSelectedCard(null)}
            >
              {selectedCard && (
                <NoteCardDetails 
                  notecard={selectedCard} 
                  onClose={() => setSelectedCard(null)}
                />
              )}
            </Modal>
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
  // cardList: {
  //   paddingHorizontal: 16,
  //   paddingVertical: 20,
  // },
  // cardRow: {
  //   justifyContent: 'space-between',
  //   marginBottom: 16,
  // },
  // noteCard: {
  //   flex: 1,
  //   marginHorizontal: 8,
  //   padding: 16,
  //   borderRadius: 16,
  //   backgroundColor: '#fff',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 3,
  // },
  // container: {
  //   flex: 1,
  //   padding: 16,
  // },
  // emptyText: {
  //   textAlign: 'center',
  //   marginTop: 20,
  //   fontSize: 16,
  // },
  // card: {
  //   padding: 16,
  //   marginBottom: 16,
  //   borderRadius: 8,
  //   backgroundColor: '#fff',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // title: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 8,
  // },
  // url: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginBottom: 12,
  // },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  }
}); 