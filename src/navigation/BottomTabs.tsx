import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import SettingsScreen from '@/screens/Settings';
import TreasureRoomScreen from '@/screens/TreasureRoom';
import CrazyRunning from '@/games/CrazyRunning';
import EyeOfRaComponent from '@/games/EyeOfRa';
import ColorSwipeGameComponent from '@/games/ColorSwipeGameComponent';
import MemoryStarGameComponent from '@/games/MemoryStarGameComponent';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: 'none' },
        headerShown: false
      }}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="treasure" component={TreasureRoomScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
      <Tab.Screen name="crazyRunning" component={CrazyRunning} />
      <Tab.Screen name="eyeOfRa" component={EyeOfRaComponent} />
      <Tab.Screen name="colorSwipe" component={ColorSwipeGameComponent} />
      <Tab.Screen name="memoryPrickle" component={MemoryStarGameComponent} />
    </Tab.Navigator>
  );
}
