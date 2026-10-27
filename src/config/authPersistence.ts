import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_KEY = 'auth_remember_session';
const memory = new Map<string, string>();

export async function setRememberSession(remember: boolean): Promise<void> {
  await AsyncStorage.setItem(REMEMBER_KEY, String(remember));
}

export const authStorage = {
  async getItem(key: string): Promise<string | null> {
    if (await AsyncStorage.getItem(REMEMBER_KEY) === 'false') return memory.get(key) ?? null;
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    memory.set(key, value);
    if (await AsyncStorage.getItem(REMEMBER_KEY) === 'false') {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    memory.delete(key);
    await AsyncStorage.removeItem(key);
  },
};
