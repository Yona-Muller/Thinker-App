import React from 'react';
import { StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const { width } = Dimensions.get('window');

export function NoteCardDetails({ notecard, onClose }) {
  return (
    <ThemedView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Image 
              source={{ uri: notecard.thumbnailUrl }} 
              style={styles.thumbnail}
            />
            <ThemedText style={styles.title}>{notecard.title}</ThemedText>
          </>
        )}
        data={[
          ...notecard.keyTakeaways.map(item => ({ type: 'takeaway', content: item })),
          ...notecard.thoughts.map(item => ({ type: 'thought', content: item }))
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: width,
    height: (width * 9) / 16,
    marginBottom: 16, // רווח מתחת לתמונה
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center', // יישור מרכזי של הכותרת
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
