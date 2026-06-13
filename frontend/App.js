import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const fontId = 'karaoke-google-fonts';
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Inter:wght@400;700;800&display=swap';
    document.head.appendChild(link);
  }
}

export default function App() {
  if (Platform.OS === 'web'){
    return <AppNavigator />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}