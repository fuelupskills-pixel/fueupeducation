import { Platform } from 'react-native';

// In Android Emulators, localhost refers to the emulator loopback, 
// so we route to 10.0.2.2 to reach the developer host machine backend.
// In iOS simulators, we can query localhost directly.
const DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEV_URL;
