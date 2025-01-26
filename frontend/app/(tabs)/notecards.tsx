import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, RefreshControl, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Toast from 'react-native-toast-message';
import { NoteCard } from '@/components/NoteCard';
import { NoteCardDetails } from '@/components/NoteCardDetails';
import { SearchBar } from '@/components/SearchBar';

const API_URL = 'http://192.168.1.21:4000';

export default function NoteCardsScreen() {
  const [notecards, setNotecards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkServerConnection = async () => {
    try {
      console.log('Checking server connection...');
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Server health check:', data);
      return response.ok;
    } catch (error) {
      console.error('Server connection check failed:', error);
      return false;
    }
  };

  const fetchNotecards = async () => {
    try {
      setIsLoading(true);
      
      // בדיקת חיבור לשרת
      const isServerAvailable = await checkServerConnection();
      if (!isServerAvailable) {
        Alert.alert('שגיאה', 'לא ניתן להתחבר לשרת');
        return;
      }

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

  return (
    <ThemedView style={styles.container}>
      <SearchBar onNoteCardCreated={handleNoteCardCreated} />
      <FlatList
        data={notecards}
        renderItem={({ item }) => (
          <NoteCard notecard={item} onPress={() => setSelectedCard(item)} />
        )}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading}
            onRefresh={fetchNotecards}
          />
        }
        ListEmptyComponent={() => (
          <ThemedText style={styles.emptyText}>
            {isLoading ? 'טוען...' : 'אין כרטיסים להצגה'}
          </ThemedText>
        )}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  url: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
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