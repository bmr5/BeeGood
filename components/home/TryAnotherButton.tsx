import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import * as Haptics from "expo-haptics";

type TryAnotherButtonProps = {
  onPress: () => void;
};

export default function TryAnotherButton({ onPress }: TryAnotherButtonProps) {
  const handlePress = () => {
    // Light haptic feedback for "Try Another"
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <BeeThemedText type="secondary">I want a different deed</BeeThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
