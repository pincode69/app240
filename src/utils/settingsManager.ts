import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app_settings';

export interface AppSettings {
  musicEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const defaultSettings: AppSettings = {
  musicEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const SettingsManager = {
  // Отримати налаштування
  async getSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      return settings ? JSON.parse(settings) : defaultSettings;
    } catch (error) {
      console.error('Error getting settings:', error);
      return defaultSettings;
    }
  },

  // Зберегти налаштування
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Оновити конкретне налаштування
  async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, [key]: value };
      await this.saveSettings(newSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  },

  // Скинути налаштування до дефолтних
  async resetSettings(): Promise<void> {
    try {
      await this.saveSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }
};
