import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface RandomFlyingBeeProps {
  speedFactor?: number;
  pauseDuration?: number;
}

const RandomFlyingBee: React.FC<RandomFlyingBeeProps> = ({
  speedFactor = 1,
}) => {
  // Get screen dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Bee position and rotation
  const beePosition = {
    x: useSharedValue(screenWidth * 0.5),
    y: useSharedValue(screenHeight * 0.3),
  };
  const beeRotation = useSharedValue(1);
  const beeScale = useSharedValue(1);

  // Wing flapping state
  const wingPhase = useSharedValue(0);

  // Trail effect
  const [trailPositions, setTrailPositions] = useState<
    Array<{
      x: number;
      y: number;
      opacity: number;
      scale: number;
    }>
  >([]);

  // Initialize wing flapping
  useEffect(() => {
    // Continuous wing flapping
    wingPhase.value = withRepeat(
      withTiming(1, { duration: 150 / speedFactor, easing: Easing.linear }),
      -1,
      true
    );

    // Set up trail effect
    const trailInterval = setInterval(() => {
      setTrailPositions((prev) =>
        [
          {
            x: beePosition.x.value,
            y: beePosition.y.value,
            opacity: 1,
            scale: 1,
          },
          ...prev.map((p) => ({
            ...p,
            opacity: p.opacity - 0.2,
            scale: p.scale - 0.1,
          })),
        ]
          .filter((p) => p.opacity > 0)
          .slice(0, 5)
      );
    }, 100);

    return () => clearInterval(trailInterval);
  }, [speedFactor]);

  // Create a continuous random flight path
  useEffect(() => {
    const flyToRandomLocation = () => {
      // Choose a random target within the screen bounds
      // Add some padding to keep the bee away from the very edges
      const padding = 60; // Bee size + some margin
      const targetX = padding + Math.random() * (screenWidth - 2 * padding);
      const targetY = padding + Math.random() * (screenHeight - 2 * padding);

      // Calculate flight duration based on distance
      const distance = Math.sqrt(
        Math.pow(targetX - beePosition.x.value, 2) +
          Math.pow(targetY - beePosition.y.value, 2)
      );

      // Base duration on distance (60ms per pixel for a moderate pace)
      const duration = (distance * 60) / speedFactor;

      // Determine direction
      const isMovingRight = targetX > beePosition.x.value;
      beeRotation.value = isMovingRight ? -1 : 1;

      // Animate to the target
      beePosition.x.value = withTiming(
        targetX,
        {
          duration: duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          // When we reach the target, immediately start a new path
          runOnJS(flyToRandomLocation)();
        }
      );

      beePosition.y.value = withTiming(targetY, {
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Add slight bobbing motion
      beeScale.value = withSequence(
        withTiming(1.1, { duration: duration * 0.1 }),
        withTiming(1, { duration: duration * 0.1 })
      );
    };

    // Start the flight path
    flyToRandomLocation();
  }, [speedFactor, screenWidth, screenHeight]);

  // Create animated styles
  const beeAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: beePosition.x.value - 30,
    top: beePosition.y.value - 30,
    transform: [
      { scaleX: beeRotation.value }, // -1 flips horizontally, 1 keeps normal
      { scale: beeScale.value },
    ],
    zIndex: 1000, // Very high z-index to ensure it's above everything
  }));

  return (
    <>
      {/* Render trail */}
      {trailPositions.map((pos, index) => (
        <View
          key={`trail-${index}`}
          style={[
            styles.trailDot,
            {
              left: pos.x,
              top: pos.y,
              opacity: pos.opacity,
              transform: [{ scale: pos.scale }],
            },
          ]}
        />
      ))}

      {/* Render bee */}
      <Animated.View style={beeAnimatedStyle}>
        <AnimatedImage
          source={
            wingPhase.value > 0.5
              ? require("../assets/images/bee-wings-up.png")
              : require("../assets/images/bee-wings-down.png")
          }
          style={styles.bee}
          resizeMode="contain"
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  bee: {
    width: 50,
    height: 50,
  },
  trailDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 220, 0, 0.6)",
    zIndex: 999, // Just below the bee
  },
});

export default RandomFlyingBee;
