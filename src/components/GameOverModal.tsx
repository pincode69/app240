import { Colors } from '@/constants/Colors';
import React from 'react';
import {
  Image,
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default function GameOverModalModal({
  score,
  visible,
  restartGame,
  onClose
}: {
  score: number,
  visible: boolean,
  restartGame: () => void,
  onClose: () => void
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.gameOverContainer}>
            <View>
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Text style={styles.desc}>Each run earns you more coins!</Text>
            </View>
            
            <View style={styles.imageCover}>
              <Image 
                source={require('@assets/images/trip/coin.png')}
                style={styles.coinImage}
                resizeMode="contain"
              />
              <Text style={styles.finalScoreText}> x {score}</Text>
            </View>
            
            <View style={styles.btns}>
              <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                <Text style={styles.restartButtonText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishButton} onPress={onClose}>
                <Text style={styles.finishButtonText}>Finish</Text>
              </TouchableOpacity>
            </View>
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
    gap: 40
  },
  closeButton: {
    zIndex: 1,
    backgroundColor: Colors.accentYellow,
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  closeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#434343',
  },
  imageCover: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    //iOS shadow (glow)
    shadowColor: '#c7bfdfff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,

    // Android
    elevation: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  coinImage: {
    width: 40,
    height: 40
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
    color: '#e9d98eff',
  },

  btns: {
    flexDirection: 'row',
    gap: 8
  },
  gameOverContainer: {
    alignItems: 'center',
    zIndex: 20,
    gap: 20
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
    textAlign: 'center'
  },
  finalScoreText: {
    fontSize: 20,
    color: 'white',
  },
  restartButton: {
    backgroundColor: '#165a1d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  finishButton: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  finishButtonText: {
    color: '#165a1d',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
