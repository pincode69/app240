import React, {useEffect, useRef} from 'react';
import {
  Animated,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Colors } from '../constants/Colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  onFinish: () => void;
};

export default function LaunchScreen({ onFinish }: Props) {
  
  const onStart = async () => {
    await AsyncStorage.setItem('wasOnLaunch', 'true');
    onFinish();
  };

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const swing = Animated.sequence([
      Animated.timing(spinValue, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
    ]);

    Animated.loop(swing).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });


  return (
    <ImageBackground
      source={require('@assets/images/homeBg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <Animated.Image
            source={require('@assets/images/rotate-coin.png')}
            style={[styles.coin, { transform: [{ rotate: spin }] }]}
            resizeMode="contain"
          />
          <Text style={styles.title}>GoKids Game</Text>
          <Text style={styles.subtitle}>Incredible adventures in a magical world</Text>
          <TouchableOpacity onPress={onStart} style={styles.cta}>
            <Text style={styles.ctaText}>Play</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  coin: {
    width: '100%',
    height: 150
  },
  title: {
    color: 'white',
    fontSize: 38,
    lineHeight: 66,
    fontWeight: '800',
    fontFamily: 'Gloria Hallelujah',
  },
  subtitle: {
    color: '#FAD007',
    fontSize: 16,
    fontFamily: 'Roboto Regular'
  },
  cta: {
    bottom: 80,
    position: 'absolute',
    marginTop: 24,
    backgroundColor: Colors.accentYellow,
    paddingVertical: 12,
    borderRadius: 4,
    width: '100%'
  },
  ctaText: {
    fontWeight: '400',
    fontSize: 24,
    fontFamily: 'Roboto Regular',
    textAlign: 'center',
    color: '#165a1d',
  },
});





