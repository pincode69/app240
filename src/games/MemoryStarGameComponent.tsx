import React, { useState, useCallback, useRef } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StartMemoryStarModal from '@/components/StartMemoryStarModal';
import PauseModal from '@/components/PauseModal';
import { Colors } from '@/constants/Colors';
import { useCoins } from '@/hooks/useCoins';

const TOTAL_LEVELS = 5;

export default function MemoryStarGameComponent() {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [activeStar, setActiveStar] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showStartModal, setShowStartModal] = useState(true);

    const navigation = useNavigation();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { addCoins } = useCoins();

    useFocusEffect(
        useCallback(() => {
            setShowStartModal(true);
            setGameStarted(false);
            return () => clearInterval(intervalRef.current!);
        }, [])
    );

    const generateSequence = useCallback((length: number) => {
        return Array.from({ length }, () => Math.floor(Math.random() * 9));
    }, []);

    const showSequence = useCallback((seq: number[]) => {
        setIsShowingSequence(true);
        let i = 0;
        intervalRef.current = setInterval(() => {
            setActiveStar(seq[i]);
            i++;
            if (i >= seq.length) {
                clearInterval(intervalRef.current!);
                setTimeout(() => {
                    setActiveStar(null);
                    setIsShowingSequence(false);
                }, 400);
            }
        }, 700);
    }, []);

  const startGame = () => {
    clearInterval(intervalRef.current!); // FIX
    const newSeq = generateSequence(currentLevel + 2);
    setSequence(newSeq);
    setPlayerSequence([]);
    setIsGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setShowStartModal(false);
    showSequence(newSeq);
  };

  const pauseGame = () => {
    setIsPaused(true);
    setGameStarted(false);
    setShowStartModal(true); // FIX: щоб показати PauseModal
  };

  const resumeGame = () => {
    setIsPaused(false);
    setGameStarted(true);
    setShowStartModal(false); // FIX
  };

  const restartGame = () => {
    clearInterval(intervalRef.current!); // FIX
    setCurrentLevel(1);
    setScore(0);
    setPlayerSequence([]);
    setIsPaused(false);
    setIsGameOver(false);
    setShowStartModal(false);
    setGameStarted(true);
    const newSeq = generateSequence(3);
    setSequence(newSeq);
    showSequence(newSeq);
  };

  const handleStarPress = (index: number) => {
    if (isShowingSequence || !isGameStarted || isPaused) return; // FIX: блок під час паузи

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    // Помилка
    if (sequence[newPlayerSeq.length - 1] !== index) {
      setGameStarted(false);
      setIsGameOver(true);
      setShowStartModal(true);
      return;
    }

    // Додаємо монети за правильне натискання
    addCoins(1);

    // Якщо послідовність завершена
    if (newPlayerSeq.length === sequence.length) {
      const newScore = score + 10 * currentLevel;
      setScore(newScore);

      // Додаємо бонусні монети за завершення рівня
      const bonusCoins = currentLevel * 2; // 2 монети за кожен рівень
      addCoins(bonusCoins);

      if (currentLevel >= TOTAL_LEVELS) {
        setIsGameOver(true);
        setShowStartModal(true);
        setGameStarted(false);
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        const newSeq = generateSequence(nextLevel + 2);
        setSequence(newSeq);
        setPlayerSequence([]);
        showSequence(newSeq);
      }
    }
  };

  const handleGoHome = () => {
    clearInterval(intervalRef.current!); // FIX
    setShowStartModal(false);
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

          <View style={styles.header}>
            <Text style={styles.text}>Level: {currentLevel}</Text>
            <Text style={styles.text}>Score: {score}</Text>
          </View>

          <View style={styles.gameArea}>
            <Image
              source={require('@assets/images/eyeOfRa/desert.png')}
              style={styles.backgroundDesert}
              resizeMode="cover"
            />

            <View style={styles.grid}>
              {Array.from({ length: 9 }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.starButton,
                    activeStar === index && styles.activeStar,
                  ]}
                  onPress={() => handleStarPress(index)}
                  disabled={isShowingSequence || isPaused}
                >
                  {activeStar === index && (
                    <Image
                      source={require('@assets/images/content/prickle.png')}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {!isGameOver && (
            <View style={styles.btnWrap}>
              <TouchableOpacity style={styles.btn} onPress={pauseGame}>
                <Text style={styles.btnText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={restartGame}>
                <Text style={styles.btnText}>Restart</Text>
              </TouchableOpacity>
            </View>
          )}

          <StartMemoryStarModal
            visible={!isGameStarted && !isGameOver && showStartModal && !isPaused}
            onStart={startGame}
            onClose={handleGoHome}
          />

          <PauseModal
            visible={showStartModal && (isPaused || isGameOver)}
            isGameOver={isGameOver}
            score={score}
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

    header: {
        alignSelf: 'flex-end',
        marginRight: 20,
        gap: 12,
    },


    text: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
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
    grid: {
        width: '85%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
    },
    backgroundDesert: {
        position: 'absolute',
        width: '100%',
    },

    starButton: {
        width: 80,
        height: 80,
        margin: 10,
        borderRadius: 16,
        // backgroundColor: '#faca4a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStar: {
        // backgroundColor: Colors.accentYellow,
    },

    btnWrap: {
		backgroundColor: 'transparent',
	},
    btn: {
        backgroundColor: Colors.accentYellow,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 40,
    },
    btnText: {
        color: '#165a1d',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
