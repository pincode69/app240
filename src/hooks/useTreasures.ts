import { useState, useEffect } from 'react';
import { TreasureManager } from '@/utils/treasureManager';
import { CoinManager } from '@/utils/coinManager';

export const useTreasures = () => {
  const [purchasedTreasures, setPurchasedTreasures] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPurchasedTreasures();
  }, []);

  const loadPurchasedTreasures = async () => {
    try {
      setLoading(true);
      const purchased = await TreasureManager.getPurchasedTreasures();
      setPurchasedTreasures(purchased);
    } catch (error) {
      console.error('Error loading purchased treasures:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseTreasure = async (treasureId: number, price: number) => {
    try {
      const currentCoins = await CoinManager.getCoins();
      
      if (currentCoins >= price) {
        // Віднімаємо монети
        await CoinManager.setCoins(currentCoins - price);
        
        // Додаємо скарб до куплених
        await TreasureManager.purchaseTreasure(treasureId);
        
        // Оновлюємо локальний стан
        setPurchasedTreasures(prev => [...prev, treasureId]);
        
        return true; // Успішна покупка
      }
      
      return false; // Недостатньо монет
    } catch (error) {
      console.error('Error purchasing treasure:', error);
      return false;
    }
  };

  const isTreasurePurchased = (treasureId: number): boolean => {
    return purchasedTreasures.includes(treasureId);
  };

  const refreshTreasures = async () => {
    try {
      const purchased = await TreasureManager.getPurchasedTreasures();
      setPurchasedTreasures(purchased);
    } catch (error) {
      console.error('Error refreshing treasures:', error);
    }
  };

  return {
    purchasedTreasures,
    loading,
    purchaseTreasure,
    isTreasurePurchased,
    refreshTreasures,
  };
};
