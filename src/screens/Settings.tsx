import BottomFloatingMenu from '@/components/BottomFloatingMenu';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/useSettings';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const { settings, toggleMusic, toggleSound, toggleVibration } = useSettings();

  const handleBuyCoins = () => {
    Alert.alert(
      'Buy Coins',
      'This feature will be available soon! Earn coins by playing games.',
      [{ text: 'OK' }]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'Need help? Contact us at support@gokidsgame.com',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email Support', 
          onPress: () => Linking.openURL('mailto:support@gokidsgame.com')
        }
      ]
    );
  };

  return (
    <ImageBackground
      source={require('@assets/images/homeBg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <Text style={styles.title}>Settings</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <View style={styles.settingsContainer}>
              
              {/* Music Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Music</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, settings.musicEnabled && styles.toggleButtonActive]}
                  onPress={toggleMusic}
                >
                  <Text style={[styles.toggleText, settings.musicEnabled && styles.toggleTextActive]}>
                    {settings.musicEnabled ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sound Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, settings.soundEnabled && styles.toggleButtonActive]}
                  onPress={toggleSound}
                >
                  <Text style={[styles.toggleText, settings.soundEnabled && styles.toggleTextActive]}>
                    {settings.soundEnabled ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Vibration Toggle */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Vibration</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, settings.vibrationEnabled && styles.toggleButtonActive]}
                  onPress={toggleVibration}
                >
                  <Text style={[styles.toggleText, settings.vibrationEnabled && styles.toggleTextActive]}>
                    {settings.vibrationEnabled ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Buy Coins Button */}
              <TouchableOpacity style={styles.actionButton} onPress={handleBuyCoins}>
                <Text style={styles.actionButtonText}>Buy Coins</Text>
              </TouchableOpacity>

              {/* Support Button */}
              <TouchableOpacity style={styles.actionButton} onPress={handleSupport}>
                <Text style={styles.actionButtonText}>Support</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>

          <BottomFloatingMenu />
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  safeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 46,
    fontWeight: '900',
    marginVertical: 20,
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  settingsContainer: {
    paddingVertical: 20,
    gap: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
  },
  toggleButton: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.8)',
    minWidth: 60,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.accentYellow,
    borderColor: '#FFD700',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Gloria Hallelujah',
  },
  toggleTextActive: {
    color: '#165a1d',
  },
  actionButton: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#165a1d',
    fontFamily: 'Gloria Hallelujah',
  },
});
