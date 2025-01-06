import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';

export const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Handle voice recognition
  const toggleVoiceRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      await Speech.stop();
    } else {
      try {
        setIsRecording(true);
        
        const { status } = await Speech.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission not granted');
          return;
        }

        Speech.speak('Listening...', {
          onDone: () => {
            setIsRecording(false);
          },
          onError: () => {
            setIsRecording(false);
          }
        });
      } catch (error) {
        console.error(error);
        setIsRecording(false);
      }
    }
  };

  // Handle camera access
  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log(result.assets[0].uri);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        console.log(result.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['transparent', 'rgb(230, 248, 255)']}
        style={styles.topGradient}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Add your Thought/Paste Link"
          placeholderTextColor="#666"
        />
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCamera}>
            <Ionicons name="camera" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleVoiceRecording}>
            <Ionicons
              name={isRecording ? 'mic' : 'mic-outline'}
              size={22}
              color={isRecording ? '#007AFF' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleFileUpload}>
            <Ionicons name="attach" size={22} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: 15,
    right: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  topGradient: {
    position: 'absolute',
    bottom: '117%', // Position it just above the container
    left: -16,
    right: -16,
    height: 60,
    // zIndex: 200,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#808080',
    backgroundColor: 'rgb(230, 248, 255)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    height: Platform.OS === 'ios' ? 24 : undefined,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 0,
  },
});