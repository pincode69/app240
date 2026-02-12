import AsyncStorage from '@react-native-async-storage/async-storage';

const PURCHASED_TREASURES_KEY = 'purchased_treasures';

export const TreasureManager = {
  // Отримати список куплених скарбів
  async getPurchasedTreasures(): Promise<number[]> {
    try {
      const purchased = await AsyncStorage.getItem(PURCHASED_TREASURES_KEY);
      return purchased ? JSON.parse(purchased) : [];
    } catch (error) {
      console.error('Error getting purchased treasures:', error);
      return [];
    }
  },

  // Додати скарб до списку куплених
  async purchaseTreasure(treasureId: number): Promise<void> {
    try {
      const purchased = await this.getPurchasedTreasures();
      if (!purchased.includes(treasureId)) {
        purchased.push(treasureId);
        await AsyncStorage.setItem(PURCHASED_TREASURES_KEY, JSON.stringify(purchased));
      }
    } catch (error) {
      console.error('Error purchasing treasure:', error);
    }
  },

  // Перевірити, чи куплений скарб
  async isTreasurePurchased(treasureId: number): Promise<boolean> {
    try {
      const purchased = await this.getPurchasedTreasures();
      return purchased.includes(treasureId);
    } catch (error) {
      console.error('Error checking if treasure is purchased:', error);
      return false;
    }
  },

  // Скинути всі куплені скарби (для тестування)
  async resetPurchasedTreasures(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PURCHASED_TREASURES_KEY);
    } catch (error) {
      console.error('Error resetting purchased treasures:', error);
    }
  }
};
