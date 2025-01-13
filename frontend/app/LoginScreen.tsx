import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { registerUser, loginUser, loginWithGoogle } from './apiService';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "177341998424-mkisfnbh7iucmmbq0du7e1tejr0gioaa.apps.googleusercontent.com", // תחליף את זה עם ה-Client ID שלך
    webClientId: "177341998424-mkisfnbh7iucmmbq0du7e1tejr0gioaa.apps.googleusercontent.com", // תחליף את זה עם ה-Client ID שלך
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'הצלחה' : 'שגיאה',
      text2: text,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;
        console.log('Google auth successful:', authentication);
        
        // שליחת הטוקן לשרת
        const response = await loginWithGoogle(authentication.accessToken);
        
        if (response.token) {
          await AsyncStorage.setItem('authToken', response.token);
          showToast('success', 'התחברת בהצלחה!');
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      showToast('error', 'שגיאה בהתחברות עם Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (isLogin) {
        // התחברות
        if (!email || !password) {
          showToast('error', 'אנא מלא את כל השדות');
          return;
        }

        const response = await loginUser(email, password);
        console.log('Login successful:', response);
        
        if (response.token) {
          await AsyncStorage.setItem('authToken', response.token);
          showToast('success', 'התחברת בהצלחה!');
          router.replace('/(tabs)');
        }
      } else {
        // הרשמה
        if (!email || !password || !name) {
          showToast('error', 'אנא מלא את כל השדות');
          return;
        }

        console.log('Starting registration...');
        const response = await registerUser(email, name, password);
        console.log('Registration response:', response);
        
        await AsyncStorage.setItem('authToken', response.token || 'dummy-token');
        console.log('Token saved');
        
        showToast('success', 'נרשמת בהצלחה!');
        
        console.log('Attempting navigation...');
        router.push('/(tabs)');
        
        setEmail('');
        setPassword('');
        setName('');
      }

    } catch (error: any) {
      console.error('Error during submission:', error);
      showToast('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'התחברות' : 'הרשמה'}</Text>
      
      {/* טפסים רגילים */}
      <TextInput
        style={styles.input}
        placeholder="אימייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="שם"
          value={name}
          onChangeText={setName}
        />
      )}
      
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        style={[styles.button, isLoading && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'מתבצעת פעולה...' : (isLogin ? 'התחברות' : 'הרשמה')}
        </Text>
      </TouchableOpacity>

      {/* כפתור Google */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>או</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.googleButtonText}>
          התחבר עם Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        style={styles.switchButton}
      >
        <Text style={styles.switchText}>
          {isLogin ? 'אין לך חשבון? הירשם כאן' : 'יש לך חשבון? התחבר כאן'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  googleButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  switchText: {
    color: '#4CAF50',
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;