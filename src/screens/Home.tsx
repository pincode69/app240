import BottomFloatingMenu from '@/components/BottomFloatingMenu';
import CoinDisplay from '@/components/CoinDisplay';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleCrazyRunningPress = () => {
    navigation.navigate('crazyRunning' as never);
  };

  const handleEyeOfRaPress = () => {
    navigation.navigate('eyeOfRa' as never);
  };

  const goToGame = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <ImageBackground
      source={require('@assets/images/homeBg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <Text style={styles.title}>Expeditions</Text>
          <CoinDisplay style={styles.coinContainer} />
          <ImageBackground
            source={require('@assets/images/content/list-bg.png')}
            style={styles.bgList}
            resizeMode="stretch"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={styles.listWrap}
            > 
              <TouchableOpacity
                style={styles.item}
                onPress={handleCrazyRunningPress}
              >
                <Text style={[styles.label, {color: 'red'}]}>hard</Text>
                <Text style={styles.itemText}>Crazy Running</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={handleEyeOfRaPress}
              >
                <Text style={styles.itemText}>Eye Of Ra</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => goToGame('colorSwipe')}
              >
                <Text style={[styles.label, {color: 'green'}]}>easy</Text>
                <Text style={styles.itemText}>Gem Collector</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => goToGame('memoryPrickle')}
              >
                <Text style={styles.itemText}>Desert Memory Trial</Text>
              </TouchableOpacity>
              
            </ScrollView>
          </ImageBackground>
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
    marginTop: 20,
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
  },

  coinContainer: {
    marginBottom: 10,
    marginRight: 20,
    alignSelf: 'flex-end'
  },

  bgList: {
    width: '100%',
    height: 480,
    alignItems: 'center'
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 32,
    marginTop: 40
  },
  listWrap: {
    width: '100%',
  },
  item: {
    maxWidth: 200,
    borderRadius: 15,
    position: 'relative'
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Gloria Hallelujah',
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(0, 0, 0, 1)',
    textDecorationStyle: 'solid'
  },
  label: {
    position: 'absolute',
    top: -10,
    right: -20,
    // color: 'red',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Gloria Hallelujah',
    transform: [{ rotate: '10deg' }],
  }
});
