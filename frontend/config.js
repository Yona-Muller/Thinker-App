import { Platform } from "react-native";

export const API_URL = Platform.select({
    android: 'http://192.168.1.21:4000',
    ios: 'http://localhost:4000',
    web: 'http://localhost:4000',
    default: 'http://10.0.2.2:4000'
});

export const API_URL_P = Platform.select({
    android: 'http://192.168.1.21:5000',
    ios: 'http://localhost:5000',
    web: 'http://localhost:5000',
    default: 'http://10.0.2.2:5000'
});