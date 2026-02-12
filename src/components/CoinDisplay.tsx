import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useCoins } from '@/hooks/useCoins';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface CoinDisplayProps {
  style?: any;
}

export default function CoinDisplay({ style }: CoinDisplayProps) {
  const { coins, loading, refreshCoins } = useCoins();

  useFocusEffect(
    useCallback(() => {
      refreshCoins();
    }, [refreshCoins])
  );

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('@assets/images/trip/coin.png')} 
        style={styles.coinImage}
        resizeMode="contain"
      />
      <Text style={styles.coinText}>
        {loading ? '...' : coins}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  coinImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  coinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Gloria Hallelujah',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
