import React, { useState } from 'react';
import { StyleSheet, FlatList, Dimensions, TouchableOpacity, Platform, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  web: 'http://localhost:5000'
});

export function NoteCardDetails({ notecard, onClose, onUpdateIdeas }: { notecard: any; onClose: () => void; onUpdateIdeas: (ideas: string[]) => void }) {
  const videoId = getYouTubeId(notecard.sourceUrl);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  const generateIdeas = async () => {
    try {
      setIsGeneratingIdeas(true);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
  
      // שלב 1: ניתוח התוכן והפקת רעיונות
      const endpoint = videoId ? 'analyze_video' : 'analyze_text';
      const payload = videoId ? {
        video_url: `https://www.youtube.com/watch?v=${videoId}`,
        model: selectedModel
      } : {
        text: notecard.content || notecard.keyTakeaways?.join('\n') || '',
        model: selectedModel
      };
  
      // קריאה ראשונה לניתוח
      const analysisResponse = await fetch(`${API_URL}/${endpoint}`, {
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
  
      // שלב 2: שמירת הרעיונות ל-notecard
      const updateResponse = await fetch(`${API_URL}/note_card/${notecard.id}/ideas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ideas: analysisData.ideas })
      });
  
      if (!updateResponse.ok) {
        throw new Error(`Failed to save ideas: ${await updateResponse.text()}`);
      }
  
      // עדכון ממשק המשתמש
      onUpdateIdeas(analysisData.ideas);
      Toast.show({
        type: 'success',
        text1: 'הצלחה',
        text2: 'הרעיונות נוצרו ונשמרו בהצלחה'
      });
  
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

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            {videoId && <VideoPlayer videoId={videoId} />}
            <ThemedText style={styles.title}>{notecard.title}</ThemedText>
          </>
        )}
        data={[
          ...(notecard.keyTakeaways || []).map((item: string) => ({ type: 'takeaway', content: item })),
          ...(notecard.thoughts || []).map((item: string) => ({ type: 'thought', content: item }))
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
            {isGeneratingIdeas ? 'מייצר רעיונות...' : 'ייצר רעיונות'}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <ThemedText>סגור</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

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
      />
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: width,
    height: (width * 9) / 16, // יחס 16:9
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    alignItems: 'center',
    padding: 10,
  },
  modelSelector: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  generateButton: {
    backgroundColor: '#4CAF50',
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
});

export default NoteCardDetails;
