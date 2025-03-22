import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";

interface HoveringBeeProps {
  xPosition: number; // Absolute X position
  yOffset?: number; // Relative Y position, defaults to 40
  startingXPosition?: number;
}

export const HoveringBee: React.FC<HoveringBeeProps> = ({
  xPosition,
  yOffset = 40,
  startingXPosition,
}) => {
  const hoverAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(
    new Animated.Value(startingXPosition ?? -50)
  ).current;

  useEffect(() => {
    // First move slightly left, then slide to destination
    Animated.sequence([
      // Initial delay
      Animated.delay(300), // Add 300ms delay before starting
      // Quick movement to the left
      Animated.timing(slideAnim, {
        toValue: (startingXPosition ?? -50) - 8, // Increased from 5 to 8px for more noticeable movement
        duration: 200, // Increased from 100 to 200ms
        useNativeDriver: true,
      }),
      // Spring animation to final position
      Animated.spring(slideAnim, {
        toValue: xPosition,
        tension: 45, // Reduced tension for longer animation
        friction: 12, // Adjusted friction for smoother movement
        useNativeDriver: true,
      }),
    ]).start();

    // Existing hover animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Image
      source={require("@/assets/icons/splash-icon.png")}
      style={[
        styles.beeIcon,
        {
          transform: [
            {
              translateX: slideAnim,
            },
            {
              translateY: hoverAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }),
            },
            {
              scaleX: -1,
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  beeIcon: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 40,
  },
});
