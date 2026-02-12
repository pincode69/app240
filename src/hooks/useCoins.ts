import { useState, useEffect } from 'react';
import { CoinManager } from '@/utils/coinManager';

export const useCoins = () => {
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCoins();
  }, []);

  const loadCoins = async () => {
    try {
      setLoading(true);
      const currentCoins = await CoinManager.getCoins();
      setCoins(currentCoins);
    } catch (error) {
      console.error('Error loading coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCoins = async (amount: number) => {
    try {
      const newAmount = await CoinManager.addCoins(amount);
      setCoins(newAmount);
      return newAmount;
    } catch (error) {
      console.error('Error adding coins:', error);
      return coins;
    }
  };

  const setCoinsAmount = async (amount: number) => {
    try {
      await CoinManager.setCoins(amount);
      setCoins(amount);
    } catch (error) {
      console.error('Error setting coins:', error);
    }
  };

  const resetCoins = async () => {
    try {
      await CoinManager.resetCoins();
      setCoins(0);
    } catch (error) {
      console.error('Error resetting coins:', error);
    }
  };

  const refreshCoins = async () => {
    try {
      const currentCoins = await CoinManager.getCoins();
      setCoins(currentCoins);
    } catch (error) {
      console.error('Error refreshing coins:', error);
    }
  };

  return {
    coins,
    loading,
    addCoins,
    setCoinsAmount,
    resetCoins,
    refreshCoins,
  };
};
