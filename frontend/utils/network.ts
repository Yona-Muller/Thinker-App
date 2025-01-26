import NetInfo from '@react-native-community/netinfo';

export const checkConnection = async () => {
  try {
    const netInfo = await NetInfo.fetch();
    console.log('Network status:', netInfo);
    
    if (!netInfo.isConnected) {
      return false;
    }

    const response = await fetch('http://192.168.1.21:4000/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // הוספת timeout
      signal: AbortSignal.timeout(5000)
    });

    return response.ok;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
}; 