import { useState, useEffect } from 'react';
import { SettingsManager, AppSettings } from '@/utils/settingsManager';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    musicEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const currentSettings = await SettingsManager.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    try {
      await SettingsManager.updateSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const toggleMusic = async () => {
    await updateSetting('musicEnabled', !settings.musicEnabled);
  };

  const toggleSound = async () => {
    await updateSetting('soundEnabled', !settings.soundEnabled);
  };

  const toggleVibration = async () => {
    await updateSetting('vibrationEnabled', !settings.vibrationEnabled);
  };

  const resetSettings = async () => {
    try {
      await SettingsManager.resetSettings();
      await loadSettings();
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return {
    settings,
    loading,
    toggleMusic,
    toggleSound,
    toggleVibration,
    resetSettings,
    refreshSettings: loadSettings,
  };
};
