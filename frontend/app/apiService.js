import axios from 'axios';
// import Constants from 'expo-constants';

const API_BASE_URL =  __DEV__ 
? 'http://192.168.100.208:4000'
: 'https://your-production-url.com'; 

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
    console.log('Attempting to login user:', email);
    const response = await apiClient.post("/users/login", { email, password });
    console.log('Login successful');
    return response.data;
  } catch (error) {
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
