import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from './ThemedText';

export type AIModel = 'openai' | 'gemini' | 'deepseek';

interface AIModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export function AIModelSelector({ selectedModel, onModelChange }: AIModelSelectorProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>בחר מודל AI:</ThemedText>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(value) => onModelChange(value as AIModel)}
        style={styles.picker}
      >
        <Picker.Item label="OpenAI (GPT-4)" value="openai" />
        <Picker.Item label="Google Gemini" value="gemini" />
        <Picker.Item label="DeepSeek" value="deepseek" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
}); 