import BottomFloatingMenu from '@/components/BottomFloatingMenu';
import { useFocusEffect } from '@react-navigation/native';
import CoinDisplay from '@/components/CoinDisplay';
import TreasureInfoModal from '@/components/TreasureInfoModal';
import { imgsTreasure, treasures } from '@/data/treasure';
import { Treasure } from '@/data/type';
import React, { useState, useCallback } from 'react';
import {
  ImageBackground,
  FlatList,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTreasures } from '@/hooks/useTreasures';
import { useCoins } from '@/hooks/useCoins';

export default function TreasureRoomScreen() {
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const { isTreasurePurchased, purchaseTreasure, refreshTreasures } = useTreasures();
  const { coins, refreshCoins } = useCoins();

  useFocusEffect(
    useCallback(() => {
      refreshCoins();
      refreshTreasures();
    }, [])
  );

  const handleTreasurePress = (treasure: Treasure) => {
    if (isTreasurePurchased(treasure.id)) {
      setSelectedTreasure(treasure);
    }
  };

  const handlePurchase = async (treasure: Treasure) => {
    const success = await purchaseTreasure(treasure.id, treasure.price);
    if (success) {
      await refreshCoins();
      await refreshTreasures();
      setSelectedTreasure(treasure);
    }
  };

  const closeModal = () => {
    setSelectedTreasure(null);
  };

  return (
    <ImageBackground
      source={require('@assets/images/homeBg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <Text style={styles.title}>Treasure Room</Text>
          <CoinDisplay style={styles.coinContainer} />
          <FlatList
            data={treasures}
            extraData={coins}
            keyExtractor={(level) => level.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isPurchased = isTreasurePurchased(item.id);
              const canAfford = !isPurchased && coins >= item.price;
              
              return (
                <View style={styles.card}>
                  <TouchableOpacity
                    style={styles.itemBtn}
                    onPress={() => handleTreasurePress(item)}
                  >
                    {isPurchased ? (
                      <Image source={imgsTreasure[item.img]} style={styles.itemImg} resizeMode='contain'/>
                    ) : (
                      <View style={styles.lockedContainer}>
                        <View style={styles.questionMarkContainer}>
                          <Text style={styles.questionMark}>?</Text>
                        </View>
                        <View style={styles.priceContainer}>
                          <Image source={require('@assets/images/trip/coin.png')} style={styles.coinIcon} resizeMode='contain' />
                          <Text style={[styles.priceText, !canAfford && styles.priceTextDisabled]}>
                            {item.price}
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  {!isPurchased && (
                    <TouchableOpacity
                      style={[
                        styles.buyButton,
                        !canAfford && styles.buyButtonDisabled
                      ]}
                      onPress={() => handlePurchase(item)}
                      disabled={!canAfford}
                    >
                      <Text style={[
                        styles.buyButtonText,
                        !canAfford && styles.buyButtonTextDisabled
                      ]}>
                        Buy
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </SafeAreaView>
        <BottomFloatingMenu />
        
        {selectedTreasure && (
          <TreasureInfoModal
            treasure={selectedTreasure}
            visible={!!selectedTreasure}
            onClose={closeModal}
          />
        )}
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
    paddingHorizontal: 20,
    marginBottom: 80
  },

  title: {
    fontSize: 32,
    lineHeight: 46,
    fontWeight: '900',
    marginTop: 20,
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
  },

  coinContainer: {
    marginBottom: 20,
    marginRight: 20,
    alignSelf: 'flex-end'
  },

  card: {
    width: '48%',
    backgroundColor: 'transparent',
    position: 'relative'
  },
  itemBtn: {
    padding: 8,
    backgroundColor: 'rgba(250, 208, 7, 0.5)',
    borderRadius: 16,
    height: 200,
    width: '100%',
  },
  itemImg: {
    width: '100%',
    height: '100%'
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    borderRadius: 12,
  },
  questionMarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(128, 128, 128, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionMark: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: 'Gloria Hallelujah',
  },
  priceTextDisabled: {
  },
  buyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#888',
  },
  buyButtonText: {
    color: '#165a1d',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Gloria Hallelujah',
  },
  buyButtonTextDisabled: {
    color: '#ccc',
  }
});
