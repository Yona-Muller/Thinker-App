import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notecard {
  id: number;
  title: string;
  sourceUrl: string;
  sourceType: string;
  thumbnailUrl: string;
  channelName: string;
  channelAvatar: string;
  keyTakeaways: string[];
  thoughts: string[];
  createdAt: string;
}

interface NotecardContextType {
  notecards: Notecard[];
  setNotecards: (notecards: Notecard[]) => void;
  refreshNotecards: () => Promise<void>;
}

const NotecardContext = createContext<NotecardContextType | undefined>(undefined);

const API_URL = 'http://192.168.1.21:4000'; // עדכן ל-IP הנכון

export function NotecardProvider({ children }) {
  const [notecards, setNotecards] = useState<Notecard[]>([]);

  const refreshNotecards = async () => {
    try {
      console.log('Refreshing notecards...');
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      console.log('Fetching notecards with token:', token);
      const response = await fetch(`${API_URL}/notecards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch notecards:', response.status, errorText);
        return;
      }

      const data = await response.json();
      console.log('Fetched notecards:', data);
      
      if (Array.isArray(data)) {
        setNotecards(data);
        console.log('Updated notecards state with', data.length, 'cards');
      } else {
        console.error('Received invalid data format:', data);
      }
    } catch (error) {
      console.error('Error refreshing notecards:', error);
    }
  };

  const value = {
    notecards,
    setNotecards,
    refreshNotecards
  };

  return (
    <NotecardContext.Provider value={value}>
      {children}
    </NotecardContext.Provider>
  );
}

export function useNotecards() {
  const context = useContext(NotecardContext);
  if (context === undefined) {
    throw new Error('useNotecards must be used within a NotecardProvider');
  }
  return context;
} 