import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


type MenuItem = 'treasure' | 'home' | 'settings';
type RootStackParamList = {
  home: undefined;
  treasure: undefined;
  settings: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const icons: Record<number, any> = {
  1: require('@assets/images/menu/home.png'),
  2: require('@assets/images/menu/bonuses.png'),
  3: require('@assets/images/menu/settings.png'),
}

export default function BottomFloatingMenu() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const isActive = (item: MenuItem) => route.name === item;

  const handlePress = (item: MenuItem) => {
    navigation.navigate(item);
  };

  return (
    <View style={styles.container}>
      <Image source={require('@assets/images/menu/line.png')} style={styles.line}/>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => handlePress('treasure')} style={[styles.menuItem, isActive('treasure') && styles.menuItemActive]}>
          <Image source={icons[2]} resizeMode='contain' style={styles.imgItem} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('home')} style={[styles.menuItem, isActive('home') && styles.menuItemActive]}>
          <Image source={icons[1]} resizeMode='contain' style={styles.imgItem} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('settings')} style={[styles.menuItem, isActive('settings') && styles.menuItemActive]}>
          <Image source={icons[3]} resizeMode='contain' style={styles.imgItem} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
  menu: {
    flexDirection: 'row',
    gap: 28,
    height: 60,
  },
  menuItem: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },

  menuItemActive: {
    // iOS
    shadowColor: '#c7bfdfff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,

    // Android
    elevation: 20,
  },
  imgItem: {
    width: 60,
    height: 60
  },
  line: {
    width: '100%',
  }
});
