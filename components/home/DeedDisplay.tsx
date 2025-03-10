import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import DeedCompletionButton from "@/components/home/DeedCompletionButton";
import TryAnotherButton from "@/components/home/TryAnotherButton";
import { useUserStore } from "@/stores/useUserStore";

// Sample deeds to cycle through
const SAMPLE_DEEDS = [
  {
    id: "1",
    title: "Call mom today, let her know I love her",
    category: "general",
    completed: false,
  },
  {
    id: "2",
    title: "Help someone carry their groceries",
    category: "general",
    completed: false,
  },
  {
    id: "3",
    title: "Compliment a stranger today",
    category: "general",
    completed: false,
  },
  {
    id: "4",
    title: "Pick up litter in your neighborhood",
    category: "environment",
    completed: false,
  },
];

export default function DeedDisplay() {
  // Get user data from store
  const user = useUserStore((state) => state.user);

  // Local state for the current deed
  const [currentDeedIndex, setCurrentDeedIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentDeed = SAMPLE_DEEDS[currentDeedIndex];

  // Toggle completion status for deed
  const toggleDeedCompletion = () => {
    setCompleted(!completed);

    // Here you would update the user's completed deeds in your backend
    // For example: updateUserAction(currentDeed.id, !completed);

    // If you have a function in your user store to update actions:
    // useUserStore.getState().updateUserAction(currentDeed.id, !completed);
  };

  // Handle try another deed
  const tryAnotherDeed = () => {
    // Reset completion state
    setCompleted(false);

    // Move to the next deed in the array
    setCurrentDeedIndex((prevIndex) => (prevIndex + 1) % SAMPLE_DEEDS.length);
  };

  return (
    <View style={styles.deedContainer}>
      <BeeThemedText type="title" style={styles.deedTitle}>
        {currentDeed.title}
      </BeeThemedText>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <DeedCompletionButton
          completed={completed}
          onPress={toggleDeedCompletion}
        />

        <TryAnotherButton onPress={tryAnotherDeed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deedContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: -40, // This helps offset the spacing from header/footer
  },
  deedTitle: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 36,
  },
  actionButtons: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
});
