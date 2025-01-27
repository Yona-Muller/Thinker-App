import React from 'react';
import { StyleSheet, FlatList, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export function NoteCardDetails({ notecard, onClose }: { notecard: any; onClose: () => void }) {
  const videoId = getYouTubeId(notecard.sourceUrl);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <VideoPlayer videoId={videoId || ''} />
            <ThemedText style={styles.title}>{notecard.title}</ThemedText>
          </>
        )}
        data={[
          ...notecard.keyTakeaways.map((item: any) => ({ type: 'takeaway', content: item })),
          ...notecard.thoughts.map((item: any) => ({ type: 'thought', content: item }))
        ]}
        renderItem={({ item }) => (
          <ThemedText style={styles.listItem}>
            {item.type === 'takeaway' ? '🔑 ' : '💭 '}{item.content}
          </ThemedText>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <ThemedText>סגור</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

// פונקציה להוציא את מזהה הסרטון מקישור יוטיוב
const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

// קומפוננטה להצגת הסרטון, עם תמיכה בדפדפן, אנדרואיד ו-iOS
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
});

export default NoteCardDetails;
