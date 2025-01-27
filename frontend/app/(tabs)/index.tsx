import { Image, StyleSheet, Platform, TouchableOpacity, FlatList, RefreshControl, Modal, Alert   } from 'react-native';
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

const API_URL = 'http://localhost:4000';

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
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotecards = async () => {
    try {
      setIsLoading(true);
      
      // בדיקת חיבור לשרת
      // const isServerAvailable = await checkServerConnection();
      // if (!isServerAvailable) {
      //   Alert.alert('שגיאה', 'לא ניתן להתחבר לשרת');
      //   return;
      // }

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        Alert.alert('שגיאה', 'נא להתחבר מחדש');
        return;
      }

      console.log('Fetching notecards...');
      const response = await fetch(`${API_URL}/notecards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched notecards:', data.length);
      setNotecards(data);
    } catch (error) {
      console.error('Error fetching notecards:', error);
      Alert.alert('שגיאה', 'בעיה בטעינת הכרטיסים');
    } finally {
      setIsLoading(false);
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

  const handleUpdateIdeas = async (cardId, newIdeas) => {
    try {
      // עדכן את הרעיונות ברשימת הכרטיסים
      setNotecards(prevCards => 
        prevCards.map(card => 
          card.id === cardId 
            ? { ...card, keyTakeaways: newIdeas }
            : card
        )
      );
  
      // אופציונלי: שמור את השינויים בשרת
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${API_URL}/notecards/${cardId}/ideas`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideas: newIdeas })
      });
  
      Toast.show({
        type: 'success',
        text1: 'הרעיונות עודכנו בהצלחה',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Error updating ideas:', error);
      Toast.show({
        type: 'error',
        text1: 'שגיאה בעדכון הרעיונות',
        position: 'bottom',
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

            <FlatList style={styles.noteCards}
              data={notecards}
              numColumns={3}
              renderItem={({ item }) => (
                <NoteCard notecard={item} onPress={() => setSelectedCard(item)} />
              )}
              keyExtractor={item => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              columnWrapperStyle={{
                justifyContent: 'space-between',  // יישור מרווחים בין העמודות
                // paddingHorizontal: 10,            // שליטה ברווחים אופקיים בין הסרטונים
                marginBottom: -5,                 // רווח מתחת לשורה של הסרטונים
              }}
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
                  onUpdateIdeas={(ideas) => handleUpdateIdeas(selectedCard.id, ideas)}
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
  noteCards:{
    marginHorizontal: -22,

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