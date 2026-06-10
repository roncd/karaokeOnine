import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'karaoke_session';

export const saveSession = async (data) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

export const getSession = async () => {
  const session = await AsyncStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};