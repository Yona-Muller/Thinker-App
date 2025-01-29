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
const CARD_WIDTH = (width - 45) / 3;

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
          <ThemedText style={styles.title} numberOfLines={3}>
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
    backgroundColor: '#fff',
  },
  card: {
    width: CARD_WIDTH,
    // height: 210,
    borderRadius: 12,
    // backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: '90%',
    alignSelf: 'center',
    height: (CARD_WIDTH * 9) / 16, // שמור על יחס 16:9
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 15,
    lineHeight: 18,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelAvatar: {
    width: 24, 
    height: 24,
    borderRadius: 14,
    marginRight: 8,
  },
  channelName: {
    fontSize: 14,
    color: '#666',
  },
});
