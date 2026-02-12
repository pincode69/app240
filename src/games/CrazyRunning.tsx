import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GameOverModalModal from '@/components/GameOverModal';
import { useCoins } from '@/hooks/useCoins';

const { width: screenWidth } = Dimensions.get('window');

interface GameState {
  score: number;
  gameOver: boolean;
  isJumping: boolean;
  jumpPower: number;
  jumpStartTime: number;
  jumpStartY: number;
  canDoubleJump: boolean;
  playerY: number;
  obstacles: Array<{ x: number; y: number; width: number; height: number }>;
  coins: Array<{ x: number; y: number; width: number; height: number; collected: boolean }>;
  gameSpeed: number;
}

const CrazyRunning: React.FC = () => {
  const navigation = useNavigation();
  const animationRef = useRef<number | undefined>(undefined);
  const { addCoins } = useCoins();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    gameOver: false,
    isJumping: false,
    jumpPower: 0,
    jumpStartTime: 0,
    jumpStartY: 380,
    canDoubleJump: false,
    playerY: 380,
    obstacles: [],
    coins: [],
    gameSpeed: 6
  });

  const playerWidth = 120;
  const playerHeight = 120;
  const playerX = 0;
  // const jumpHeight = 200;
  const jumpDuration = 1000;
  const obstacleWidth = 30;
  const obstacleHeight = 30;
  const coinWidth = 30;
  const coinHeight = 30;

  // Game loop
  const gameLoop = () => {
    if (gameState.gameOver) return;

    setGameState(prevState => {
      const newState = { ...prevState };

      // Handle jumping
      if (newState.isJumping) {
        const jumpProgress = (Date.now() - newState.jumpStartTime) / jumpDuration;
        const currentJumpHeight = newState.jumpPower;
        
        // Smoother jump animation with easing
        let easedProgress = jumpProgress;
        if (jumpProgress < 0.5) {
          // Ease in - slower at start
          easedProgress = 2 * jumpProgress * jumpProgress;
        } else {
          // Ease out - slower at end
          easedProgress = 1 - 2 * (1 - jumpProgress) * (1 - jumpProgress);
        }
        
        // Calculate jump from current position (jumpStartY), not from ground
        const jumpOffset = Math.sin(easedProgress * Math.PI) * currentJumpHeight;
        newState.playerY = newState.jumpStartY - jumpOffset;
        
        // Enable double jump when at peak of first jump
        if (jumpProgress > 0.3 && jumpProgress < 0.7) {
          newState.canDoubleJump = true;
        }
        
        if (jumpProgress >= 1) {
          newState.isJumping = false;
          newState.jumpPower = 0;
          newState.canDoubleJump = false;
          newState.jumpStartY = 380; // Reset to ground
          newState.playerY = 380; // Land on ground
        }
      }

      // Move obstacles
      newState.obstacles = newState.obstacles
        .map(obstacle => ({ ...obstacle, x: obstacle.x - newState.gameSpeed }))
        .filter(obstacle => obstacle.x > -obstacleWidth);

      // Move coins
      newState.coins = newState.coins
        .map(coin => ({ ...coin, x: coin.x - newState.gameSpeed }))
        .filter(coin => coin.x > -coinWidth);

      // Spawn obstacles (reduced frequency)
      if (Math.random() < 0.008) {
        newState.obstacles.push({
          x: screenWidth - 40,
            y: 460,
          width: obstacleWidth,
          height: obstacleHeight
        });
      }

      // Spawn coins
      if (Math.random() < 0.01) {
        newState.coins.push({
          x: screenWidth - 40,
            y: Math.random() * 300 + 100,
          width: coinWidth,
          height: coinHeight,
          collected: false
        });
      }

      const playerRect = {
        x: playerX,
        y: newState.playerY,
        width: playerWidth,
        height: playerHeight
      };

      for (const obstacle of newState.obstacles) {
        if (isColliding(playerRect, obstacle)) {
          newState.gameOver = true;
          break;
        }
      }

      for (const coin of newState.coins) {
        if (!coin.collected && isColliding(playerRect, coin)) {
          coin.collected = true;
          newState.score += 1;
          // Додаємо монети за зібрану монету в грі
          addCoins(1);
        }
      }

      if (newState.score > 0 && newState.score % 3 === 0) {
        newState.gameSpeed = Math.min(newState.gameSpeed + 0.2, 8);
      }

      return newState;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const isColliding = (rect1: any, rect2: any) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const jump = () => {
    if (!gameState.gameOver) {
      if (!gameState.isJumping) {
        // First jump - start from current position
        setGameState(prev => ({ 
          ...prev, 
          isJumping: true,
          jumpPower: 100, // Fixed jump height
          jumpStartTime: Date.now(),
          jumpStartY: prev.playerY // Start from current position
        }));
      } else if (gameState.isJumping && gameState.canDoubleJump) {
        setGameState(prev => ({ 
          ...prev, 
          jumpPower: prev.jumpPower + 80, // Add extra height
          jumpStartTime: Date.now(), // Reset jump timing
          jumpStartY: prev.playerY, // Start from current position
          canDoubleJump: false // Disable further double jumps
        }));
      } else if (gameState.isJumping && !gameState.canDoubleJump) {
        setGameState(prev => ({ 
          ...prev, 
          jumpPower: prev.jumpPower + 80, // Add more height
          jumpStartTime: Date.now(), // Reset jump timing
          jumpStartY: prev.playerY // Start from current position
        }));
      }
    }
  };

  const handleFinishGameGoHome = () => {
    // Додаємо бонусні монети за високий рахунок
    if (gameState.score > 0) {
      const bonusCoins = Math.floor(gameState.score / 5); // 1 монета за кожні 5 очок
      if (bonusCoins > 0) {
        addCoins(bonusCoins);
      }
    }

    setGameState({
      score: 0,
      gameOver: false,
      isJumping: false,
      jumpPower: 0,
      jumpStartTime: 0,
      jumpStartY: 380,
      canDoubleJump: false,
      playerY: 380,
      obstacles: [],
      coins: [],
      gameSpeed: 4
    });

    setTimeout(() => {
      navigation.navigate('home' as never);
    }, 200);
  } 

  const restartGame = () => {
    setGameState({
      score: 0,
      gameOver: false,
      isJumping: false,
      jumpPower: 0,
      jumpStartTime: 0,
      jumpStartY: 380,
      canDoubleJump: false,
      playerY: 380,
      obstacles: [],
      coins: [],
      gameSpeed: 4
    });
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameOver]);

  return (
    <ImageBackground
      source={require('@assets/images/homeBg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => (navigation.navigate('home' as never))}>
            <Text style={styles.closeText}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {gameState.score}</Text>
          </View>
  
          <View style={styles.gameArea}>
            {/* Player */}
            <View 
              style={[
                styles.player,
                {
                  left: playerX,
                  top: gameState.playerY,
                  width: playerWidth,
                  height: playerHeight,
                }
              ]}
            >
              <Image 
                source={require('@assets/images/trip/BabyCamel.gif')}
                style={styles.playerImage}
                resizeMode="contain"
              />
            </View>

            {/* Obstacles */}
            {gameState.obstacles.map((obstacle, index) => (
              <View
                key={index}
                style={[
                  styles.obstacle,
                  {
                    left: obstacle.x,
                    top: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height,
                  }
                ]}
              >
                <Image 
                  source={require('@assets/images/trip/tumbleweed.png')}
                  style={styles.obstacleImage}
                  resizeMode="contain"
                />
              </View>
            ))}

            {/* Coins */}
            {gameState.coins.map((coin, index) => (
              !coin.collected && (
                <View
                  key={index}
                  style={[
                    styles.coin,
                    {
                      left: coin.x,
                      top: coin.y,
                      width: coin.width,
                      height: coin.height,
                    }
                  ]}
                >
                  <Image 
                    source={require('@assets/images/trip/coin.png')}
                    style={styles.coinImage}
                    resizeMode="contain"
                  />
                </View>
              )
            ))}

            <Image
              source={require('@assets/images/trip/bg.png')}
              style={styles.backgroundGameArea}
              resizeMode="contain"
            />
          </View>

          <GameOverModalModal score={gameState.score} visible={gameState.gameOver} restartGame={restartGame} onClose={handleFinishGameGoHome} />

          <TouchableOpacity 
            style={[
              styles.jumpButton,
              gameState.canDoubleJump && styles.jumpButtonDoubleJump,
              gameState.isJumping && !gameState.canDoubleJump && styles.jumpButtonJumping
            ]} 
            onPress={jump}
            disabled={gameState.gameOver}
          >
            <Text style={styles.jumpButtonText}>
              {gameState.canDoubleJump ? 'Double Jump!' : 
              gameState.isJumping ? 'Jump Higher!' : 'Jump'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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

  backgroundGameArea: {
    position: 'absolute',
    width: '100%',
    bottom: -100
  },
  gameArea: {
    position: 'relative',
    backgroundColor: 'rgba(154, 128, 48, 0.5)',
    width: '100%',
    height: 500,
    overflow: 'hidden',
    borderRadius: 15,
    marginHorizontal: 20,
  },
  player: {
    position: 'absolute',
    zIndex: 5,
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  obstacle: {
    position: 'absolute',
    zIndex: 3,
  },
  obstacleImage: {
    width: '100%',
    height: '100%',
  },
  coin: {
    position: 'absolute',
    zIndex: 4,
  },
  coinImage: {
    width: '100%',
    height: '100%',
  },
  
  gameOverContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 20,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#165a1d',
    fontSize: 18,
    fontWeight: 'bold',
  },

  jumpButton: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    zIndex: 10,
    marginTop: 20,
  },
  jumpButtonDoubleJump: {
    backgroundColor: '#fa6407ff',
    transform: [{ scale: 1.2 }],
  },
  jumpButtonJumping: {
    backgroundColor: '#fa8d07ff',
    transform: [{ scale: 1.1 }],
  },
  jumpButtonText: {
    color: '#165a1d',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CrazyRunning;
