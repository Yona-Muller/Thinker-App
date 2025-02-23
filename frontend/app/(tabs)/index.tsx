import { Image, StyleSheet, Platform, TouchableOpacity, FlatList, RefreshControl, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import { StoryHighlights } from '@/components/StoryHighlights';
import Toast from 'react-native-toast-message';
import React, { useEffect, useState } from 'react';
import { NoteCard } from '@/components/NoteCard';
import { NoteCardDetails } from '@/components/NoteCardDetails';
import { API_URL } from '@/config';

// const API_URL = 'http://localhost:4000';

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
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('שגיאה', 'נא להתחבר מחדש');
        return;
      }

      const response = await fetch(`${API_URL}/notecards`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setNotecards(data);
    } catch (error) {
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

  const handleUpdateIdeas = async (cardId: any, newIdeas: any) => {
    try {
      setNotecards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, keyTakeaways: newIdeas } : card
        )
      );

      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${API_URL}/notecards/${cardId}/ideas`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideas: newIdeas }),
      });

      Toast.show({
        type: 'success',
        text1: 'הרעיונות עודכנו בהצלחה',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'שגיאה בעדכון הרעיונות',
        position: 'bottom',
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>התנתק</ThemedText>
      </TouchableOpacity>

      <ParallaxScrollView
        headerBackgroundColor={{ light: '#e6f8fa', dark: '#1D3D47' }}
        headerImage={
          <ThemedView style={styles.headerContainer}>
            <StoryHighlights notecards={notecards} />
          </ThemedView>
        }
      >
        <FlatList
          style={styles.noteCards}
          data={notecards}
          numColumns={3}
          renderItem={({ item }) => (
            <NoteCard notecard={item} onPress={() => setSelectedCard(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: -5,
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
              onUpdateIdeas={(ideas) =>
                handleUpdateIdeas(selectedCard.id, ideas)
              }
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
    height: 130,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3e4d4f',
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
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noteCards: {
    marginHorizontal: -22,
  },
});
