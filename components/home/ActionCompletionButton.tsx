import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import * as Haptics from "expo-haptics";

interface ActionCompletionButtonProps {
  completed: boolean;
  onPress: () => void;
  style?: object;
}

export const ActionCompletionButton: React.FC<ActionCompletionButtonProps> = ({
  completed,
  onPress,
  style,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Trigger heavy haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Call the provided onPress handler
    onPress();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.button,
          completed ? styles.completedButton : styles.incompleteButton,
          style,
        ]}
        onPress={handlePress}
      >
        <BeeThemedText type="defaultSemiBold" style={styles.buttonText}>
          {completed ? "Completed!" : "I'm done!"}
        </BeeThemedText>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  incompleteButton: {
    backgroundColor: "#F6B93B",
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
