import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from './ThemedText';
import { useNotecards } from '../context/NotecardContext';

const API_URL = 'http://192.168.1.21:4000'; // או 'http://localhost:4000';

export function SearchBar() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshNotecards } = useNotecards();

  

  const getYouTubeVideoId = (url: string) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!url) {
      Alert.alert('שגיאה', 'נא להזין כתובת URL');
      return;
    }

    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      Alert.alert('שגיאה', 'כתובת URL לא תקינה');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('שגיאה', 'נא להתחבר מחדש');
        return;
      }

      // קבלת מידע על הסרטון
      console.log('Fetching video info for ID:', videoId);
      const videoInfoResponse = await fetch(`${API_URL}/youtube/video-info/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!videoInfoResponse.ok) {
        throw new Error('Failed to fetch video info');
      }

      const videoInfo = await videoInfoResponse.json();
      console.log('Received video info:', videoInfo);

      // יצירת כרטיס חדש עם המידע מהסרטון
      const noteCardData = {
        sourceUrl: url,
        sourceType: 'youtube',
        title: videoInfo.title,
        thumbnailUrl: videoInfo.thumbnailUrl,
        channelName: videoInfo.channelTitle,
        channelAvatar: videoInfo.channelThumbnail,
        keyTakeaways: [],
        thoughts: []
      };

      console.log('Creating notecard with data:', noteCardData);

      const response = await fetch(`${API_URL}/notecards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(noteCardData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create notecard:', response.status, errorText);
        throw new Error('Failed to create notecard');
      }

      const newNoteCard = await response.json();
      console.log('Created new notecard:', newNoteCard);
      
      setUrl('');
      await refreshNotecards();
      Alert.alert('הצלחה', 'הכרטיס נוצר בהצלחה');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('שגיאה', 'לא ניתן ליצור כרטיס חדש');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="הכנס קישור ליוטיוב..."
        placeholderTextColor="#999"
        editable={!isLoading}
      />
      <TouchableOpacity 
        onPress={handleSubmit} 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        <ThemedText>{isLoading ? 'טוען...' : 'הוסף'}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

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
    backgroundColor: '#c4c4c4',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});