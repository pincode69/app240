import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function PauseModal({
  visible,
  isGameOver,
  score,
  onResume,
  onRestart,
  onClose
}: {
  visible: boolean;
  isGameOver: boolean;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onClose: () => void;
}) {
  if (!visible) return null;

  const displayScore = (15 - score) <= 0 ? 0 : (15 - score).toFixed(0);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.gameContainer}>
            <Text style={styles.title}>
              {isGameOver ? 'Expedition Complete!' : 'Expedition Paused'}
            </Text>

            {isGameOver && (
              <View style={styles.imageCover}>
                <Image 
                  source={require('@assets/images/trip/coin.png')}
                  style={styles.coinImage}
                  resizeMode="contain"
                />
                <Text style={styles.finalScoreText}> x {displayScore}</Text>
              </View>
            )}

            <Text style={styles.desc}>
              {isGameOver
                ? 'You’ve completed the mission. Ready to begin again?'
                : 'The desert awaits your return. Continue to uncover sacred stones and earn rewards!'}
            </Text>
          </View>

          <View style={styles.btns}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={isGameOver ? onRestart : onResume}
            >
              <Text style={styles.startButtonText}>
                {isGameOver ? 'Restart' : 'Continue'}
              </Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e9d98eff',
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
  imageCover: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#c7bfdfff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  coinImage: {
    width: 40,
    height: 40,
  },
  finalScoreText: {
    fontSize: 20,
    color: 'white',
  },
});
