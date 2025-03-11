import React, { useState, useEffect } from "react";
import { StyleSheet, View, Animated, Text } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { ActionCompletionButton } from "./ActionCompletionButton";
import { useUserStore } from "@/stores/useUserStore";
import { UserActionService, UserAction } from "@/services/user-action-service";
import { Action } from "@/services/action-service";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

// Define a type for the user action with its related action data
type UserActionWithDetails = UserAction & {
  action: Action | null;
};

export function ActionDisplay() {
  const [loading, setLoading] = useState(true);
  const [userAction, setUserAction] = useState<UserActionWithDetails | null>(
    null
  );
  const [completed, setCompleted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const user = useUserStore((state) => state.user);
  const colors = Colors.light;

  // Fetch user's action for today
  useEffect(() => {
    async function fetchTodaysAction() {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Get today's action with details using the updated service method
        const todaysAction = await UserActionService.getTodaysActionWithDetails(
          user.id
        );

        setUserAction(todaysAction);

        // Set completed state if we have an action
        if (todaysAction) {
          setCompleted(todaysAction.completed || false);
        }
      } catch (error) {
        console.error("Error fetching today's action:", error);
      } finally {
        setLoading(false);

        // Start fade-in animation when loading completes
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }

    fetchTodaysAction();
  }, [user?.id]);

  // Toggle completion status for action
  const toggleActionCompletion = async () => {
    if (!userAction || !user?.id) return;

    const newCompletedState = !completed;
    setCompleted(newCompletedState);

    try {
      if (newCompletedState) {
        // Mark action as completed using the service
        await UserActionService.markAsCompleted(userAction.id);
      } else {
        // If unchecking, update the action to not completed
        await UserActionService.markAsUncompleted(userAction.id);
      }

      // Refresh user data to get updated streak count
      await useUserStore.getState().refreshUser();
    } catch (error) {
      console.error("Error updating action completion:", error);
      // Revert UI state if the API call fails
      setCompleted(!newCompletedState);
    }
  };

  // Show empty view while loading instead of activity indicator
  if (loading && !userAction) {
    return <View style={styles.actionContainer} />;
  }

  // Show a message if no action is available
  if (!userAction) {
    return (
      <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
        <BeeThemedText type="title" style={styles.actionTitle}>
          No action available for today.
        </BeeThemedText>
      </Animated.View>
    );
  }

  // Show congratulatory screen if action is completed
  if (completed) {
    return (
      <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
        <View style={styles.congratsContainer}>
          <Ionicons
            name="checkmark-circle"
            size={80}
            color={colors.tint}
            style={styles.congratsIcon}
          />
          <BeeThemedText type="title" style={styles.congratsTitle}>
            Great job!
          </BeeThemedText>
          <BeeThemedText style={styles.congratsText}>
            You've completed your good deed for today.
          </BeeThemedText>
          <BeeThemedText style={styles.congratsText}>
            Come back tomorrow for a new opportunity to make a difference!
          </BeeThemedText>

          {/* Undo button */}
          <View style={styles.undoButtonContainer}>
            <Text style={styles.undoButton} onPress={toggleActionCompletion}>
              Oops! Not done yet
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // Show the action if not completed
  return (
    <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
      <BeeThemedText type="title" style={styles.actionTitle}>
        {userAction.action?.title || "Oops, no action available"}
      </BeeThemedText>

      {/* Action Button */}
      <View style={styles.actionButtons}>
        <ActionCompletionButton
          completed={completed}
          onPress={toggleActionCompletion}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: -40, // This helps offset the spacing from header/footer
    justifyContent: "center",
    minHeight: 200,
  },
  actionTitle: {
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
  congratsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  congratsIcon: {
    marginBottom: 20,
  },
  congratsTitle: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  undoButtonContainer: {
    marginTop: 24,
    backgroundColor: "rgba(255, 192, 203, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  undoButton: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: "500",
  },
});
