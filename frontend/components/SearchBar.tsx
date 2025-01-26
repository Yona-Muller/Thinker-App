import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNotecards } from '../context/NotecardContext';

const API_URL = 'http://192.168.165.208:4000'; // וודא שזה אותו IP כמו בקונטקסט

export const SearchBar = ({ onNoteCardCreated }) => {
  const [url, setUrl] = useState('');
  const { refreshNotecards } = useNotecards();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      Alert.alert('שגיאה', 'נא להזין כתובת URL');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('שגיאה', 'נא להתחבר מחדש');
        return;
      }

      console.log('Creating new notecard for URL:', url);

      const noteCardData = {
        sourceUrl: url,
        sourceType: 'youtube',
        title: 'כותרת זמנית',
        thumbnailUrl: 'https://example.com/default-thumbnail.jpg',
        channelName: 'ערוץ לא ידוע',
        channelAvatar: 'https://example.com/default-avatar.jpg',
        keyTakeaways: [],
        thoughts: []
      };

      const response = await fetch(`${API_URL}/notecards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(noteCardData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create notecard:', response.status, errorText);
        throw new Error('Failed to create notecard');
      }

      const newNoteCard = await response.json();
      console.log('Created new notecard:', newNoteCard);
      
      setUrl('');
      await refreshNotecards(); // רענון הרשימה אחרי הוספת כרטיס חדש
      Toast.show({
        type: 'success',
        text1: 'הכרטיס נוצר בהצלחה!',
        position: 'bottom',
      });
      
      if (onNoteCardCreated) {
        onNoteCardCreated(newNoteCard);
      }
    } catch (error) {
      console.error('Error creating notecard:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'שגיאה ביצירת הכרטיס',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="הדבק קישור ליוטיוב כאן..."
        value={url}
        onChangeText={setUrl}
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity 
        onPress={handleSubmit} 
        style={styles.button}
        disabled={isLoading}
      >
        <Ionicons 
          name={isLoading ? "hourglass-outline" : "add-circle-outline"} 
          size={24} 
          color="#007AFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
    textAlign: 'right',
  },
  button: {
    padding: 5,
  }
});