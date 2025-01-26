import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface NoteCardProps {
  notecard: {
    id: number;
    title: string;
    sourceUrl: string;
    sourceType: string;
    keyTakeaways: string[];
    thoughts: string[];
    thumbnailUrl?: string;
    channelName?: string;
    channelAvatar?: string;
  };
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 5; // 16px padding on each side

export const NoteCard = ({ notecard, onPress }: NoteCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView style={styles.card}>
        <Image 
          source={{ uri: notecard.thumbnailUrl}}// || 'https://via.placeholder.com/480x360' }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <ThemedView style={styles.contentContainer}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {notecard.title}
          </ThemedText>
          <ThemedView style={styles.channelInfo}>
            {notecard.channelAvatar && (
              <Image 
                source={{ uri: notecard.channelAvatar }}
                style={styles.channelAvatar}
              />
            )}
            <ThemedText style={styles.channelName}>
              {notecard.channelName || 'Channel Name'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: '100%',
    height: (CARD_WIDTH * 9) / 16, // 16:9 aspect ratio
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  channelName: {
    fontSize: 14,
    color: '#666',
  },



  cardList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  noteCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
}); 