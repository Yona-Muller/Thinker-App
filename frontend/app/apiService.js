import axios from 'axios';
// import Constants from 'expo-constants';

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.165.208:4000'
  : 'http://10.0.2.2:4000';  // אם אתה משתמש באמולטור אנדרואיד
  // או
  // ? 'http://localhost:4000'
  // : 'https://your-production-url.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const registerUser = async (email, name, password) => {
  try {
    console.log('Sending registration data:', { email, name });
    const response = await apiClient.post("/users/register", { email, name, password });
    console.log('Full server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    if (error.message === 'Network Error') {
      throw new Error('בעיית חיבור לשרת. בדוק את החיבור לאינטרנט');
    }
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Login request details:', {
      email,
      url: `${API_BASE_URL}/auth/login`,
    });
    
    const response = await apiClient.post("/auth/login", { email, password });
    console.log('Login response:', response.data);

    if (response.data.access_token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      return response.data;  // מחזירים את התשובה המקורית
    }
    throw new Error('לא התקבל טוקן');
  } catch (error) {
    console.error('Login error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestedEmail: email,
      fullUrl: `${API_BASE_URL}/users/login`
    });
    
    if (error.response?.status === 404) {
      throw new Error('משתמש לא קיים');
    } else if (error.response?.status === 401) {
      throw new Error('סיסמה שגויה');
    } else if (error.message === 'Network Error') {
      throw new Error('בעיית חיבור לשרת. בדוק את החיבור לאינטרנט');
    }
    throw new Error('שגיאה בהתחברות');
  }
};

export const summarizeContent = async (content) => {
  try {
    const response = await apiClient.post("/ai/summarize", { content });
    return response.data;
  } catch (error) {
    console.error("Error summarizing content:", error);
    throw error;
  }
};

export const loginWithGoogle = async (accessToken) => {
  try {
    const response = await apiClient.post("/users/google-auth", { accessToken });
    return response.data;
  } catch (error) {
    console.error('Google auth error:', error);
    throw new Error('שגיאה בהתחברות עם Google');
  }
};


export const setupAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error setting up auth token:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Error during logout:', error);
  }
};