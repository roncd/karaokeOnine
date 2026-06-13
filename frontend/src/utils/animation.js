import { Platform } from 'react-native';

// RCTAnimation n'existe pas sur web — évite le warning console.
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';
