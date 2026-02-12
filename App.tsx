
import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import LaunchScreen from './src/screens/LaunchScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ANDROID_PINUP_MANAGER } from './ANDROID_PINUP_MANAGER';
import BootSplash from "react-native-bootsplash";

function App() {
  const [showLaunch, setShowLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      const wasOnLaunch = await AsyncStorage.getItem('wasOnLaunch');
      setShowLaunch(wasOnLaunch !== 'true');
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  if (showLaunch === null) return null;

  if (showLaunch) {
    return <LaunchScreen onFinish={() => setShowLaunch(false)} />;
  }

  return (
      <AppNavigator />

    // <ANDROID_PINUP_MANAGER />
  );
}

export default App;
