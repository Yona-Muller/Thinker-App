import { Platform } from "react-native";

export const API_URL = Platform.select({
    android: 'http://192.168.167.208:4000',
    ios: 'http://192.168.222.208:4000',
    web: 'http://localhost:4000',
    default: 'http://10.0.2.2:4000'
});

export const API_URL_P = Platform.select({
    android: 'http://192.168.167.208:5000',
    ios: 'http://192.168.222.208:5000',
    web: 'http://localhost:5000',
    default: 'http://10.0.2.2:5000'
});