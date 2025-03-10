import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import * as Haptics from "expo-haptics";

interface ShakableHiveProps {
  source: ImageSourcePropType;
  style?: object;
  hapticFeedbackType?:
    | "light"
    | "medium"
    | "heavy"
    | "success"
    | "warning"
    | "error"
    | "none";
}

const ShakableHive: React.FC<ShakableHiveProps> = ({
  source,
  style,
  hapticFeedbackType = "heavy",
}) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Trigger haptic feedback
    if (hapticFeedbackType !== "none") {
      if (
        hapticFeedbackType === "light" ||
        hapticFeedbackType === "medium" ||
        hapticFeedbackType === "heavy"
      ) {
        Haptics.impactAsync(
          hapticFeedbackType === "light"
            ? Haptics.ImpactFeedbackStyle.Light
            : hapticFeedbackType === "medium"
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Heavy
        );
      } else {
        Haptics.notificationAsync(
          hapticFeedbackType === "success"
            ? Haptics.NotificationFeedbackType.Success
            : hapticFeedbackType === "warning"
            ? Haptics.NotificationFeedbackType.Warning
            : Haptics.NotificationFeedbackType.Error
        );
      }
    }

    // Reset the animation value
    shakeAnimation.setValue(0);

    // Create a sequence of small movements
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 6,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }],
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.Image
        source={source}
        style={[style, animatedStyle]}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default ShakableHive;
