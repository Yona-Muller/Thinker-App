import React, { useState } from 'react';
import { StyleSheet, FlatList, Dimensions, TouchableOpacity, Platform, TouchableWithoutFeedback, View, Alert, Modal } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_P } from '@/config';
import { MaterialIcons } from '@expo/vector-icons';
import { IdeaSelectionScreen } from './IdeaSelection';

const { width } = Dimensions.get('window');

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export function NoteCardDetails({ notecard, onClose, onUpdateIdeas, onDelete }) {
  const videoId = getYouTubeId(notecard.sourceUrl);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [keyTakeaways, setKeyTakeaways] = useState(notecard.keyTakeaways || []);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showIdeaSelection, setShowIdeaSelection] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);

  const generateIdeas = async () => {
    try {
      setIsGeneratingIdeas(true);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
  
      const endpoint = videoId ? 'analyze_video' : 'analyze_text';
      const payload = videoId ? {
        video_url: `https://www.youtube.com/watch?v=${videoId}`,
        model: selectedModel
      } : {
        text: notecard.content || notecard.keyTakeaways?.join('\n') || '',
        model: selectedModel
      };
  
      const analysisResponse = await fetch(`${API_URL_P}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${await analysisResponse.text()}`);
      }
  
      const analysisData = await analysisResponse.json();
      setGeneratedIdeas(analysisData.ideas);
      setShowIdeaSelection(true);
  
    } catch (error) {
      console.error('Full error details:', error);
      Toast.show({
        type: 'error',
        text1: 'שגיאה',
        text2: error.message || 'אירעה שגיאה בעת יצירת הרעיונות'
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleConfirmSelection = async (selectedIdeas) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL_P}/note_card/${notecard.id}/ideas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ideas: selectedIdeas })
      });

      if (!response.ok) {
        throw new Error('Failed to save ideas');
      }

      setKeyTakeaways(selectedIdeas);
      onUpdateIdeas(selectedIdeas);
      setShowIdeaSelection(false);

      Toast.show({
        type: 'success',
        text1: 'הרעיונות נשמרו בהצלחה'
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'שגיאה',
        text2: error.message || 'אירעה שגיאה בשמירת הרעיונות'
      });
    }
  };

  const deleteNoteCard = async (noteCardId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
      
      const response = await fetch(`${API_URL_P}/delete_notecard`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: noteCardId })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${await response.text()}`);
      }
      
      Toast.show({ type: 'success', text1: 'נמחק בהצלחה', text2: 'הכרטיסייה נמחקה מהמערכת' });
      onDelete(noteCardId);
    } catch (error) {
      console.error('Delete error:', error);
      Toast.show({ type: 'error', text1: 'שגיאה', text2: error.message || 'אירעה שגיאה בעת המחיקה' });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'deletion confirmation',
      'Are you sure you want to delete this tab?',
      [
        { text: 'cancel', style: 'cancel' },
        { text: 'delete', onPress: () => deleteNoteCard(notecard.id), style: 'destructive' }
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.menu}>
              <TouchableOpacity onPress={confirmDelete} style={styles.menuItem}>
                <ThemedText>🗑️ delete this note card</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <FlatList
          ListHeaderComponent={() => (
          <>
            <VideoPlayer videoId={videoId || ''} />
            <ThemedText style={styles.title}>{notecard.title}</ThemedText>
          </>
        )}
          data={[
            ...(keyTakeaways || []).map((item) => ({ type: 'takeaway', content: item })),
            ...(notecard.thoughts || []).map((item) => ({ type: 'thought', content: item }))
          ]}
          renderItem={({ item }) => (
            <ThemedText style={styles.listItem}>
              {item.type === 'takeaway' ? '🔑 ' : '💭 '}{item.content}
            </ThemedText>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.modelSelector}>
          <Picker
            selectedValue={selectedModel}
            onValueChange={(value) => setSelectedModel(value)}
            style={styles.picker}
          >
            <Picker.Item label="OpenAI" value="openai" />
            <Picker.Item label="Google Gemini" value="gemini" />
            <Picker.Item label="DeepSeek" value="deepseek" />
          </Picker>
          <TouchableOpacity 
            style={[
              styles.generateButton,
              isGeneratingIdeas && styles.generateButtonDisabled
            ]}
            onPress={generateIdeas}
            disabled={isGeneratingIdeas}
          >
            <ThemedText style={styles.generateButtonText}>
              {isGeneratingIdeas ? 'creating ideas...' : 'creat ideas'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <ThemedText>close</ThemedText>
        </TouchableOpacity>

        <Modal
          visible={showIdeaSelection}
          animationType="slide"
          onRequestClose={() => setShowIdeaSelection(false)}
        >
          <IdeaSelectionScreen
            ideas={generatedIdeas}
            onConfirmSelection={handleConfirmSelection}
            onClose={() => setShowIdeaSelection(false)}
          />
        </Modal>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const VideoPlayer = ({ videoId }: { videoId: string }) => {
  if (Platform.OS === 'web') {
    return (
      <iframe
        width="100%"
        height={(width * 9) / 16}
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  } else {
    return (
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        style={styles.thumbnail}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false} 
      />
    );
  }
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff'
   },
   thumbnail: {
    width: width,
    height: (width * 9) / 16, // יחס 16:9
    marginBottom: 16,
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    padding: 10
   },
  menuButton: { 
    padding: 5 
  },
  menu: { 
    position: 'absolute', 
    top: 30, 
    right: 10, 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 5, 
    shadowOpacity: 0.3, 
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  menuItem: {
    padding: 10 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  listItem: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  modelSelector: { 
    marginVertical: 10, 
    padding: 10, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 8 
  },
  picker: { 
    height: 50, 
    width: '100%' 
  },
  closeButton: { 
    alignItems: 'center', 
    padding: 10 
  },
  generateButton: {
    backgroundColor: '#b5a664',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateButtonDisabled: {
    opacity: 0.5
  }
});

export default NoteCardDetails;
