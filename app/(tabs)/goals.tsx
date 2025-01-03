import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTreeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Goals</ThemedText>
      </ThemedView>
      <ThemedText>An App that helps people organize & generate their thoughts, ideas & learnings </ThemedText>
      <Collapsible title="App Foundation & Goal">
        <ThemedText>
        Create a database for the users thoughts ideas & learnings, integrated with Machine learning that understands the users way of 
        thinking and adjusts accordingly, this database & model will help the user retain the right knowledge and learn & grow in the right desired areas
        </ThemedText>
        <ExternalLink href="https://www.notion.so/Thinker-App-16c889090a11802b8defe22740efe004">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version
        </ThemedText>
      </Collapsible>
      <Collapsible title="App Features ">
        <ThemedText>
        Note cards will be the foundation.
        User just enters a link of a YouTube/Article/Course Module/Podcast/books
         (we”ll start off with just YouTube Videos for the start) and the App creates a note-card with key-takeaways and thought-provoking thoughts
          (tailored to the user-threw a model that gets trained on what thoughts the user saves)
        </ThemedText>
      </Collapsible>
      <Collapsible title="Pricing">
        <ThemedText>
        Offer a fermium model with limited amount of note cards per month and unlimited and to get rest of features would be a monthly/annually charge
        </ThemedText>
      </Collapsible>
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
