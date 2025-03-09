import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface BeeGardenAnimationProps {
  height?: number;
  onBeeVisitFlower?: () => void;
  speedFactor?: number;
}

const BeeGardenAnimation: React.FC<BeeGardenAnimationProps> = ({
  height = 200,
  onBeeVisitFlower,
  speedFactor = 1,
}) => {
  // Get screen dimensions
  const screenWidth = Dimensions.get("window").width;

  // Bee position and rotation
  const beePosition = {
    x: useSharedValue(screenWidth * 0.1),
    y: useSharedValue(height * 0.3),
  };
  const beeRotation = useSharedValue(0);
  const beeScale = useSharedValue(1);

  // Wing flapping state
  const wingPhase = useSharedValue(0);

  // Movement state
  const [shouldMove, setShouldMove] = useState(true);

  // Trail effect state
  const [trailPositions, setTrailPositions] = useState<
    Array<{
      x: number;
      y: number;
      opacity: number;
      scale: number;
    }>
  >([]);
  const [trailUpdateTrigger, setTrailUpdateTrigger] = useState(0);

  // Initialize wing flapping
  useEffect(() => {
    // Slower wing flapping - increased duration from 150ms to 300ms
    wingPhase.value = withRepeat(
      withTiming(1, { duration: 300 / speedFactor, easing: Easing.linear }),
      -1,
      true
    );
  }, [speedFactor]);

  // Update trail positions
  useEffect(() => {
    // Update trail positions
    const updateTrail = () => {
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

      // Trigger next update
      setTrailUpdateTrigger((prev) => prev + 1);
    };

    // Schedule next trail update
    const timeoutId = setTimeout(() => {
      updateTrail();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [trailUpdateTrigger]);

  // Create a simple random flight path
  useEffect(() => {
    if (!shouldMove) return;

    const moveToRandomPosition = () => {
      // Set movement state to false to prevent multiple movements
      setShouldMove(false);

      // Trigger callback occasionally
      if (Math.random() > 0.7 && onBeeVisitFlower) {
        onBeeVisitFlower();
      }

      // Current position
      const currentX = beePosition.x.value;
      const currentY = beePosition.y.value;

      // Generate random target within the garden
      // Keep the bee within the flower bed area (lower 60% of height)
      const targetX = Math.random() * screenWidth;
      const targetY = height * 0.3 + Math.random() * (height * 0.5);

      // Calculate flight duration based on distance
      const distance = Math.sqrt(
        Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
      );
      // Even slower movement - increased from 30ms to 45ms per pixel (50% slower)
      const duration = (distance * 45) / speedFactor;

      // Determine direction
      const isMovingRight = targetX > currentX;
      beeRotation.value = withTiming(isMovingRight ? -1 : 1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });

      // Calculate pause duration - longer pauses
      const pauseDuration = 1000 + Math.random() * 2000;

      // Animate to the target
      beePosition.x.value = withTiming(
        targetX,
        {
          duration: duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          // After reaching target, schedule the next movement after a delay
          beePosition.x.value = withDelay(
            pauseDuration,
            withTiming(beePosition.x.value, { duration: 0 }, () => {
              // Allow movement again
              runOnJS(setShouldMove)(true);
            })
          );
        }
      );

      beePosition.y.value = withTiming(targetY, {
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Add slight bobbing motion
      beeScale.value = withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
    };

    // Start the random movement
    moveToRandomPosition();
  }, [speedFactor, onBeeVisitFlower, shouldMove]);

  // Create animated styles
  const beeAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: beePosition.x.value - 25,
    top: beePosition.y.value - 25,
    transform: [
      { scaleX: beeRotation.value }, // -1 flips horizontally, 1 keeps normal
      { scale: beeScale.value },
    ],
    zIndex: 100,
  }));

  return (
    <View style={[styles.container, { height }]}>
      {/* Render flower bed stretching across the component */}
      <Image
        source={require("../assets/images/flower-bed.png")}
        style={styles.flowerBed}
        resizeMode="stretch"
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  flowerBed: {
    width: "100%",
    height: "60%",
    position: "absolute",
    bottom: 0,
  },
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
    zIndex: 5,
  },
});

export default BeeGardenAnimation;
