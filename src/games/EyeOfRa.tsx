import { Colors } from '@/constants/Colors';
import React, { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StartModal from '@/components/StartModal';
import PauseModal from '@/components/PauseModal';
import { useCoins } from '@/hooks/useCoins';

const GRID_SIZE = 16;
const ROUNDS_TOTAL = 10;
const PENALTY_MS = 30;

export default function EyeOfRaComponent() {
  const [currentRound, setCurrentRound] = useState(0);
  const [activeCellIndex, setActiveCellIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [penaltyTime, setPenaltyTime] = useState<number>(0);
  const [latestScore, setLatestScore] = useState<number>(0);
  const [failFlash, setFailFlash] = useState(false);

  const [isStartModalVisible, setStartModalVisible] = useState(true);
  const [isGameStarted, setGameStarted] = useState(false);
  
  const [isGameOver, setGameOver] = useState(false);
  const [isPaused, setPaused] = useState(false);

  const navigation = useNavigation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addCoins } = useCoins();

  useFocusEffect(
    React.useCallback(() => {
      if (!isGameOver) {
        setStartModalVisible(true);
        setGameStarted(false);
      }

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [navigation])
  );

  const startRound = () => {
    if (currentRound >= ROUNDS_TOTAL) {
      const finalTime = totalTime + penaltyTime;
      setLatestScore(finalTime / 1000);
      setActiveCellIndex(null);
      
      // Додаємо бонусні монети за завершення гри
      const bonusCoins = Math.floor(currentRound / 2); // 1 монета за кожні 2 раунди
      if (bonusCoins > 0) {
        addCoins(bonusCoins);
      }
      
      setGameOver(true);
      setStartModalVisible(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * GRID_SIZE);
    setActiveCellIndex(randomIndex);
    setStartTime(Date.now());
    setCurrentRound((prev) => prev + 1);
  };

  const handlePress = (index: number) => {
    if (activeCellIndex === null || index !== activeCellIndex) {
      setPenaltyTime((prev) => prev + PENALTY_MS);
      setFailFlash(true);
      setTimeout(() => setFailFlash(false), 150);
      return;
    }

    const reactionTime = Date.now() - startTime;
    setTotalTime((prev) => prev + reactionTime);
    setActiveCellIndex(null);

    // Додаємо монети за правильне натискання
    addCoins(1);

    timerRef.current = setTimeout(() => {
      startRound();
    }, 300);
  };

  const startGame = () => {
    setCurrentRound(0);
    setActiveCellIndex(null);
    setStartTime(0);
    setTotalTime(0);
    setPenaltyTime(0);
    setLatestScore(0);
    setGameOver(false);
    setStartModalVisible(false);
    setPaused(false);
    setGameStarted(true);
    startRound();
  };

  const pauseGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPaused(true);
    setStartModalVisible(true);
  };

  const resumeGame = () => {
    setStartModalVisible(false);
    setPaused(false);
    setGameStarted(true);

    if (activeCellIndex === null) {
      startRound();
    }
  };

  const restartGame = () => {
    resetGameState();
    startRound();
  };

  const resetGameState = () => {
    setCurrentRound(0);
    setActiveCellIndex(null);
    setStartTime(0);
    setTotalTime(0);
    setPenaltyTime(0);
    setLatestScore(0);
    
    setGameOver(false);
    setPaused(false);
    setStartModalVisible(false);
    setGameStarted(true);
  };

  const handleGoHome = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStartModalVisible(false);
    navigation.navigate('home' as never);
  };

  return (
    <ImageBackground
      source={require('@assets/images/homeBg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleGoHome}>
            <Text style={styles.closeText}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Gems: {currentRound}</Text>
          </View>

          <View style={styles.gameArea}>
            <Image
              source={require('@assets/images/eyeOfRa/desert.png')}
              style={styles.backgroundDesert}
              resizeMode="cover"
            />
            <View style={styles.grid}>
              {Array.from({ length: GRID_SIZE }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cell,
                    activeCellIndex === index ? styles.activeCell : null,
                  ]}
                  onPress={() => handlePress(index)}
                  disabled={failFlash}
                >
                  {activeCellIndex === index && (
                    <Image
                      source={require('@assets/images/eyeOfRa/gem.png')}
                      style={styles.obstacleImage}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.btnWrap}>
            {!isGameOver && (
              <TouchableOpacity style={styles.btn} onPress={pauseGame}>
                <Text style={styles.btnText}>Pause</Text>
              </TouchableOpacity>
            )}
          </View>

          <StartModal
            visible={!isGameStarted && !isGameOver && isStartModalVisible}
            onStart={startGame}
            onClose={handleGoHome}
          />

          <PauseModal
            visible={(isPaused || isGameOver) && isStartModalVisible}
            isGameOver={isGameOver}
            score={latestScore}
            onResume={resumeGame}
            onRestart={restartGame}
            onClose={handleGoHome}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentYellow,
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20
  },
  closeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#434343',
  },
  
  scoreContainer: {
    alignSelf: 'flex-end',
    marginRight: 20
  },
  scoreText: {
    fontSize: 36,
    lineHeight: 50,
    fontWeight: '900',
    color: 'white',
    fontFamily: 'Gloria Hallelujah',
  },

  gameArea: {
    backgroundColor: '#FAD007',
    marginTop: 24,
    marginBottom: 20,
		borderRadius: 8,
		minHeight: 400,
		height: 400,
		overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundDesert: {
    position: 'absolute',
    width: '100%',
  },

  obstacleImage: {
    width: 50,
    height: 50
  },

	btnWrap: {
		backgroundColor: 'transparent',
	},
	btn: {
		backgroundColor: Colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
	},
	btnText: {
		color: '#165a1d',
    fontSize: 18,
    fontWeight: 'bold',
	},

  grid: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  cell: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCell: {
  },
  shape: {
    width: 64,
    height: 64,
    padding: 12,
    backgroundColor: '#fff',
		borderRadius: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 5, 
  }
})
