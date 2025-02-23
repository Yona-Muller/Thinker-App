import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Dimensions, Animated, Pressable, PanResponder } from 'react-native';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const STORY_SIZE = 70;
const SCREEN_WIDTH = Dimensions.get('window').width;
const STORY_DURATION = 4000;

const StoryHighlight = ({ notecard, onPress }) => {
  if (!notecard) return null;
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.storyContainer}>
      <View style={styles.storyCircle}>
        <ThemedText numberOfLines={3} style={styles.storyTitle}>
          {notecard.title || 'ללא כותרת'}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const ProgressBar = ({ progress }) => {
    return (
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
    );
};

const StoryModal = ({ notecard, visible, onClose, onSwipeStory }) => {
  // קריאה לכל ה-hooks תמיד, גם אם לאecard/visible לא תקינים
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);

  const ideas = notecard?.keyTakeaways || [];

  const goToNextIdea = useCallback(() => {
    if (currentIdeaIndex < ideas.length - 1) {
      setCurrentIdeaIndex(prev => prev + 1);
      progress.setValue(0);
    } else {
      onClose();
    }
  }, [currentIdeaIndex, ideas.length, onClose]);

  const startAnimation = useCallback(() => {
    progress.setValue(0);
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        goToNextIdea();
      }
    });
  }, [progress, goToNextIdea]);

  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    setIsPaused(true);
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsPaused(false);
    const currentProgress = progress.__getValue();

    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION * (1 - currentProgress),
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        goToNextIdea();
      }
    });
  }, [progress, goToNextIdea]);

  useEffect(() => {
    if (!visible) {
      // כאשר ה-modal לא נראה – לא מפעילים אנימציה
      setCurrentIdeaIndex(0);
      progress.setValue(0);
      setIsPaused(false);
      return;
    }

    startAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [visible, currentIdeaIndex, startAnimation, progress]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // מבטיח שמידת המגע תעבור ל-PanResponder
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 20
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log("onPanResponderRelease, dx:", gestureState.dx);
        if (gestureState.dx > 50) {
          // Swipe ימינה – מעבר לסטטוס הבא
          if (onSwipeStory) {
            onSwipeStory('next');
          }
        } else if (gestureState.dx < -50) {
          // Swipe שמאלה – מעבר לסטטוס הקודם
          if (onSwipeStory) {
            onSwipeStory('prev');
          }
        }
      },
    })
  ).current;


  
  return (
    <Modal
      visible={visible && !!notecard}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      {notecard && visible ? (
        <ThemedView style={styles.modalContainer}>
          <Pressable
            style={styles.modalContent}
            {...panResponder.panHandlers} // מעביר את ה-panHandlers ל-Pressable
            // onPressIn={pauseAnimation}
            // onPressOut={resumeAnimation}
          >
            {/* Progress Bars */}
            <View style={styles.progressBarsContainer}>
              {ideas.map((_, index) => (
                <View key={index} style={[styles.progressBarWrapper, { flex: 1 }]}>
                  <ProgressBar
                    progress={
                      index === currentIdeaIndex
                        ? progress
                        : new Animated.Value(index < currentIdeaIndex ? 1 : 0)
                    }
                  />
                </View>
              ))}
            </View>
  
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <ThemedText style={styles.closeText}>×</ThemedText>
            </TouchableOpacity>
  
            {/* Content */}
            <View style={styles.insightContainer}>
              <ThemedText style={styles.insightLabel}>INSIGHT</ThemedText>
              <ThemedText style={styles.insightTitle}>
                {notecard.title || 'ללא כותרת'}
              </ThemedText>
  
              {ideas.length > 0 ? (
                <ThemedText style={styles.insightText}>
                  {ideas[currentIdeaIndex]}
                </ThemedText>
              ) : (
                <ThemedText style={styles.insightText}>
                  אין רעיונות עדיין
                </ThemedText>
              )}
            </View>
  
            {/* Navigation Touch Areas */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={styles.navigationHalf}
                onPress={() => {
                  if (currentIdeaIndex > 0) {
                    setCurrentIdeaIndex(prev => prev - 1);
                    progress.setValue(0);
                    startAnimation();
                  }
                }}
                onLongPress={pauseAnimation}
                delayLongPress={200}
                onPressOut={resumeAnimation}
              />
              <TouchableOpacity
                style={styles.navigationHalf}
                onPress={() => {
                  if (currentIdeaIndex < ideas.length - 1) {
                    setCurrentIdeaIndex(prev => prev + 1);
                    progress.setValue(0);
                    startAnimation();
                  } else {
                    onClose();
                  }
                }}
                onLongPress={pauseAnimation}
                delayLongPress={200}
                onPressOut={resumeAnimation}
              />
            </View>
          </Pressable>
        </ThemedView>
      ) : (
        <View />
      )}
    </Modal>
  );  
};


export const StoryHighlights = ({ notecards = [] }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  // state נוסף לשמירת האינדקס של הכרטיס הנבחר
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handler לטיפול ב-Swipe בתוך המודאל – מעדכן את הכרטיס הנבחר בהתאם לכיוון
  const handleSwipeStory = (direction) => {
    if (direction === 'next' && selectedIndex !== null && selectedIndex < notecards.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedCard(notecards[newIndex]);
    } else if (direction === 'prev' && selectedIndex !== null && selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedCard(notecards[newIndex]);
    }
  };

  if (!notecards || notecards.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {notecards.map((card, index) => (
          <StoryHighlight
            key={card?.id || Math.random().toString()}
            notecard={card}
            onPress={() => {
              setSelectedCard(card);
              setSelectedIndex(index);
            }}
          />
        ))}
      </ScrollView>

      <StoryModal
        notecard={selectedCard}
        visible={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onSwipeStory={handleSwipeStory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: STORY_SIZE + 70,
    marginBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    // alignItems: 'center',
  },
  storyContainer: {
    marginHorizontal: 4,
    alignItems: 'center',
  },
  storyCircle: {
    width: STORY_SIZE * 1.3,
    height: STORY_SIZE * 1.85,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  storyTitle: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: '100%',
    padding: 20,
    paddingTop: 50,
  },
  progressBarsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    gap: 5,
  },
  progressBarWrapper: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBar: {
    height: '110%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressContainer: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 28,
    color: '#fff',
  },
  insightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
    opacity: 0.7,
  },
  insightTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  insightText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  navigationHalf: {
    flex: 1,
    height: '100%',
  },
});
