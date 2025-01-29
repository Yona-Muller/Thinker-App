import React, { useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import Toast from 'react-native-toast-message';

export function IdeaSelectionScreen({ ideas, onConfirmSelection }) {
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  const toggleSelection = (idea) => {
    if (selectedIdeas.includes(idea)) {
      setSelectedIdeas(selectedIdeas.filter((item) => item !== idea));
    } else if (selectedIdeas.length < 5) {
      setSelectedIdeas([...selectedIdeas, idea]);
    } else {
      Toast.show({
        type: 'error',
        text1: 'שגיאה',
        text2: 'ניתן לבחור עד 5 רעיונות בלבד'
      });
    }
  };

  const handleConfirm = () => {
    if (selectedIdeas.length !== 5) {
      Alert.alert('שים לב', 'יש לבחור בדיוק 5 רעיונות לפני המשך.');
      return;
    }

    onConfirmSelection(selectedIdeas);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.headerText}>
        בחר 5 רעיונות מתוך הרשימה ({selectedIdeas.length}/5)
      </ThemedText>

      <TouchableOpacity 
        style={[
          styles.confirmButton,
          selectedIdeas.length !== 5 && styles.confirmButtonDisabled
        ]} 
        onPress={handleConfirm}
      >
        <ThemedText style={styles.confirmButtonText}>
          בחר רעיונות
        </ThemedText>
      </TouchableOpacity>
      
      <FlatList
        data={ideas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.ideaBox,
              selectedIdeas.includes(item) && styles.ideaBoxSelected
            ]}
            onPress={() => toggleSelection(item)}
          >
            <ThemedText style={[
              styles.ideaText,
              selectedIdeas.includes(item) && styles.ideaTextSelected
            ]}>
              {item}
            </ThemedText>
            
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={[
          styles.confirmButton,
          selectedIdeas.length !== 5 && styles.confirmButtonDisabled
        ]} 
        onPress={handleConfirm}
      >
        <ThemedText style={styles.confirmButtonText}>
          בחר רעיונות
        </ThemedText>
      </TouchableOpacity>
      {/* /> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  ideaBox: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ideaBoxSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  ideaText: {
    fontSize: 16,
    color: '#000',
  },
  ideaTextSelected: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'red', // גבול זמני לאבחון
  },
  
});