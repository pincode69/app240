import { Colors } from '@/constants/Colors';
import { imgsTreasure } from '@/data/treasure';
import { Treasure } from '@/data/type';
import React from 'react';
import {
  Image,
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default function TreasureInfoModal({
  treasure,
  visible,
  onClose
}: {
  treasure: Treasure,
  visible: boolean,
  onClose: () => void
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.imageCover}>
            <Image
              source={imgsTreasure[treasure.img]}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          

          <View style={styles.cardInfo}>
            <Text style={styles.title}>{treasure.title}</Text>
            <Text style={styles.desc}>{treasure.desc}</Text>
          </View>
          
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: Colors.accentYellow,
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#434343',
  },
  imageCover: {
    //iOS shadow (glow)
    shadowColor: '#c7bfdfff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,

    // Android
    elevation: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 16,
  },
  cardInfo: {
    backgroundColor: Colors.accentYellow,
    padding: 20,
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#165a1d',
  },
  desc: {
    fontSize: 16,
    textAlign: 'center',
    color: '#434343',
  }
});
