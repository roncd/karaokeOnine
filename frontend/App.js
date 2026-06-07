import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native'; 
import AppNavigator from './src/navigation/AppNavigator';

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