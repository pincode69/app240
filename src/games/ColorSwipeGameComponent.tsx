import React, { JSX, useEffect, useReducer, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import PauseModal from '@/components/PauseModal';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StartSwipeColorModal from '@/components/StartSwipeColorModal';
import { useCoins } from '@/hooks/useCoins';

type FigureType = 'circle' | 'triangle' | 'diamond' | 'square';

const figures: FigureType[] = ['circle', 'triangle', 'diamond', 'square'];
const expectedDirections = {
  circle: 'up',
  triangle: 'right',
  diamond: 'left',
  square: 'down',
};

const shapeMap: Record<FigureType, JSX.Element> = {
  circle: <Image source={require('@assets/images/gems/1.png')} style={{width: 100}} resizeMode='contain' />,
  triangle: <Image source={require('@assets/images/gems/2.png')} style={{width: 100}} resizeMode='contain' />,
  diamond: <Image source={require('@assets/images/gems/3.png')} style={{width: 100}} resizeMode='contain' />,
  square: <Image source={require('@assets/images/gems/4.png')} style={{width: 100}} resizeMode='contain' />,
};

const getRandomFigure = (): FigureType => {
  return figures[Math.floor(Math.random() * figures.length)];
};

type GameState = {
  correctCount: number;
  mistakeCount: number;
  currentFigure: FigureType;
  startTime: number;
  reactionTimes: number[];
};

const initialState: GameState = {
  correctCount: 0,
  mistakeCount: 0,
  currentFigure: getRandomFigure(),
  startTime: Date.now(),
  reactionTimes: [],
};

function gameReducer(state: GameState, action: any): GameState {
    switch (action.type) {
        case 'NEW_FIGURE':
        return {
            ...state,
            currentFigure: getRandomFigure(),
            startTime: Date.now(),
        };
        case 'CORRECT':
        return {
            ...state,
            correctCount: state.correctCount + 1,
            reactionTimes: [...state.reactionTimes, Date.now() - state.startTime],
            currentFigure: getRandomFigure(),
            startTime: Date.now(),
        };
        case 'MISTAKE':
        return {
            ...state,
            mistakeCount: state.mistakeCount + 1,
            currentFigure: getRandomFigure(),
            startTime: Date.now(),
        };
        case 'RESET':
        return {
            ...initialState,
            currentFigure: getRandomFigure(),
            startTime: Date.now(),
        };
        default:
        return state;
    }
}

export default function ColorSwipeGameComponent() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const currentFigureRef = useRef<FigureType>(state.currentFigure);
    const [latestScore, setLatestScore] = useState<number>(0);
    const [isStartModalVisible, setStartModalVisible] = useState(true);
    const [isGameOver, setGameOver] = useState(false);
    const navigation = useNavigation();
    const { addCoins } = useCoins();

    useEffect(() => {
        currentFigureRef.current = state.currentFigure;
    }, [state.currentFigure]);

    useEffect(() => {
        if (state.correctCount >= 15) {
            const avg =
                state.reactionTimes.reduce((sum, t) => sum + t, 0) /
                state.reactionTimes.length;
            const score = avg / 1000;
            setLatestScore(score);
            
            const bonusCoins = Math.floor(state.correctCount / 3);
            if (bonusCoins > 0) {
                addCoins(bonusCoins);
            }
            
            setGameOver(true);
            setStartModalVisible(true);
        }
    }, [state.correctCount]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (_, gestureState) => {
                const { dx, dy } = gestureState;
                let direction = '';
                if (Math.abs(dx) > Math.abs(dy)) {
                    direction = dx > 0 ? 'right' : 'left';
                } else {
                    direction = dy > 0 ? 'down' : 'up';
                }

                const figureAtSwipeTime = currentFigureRef.current;
                const expected = expectedDirections[figureAtSwipeTime];

                if (direction === expected) {
                    dispatch({ type: 'CORRECT' });
                    addCoins(1);
                } else {
                    dispatch({ type: 'MISTAKE' });
                }
            },
        })
    ).current;

    const startGame = () => {
        dispatch({ type: 'RESET' });
        setGameOver(false);
        setStartModalVisible(false);
    };

    const restartGame = () => {
        dispatch({ type: 'RESET' });
        setGameOver(false);
        setStartModalVisible(false);
    };

    const goHome = () => {
        setStartModalVisible(false);
    };

    const handleGoHome = () => {
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
                    <View style={styles.header}>
                        <View style={styles.score}>
                            <Image source={require('@assets/images/content/check.png')} style={styles.sign} /> 
                            <Text style={styles.scoreText}>{state.correctCount}</Text>
                        </View>

                        <View style={styles.score}>
                            <Image source={require('@assets/images/content/cross.png')} style={styles.sign} />
                            <Text style={styles.scoreText}>{state.mistakeCount}</Text>
                        </View>
                    </View>
                    

                    <View style={styles.gameArea} {...panResponder.panHandlers}>
                        <Image
                            source={require('@assets/images/gems/case-gems.png')}
                            style={styles.backgroundDesert}
                            resizeMode="contain"
                        />
                        <View style={styles.figureContainer}>
                            {shapeMap[state.currentFigure]}
                        </View>
                    </View>

                    {!isGameOver && (
                        <TouchableOpacity style={styles.btn} onPress={restartGame}>
                            <Text style={styles.btnText}>Restart the game</Text>
                        </TouchableOpacity>
                    )}

                    <StartSwipeColorModal
                        visible={isStartModalVisible && !isGameOver}
                        onStart={startGame}
                        onClose={handleGoHome}
                    />
                    <PauseModal
                        visible={isGameOver && isStartModalVisible}
                        isGameOver={true}
                        score={latestScore}
                        onRestart={restartGame}
                        onResume={restartGame}
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
    
    sign: {
        width: 32,
        height: 32
    },
    score: {
        flexDirection: 'row',
        gap: 8
    },
    scoreText: {
        fontSize: 36,
        lineHeight: 50,
        fontWeight: '900',
        color: 'white',
        fontFamily: 'Gloria Hallelujah',
    },
    gameArea: {
        backgroundColor: 'transparent',
        marginTop: 24,
        marginBottom: 20,
        borderRadius: 8,
        height: 400,
        width: 320,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundDesert: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    figureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoresWrap: {
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreLabel: {
        fontSize: 20,
        color: '#fff',
        marginVertical: 4,
    },
    scoreValue: {
        color: Colors.accentYellow,
        fontWeight: 'bold',
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
