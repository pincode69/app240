import AsyncStorage from '@react-native-async-storage/async-storage';

const COINS_KEY = 'user_coins';

export const CoinManager = {
  // Отримати кількість монет
  async getCoins(): Promise<number> {
    try {
      const coins = await AsyncStorage.getItem(COINS_KEY);
      return coins ? parseInt(coins, 10) : 0;
    } catch (error) {
      console.error('Error getting coins:', error);
      return 0;
    }
  },

  // Додати монети
  async addCoins(amount: number): Promise<number> {
    try {
      const currentCoins = await this.getCoins();
      const newAmount = currentCoins + amount;
      await AsyncStorage.setItem(COINS_KEY, newAmount.toString());
      return newAmount;
    } catch (error) {
      console.error('Error adding coins:', error);
      return await this.getCoins();
    }
  },

  // Встановити кількість монет
  async setCoins(amount: number): Promise<void> {
    try {
      await AsyncStorage.setItem(COINS_KEY, amount.toString());
    } catch (error) {
      console.error('Error setting coins:', error);
    }
  },

  // Скинути монети (для тестування)
  async resetCoins(): Promise<void> {
    try {
      await AsyncStorage.removeItem(COINS_KEY);
    } catch (error) {
      console.error('Error resetting coins:', error);
    }
  }
};
