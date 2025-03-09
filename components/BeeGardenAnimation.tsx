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

  // Define garden boundaries
  const gardenWidth = useSharedValue(screenWidth);
  const gardenHeight = useSharedValue(height);

  // Define flower positions with more spacing
  const flowerPositions = [
    { x: screenWidth * 0.3, y: height * 0.6 }, // Further left (changed from 0.4 to 0.3)
    { x: screenWidth * 0.5, y: height * 0.7 }, // Center stays the same
    { x: screenWidth * 0.7, y: height * 0.65 }, // Further right (changed from 0.6 to 0.7)
  ];

  // Bee position and rotation
  const beePosition = {
    x: useSharedValue(screenWidth * 0.1),
    y: useSharedValue(height * 0.3),
  };
  const beeRotation = useSharedValue(0);
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

  // Add a state to track if the bee is at a flower
  const isAtFlower = useSharedValue(false);
  const currentFlowerIndex = useSharedValue(-1);

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

  // Create a natural flight path
  useEffect(() => {
    const visitFlowerCallback = () => {
      if (onBeeVisitFlower) {
        onBeeVisitFlower();
      }

      // Mark that we're at a flower
      isAtFlower.value = true;

      // Generate a random pause duration between 5 and 15 seconds
      const pauseDuration = 5000 + Math.random() * 10000; // Between 5000ms and 15000ms

      // After a random delay, allow moving to the next flower
      beeScale.value = withTiming(1, { duration: pauseDuration }, () => {
        // Only after the pause completes, we allow moving on
        isAtFlower.value = false;
        // Trigger the next movement
        runOnJS(createFlightPath)();
      });
    };

    const createFlightPath = () => {
      // Don't start a new path if we're already at a flower
      if (isAtFlower.value) return;

      // Start from current position
      const currentX = beePosition.x.value;
      const currentY = beePosition.y.value;

      // Choose next flower (different from current)
      let targetIndex;
      do {
        targetIndex = Math.floor(Math.random() * flowerPositions.length);
      } while (
        targetIndex === currentFlowerIndex.value &&
        flowerPositions.length > 1
      );

      currentFlowerIndex.value = targetIndex;
      const target = flowerPositions[targetIndex];

      // Convert to actual coordinates
      const targetX = target.x;
      const targetY = target.y;

      // Calculate flight duration based on distance
      const distance = Math.sqrt(
        Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
      );
      // Much slower movement - 80ms per pixel
      const duration = (distance * 80) / speedFactor;

      // Create multiple midpoints for a more random path
      // We'll create 3 midpoints to make a more complex path
      const midpoints = [
        {
          x:
            currentX +
            (targetX - currentX) * 0.25 +
            (Math.random() - 0.5) * distance * 0.4,
          y:
            currentY +
            (targetY - currentY) * 0.25 +
            (Math.random() - 0.5) * distance * 0.4,
        },
        {
          x:
            currentX +
            (targetX - currentX) * 0.5 +
            (Math.random() - 0.5) * distance * 0.4,
          y:
            currentY +
            (targetY - currentY) * 0.5 +
            (Math.random() - 0.5) * distance * 0.4,
        },
        {
          x:
            currentX +
            (targetX - currentX) * 0.75 +
            (Math.random() - 0.5) * distance * 0.4,
          y:
            currentY +
            (targetY - currentY) * 0.75 +
            (Math.random() - 0.5) * distance * 0.4,
        },
      ];

      // Function to animate to the next point in sequence
      const animateToPoint = (index: number) => {
        if (index >= midpoints.length) {
          // If we've gone through all midpoints, animate to the target
          const isMovingRight = targetX > beePosition.x.value;
          beeRotation.value = isMovingRight ? -1 : 1;

          beePosition.x.value = withTiming(
            targetX,
            {
              duration: duration / (midpoints.length + 1),
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
            () => {
              // When we reach the target, trigger callback
              runOnJS(visitFlowerCallback)();
            }
          );

          beePosition.y.value = withTiming(targetY, {
            duration: duration / (midpoints.length + 1),
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });

          return;
        }

        // Get the next point
        const nextPoint = midpoints[index];

        // Determine direction for this segment
        const isMovingRight = nextPoint.x > beePosition.x.value;
        beeRotation.value = isMovingRight ? -1 : 1;

        // Animate to the next midpoint
        beePosition.x.value = withTiming(
          nextPoint.x,
          {
            duration: duration / (midpoints.length + 1),
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            // When we reach this midpoint, move to the next one
            runOnJS(animateToPoint)(index + 1);
          }
        );

        beePosition.y.value = withTiming(nextPoint.y, {
          duration: duration / (midpoints.length + 1),
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      };

      // Start the animation sequence with the first midpoint
      animateToPoint(0);

      // Add slight bobbing motion
      beeScale.value = withSequence(
        withTiming(1.1, { duration: duration * 0.1 }),
        withTiming(1, { duration: duration * 0.1 })
      );
    };

    // Start the flight path
    createFlightPath();
  }, [speedFactor, onBeeVisitFlower]);

  // Create animated styles
  const beeAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: beePosition.x.value - 30,
    top: beePosition.y.value - 30,
    transform: [
      { scaleX: beeRotation.value }, // -1 flips horizontally, 1 keeps normal
      { scale: beeScale.value },
    ],
    zIndex: 100,
  }));

  return (
    <View style={[styles.container, { height }]}>
      {/* Render flowers clustered in the middle */}
      <View
        style={[
          styles.flowerContainer,
          {
            left: flowerPositions[0].x - 30, // Adjusted for smaller size
            top: flowerPositions[0].y - 30, // Adjusted for smaller size
          },
        ]}
      >
        <Image
          source={require("../assets/images/flower.png")}
          style={styles.flower}
          resizeMode="contain"
        />
      </View>

      <View
        style={[
          styles.flowerContainer,
          {
            left: flowerPositions[1].x - 30, // Adjusted for smaller size
            top: flowerPositions[1].y - 30, // Adjusted for smaller size
          },
        ]}
      >
        <Image
          source={require("../assets/images/flower.png")}
          style={styles.flower}
          resizeMode="contain"
        />
      </View>

      <View
        style={[
          styles.flowerContainer,
          {
            left: flowerPositions[2].x - 30, // Adjusted for smaller size
            top: flowerPositions[2].y - 30, // Adjusted for smaller size
          },
        ]}
      >
        <Image
          source={require("../assets/images/flower.png")}
          style={styles.flower}
          resizeMode="contain"
        />
      </View>

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
  flowerContainer: {
    position: "absolute",
    width: 60, // Reduced from 80 back to 60
    height: 60, // Reduced from 80 back to 60
  },
  flower: {
    width: "100%",
    height: "100%",
  },
  bee: {
    width: 60,
    height: 60,
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
