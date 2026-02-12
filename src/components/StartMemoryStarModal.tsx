import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function StartMemoryStarModal({
  visible,
  onStart,
  onClose
}: {
  visible: boolean;
  onStart: () => void;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.gameContainer}>
            <Text style={styles.title}>Test your memory under the desert sun!</Text>
            <Text style={styles.desc}>
              Cacti will glow in a secret order. Watch carefully and repeat the exact same pattern. 
              Each round gets harder — one mistake, and the desert claims your score!
            </Text>
            <Image source={require('@assets/images/content/prickle.png')} />
          </View>

          <View style={styles.btns}>
            <TouchableOpacity style={styles.startButton} onPress={onStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 40,
  },
  closeButton: {
    backgroundColor: Colors.accentYellow,
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#434343',
  },
  gameContainer: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e9d98eff',
    lineHeight: 22,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  startButtonText: {
    color: '#165a1d',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
