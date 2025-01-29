import React from 'react';
import { Platform } from 'react-native';
import { IdeaSelectionScreen } from '@/components/IdeaSelection';
import { router, useGlobalSearchParams } from 'expo-router';
import { API_URL_P } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';



export default function IdeaSelectionPage() {
  // השימוש ב-useGlobalSearchParams במקום props.route.params
  const { ideas: ideasParam, notecardId } = useGlobalSearchParams();
  
  const parsedIdeas = ideasParam ? JSON.parse(decodeURIComponent(ideasParam as string)) : [];

  const handleConfirmSelection = async (selectedIdeas) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL_P}/note_card/${notecardId}/ideas`, {
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

      Toast.show({
        type: 'success',
        text1: 'הרעיונות נשמרו בהצלחה'
      });

      // נחזור למסך הקודם
      router.back();

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'שגיאה',
        text2: error.message || 'אירעה שגיאה בשמירת הרעיונות'
      });
    }
  };

  return (
    <IdeaSelectionScreen 
      ideas={parsedIdeas}
      onConfirmSelection={handleConfirmSelection}
    />
  );
}