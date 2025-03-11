import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { ActionCompletionButton } from "./ActionCompletionButton";
import TryAnotherButton from "@/components/home/TryAnotherButton";
import { useUserStore } from "@/stores/useUserStore";
import { UserActionService, UserAction } from "@/services/user-action-service";
import { ActionService, Action } from "@/services/action-service";
import Colors from "@/constants/Colors";

// Define a type for the user actions with their related action data
type UserActionWithDetails = UserAction & {
  action: Action | null;
};

export function ActionDisplay() {
  const [loading, setLoading] = useState(true);
  const [userActions, setUserActions] = useState<UserActionWithDetails[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const user = useUserStore((state) => state.user);

  // Fetch user's actions
  useEffect(() => {
    async function fetchUserActions() {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Get today's actions with details using the UserActionService
        const actions = await UserActionService.getTodaysActionsWithDetails(
          user.id
        );
        setUserActions(actions);

        // If there are actions, check if the first one is completed
        if (actions.length > 0) {
          setCompleted(actions[0].completed || false);
        }
      } catch (error) {
        console.error("Error fetching user actions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserActions();
  }, [user?.id]);

  // Get the current action
  const currentUserAction = userActions[currentActionIndex];

  // Toggle completion status for action
  const toggleActionCompletion = async () => {
    if (!currentUserAction || !user?.id) return;

    const newCompletedState = !completed;
    setCompleted(newCompletedState);

    try {
      if (newCompletedState) {
        // Mark action as completed using the service
        await UserActionService.markAsCompleted(currentUserAction.id);
      } else {
        // If unchecking, update the action to not completed
        await UserActionService.update(currentUserAction.id, {
          completed: false,
          completion_date: null,
        });
      }
    } catch (error) {
      console.error("Error updating action completion:", error);
      // Revert UI state if the API call fails
      setCompleted(!newCompletedState);
    }
  };

  // Handle try another action
  const tryAnotherAction = async () => {
    // Reset completion state
    setCompleted(false);

    // If we have more actions in the array, move to the next one
    if (currentActionIndex < userActions.length - 1) {
      setCurrentActionIndex(currentActionIndex + 1);
      setCompleted(userActions[currentActionIndex + 1].completed || false);
    } else {
      // If we're at the end, fetch more actions
      setLoading(true);
      try {
        // Mark current action as skipped
        if (currentUserAction?.id) {
          await UserActionService.markAsSkipped(currentUserAction.id);
        }

        // Get more actions for the user
        if (user?.id) {
          // Call the API to assign new actions to the user
          // This will be implemented on your server
          const response = await fetch(
            `https://api.beegood.app/users/${user.id}/actions/assign`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                count: 3, // Request 3 new actions
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json();

          if (data.userActions && data.userActions.length > 0) {
            // Add new actions to the existing ones
            setUserActions([...userActions, ...data.userActions]);

            // Move to the first new action
            setCurrentActionIndex(userActions.length);
          } else {
            console.log("No new actions available");
          }
        }
      } catch (error) {
        console.error("Error fetching more actions:", error);

        // Fallback: If API call fails, just cycle back to the first action
        if (userActions.length > 0) {
          setCurrentActionIndex(0);
          setCompleted(userActions[0].completed || false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.actionContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  // Show a message if no actions are available
  if (userActions.length === 0 || !currentUserAction) {
    return (
      <View style={styles.actionContainer}>
        <BeeThemedText type="title" style={styles.actionTitle}>
          No actions available right now.
        </BeeThemedText>
      </View>
    );
  }

  return (
    <View style={styles.actionContainer}>
      <BeeThemedText type="title" style={styles.actionTitle}>
        {currentUserAction.action?.title || "Oops, no actions available"}
      </BeeThemedText>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ActionCompletionButton
          completed={completed}
          onPress={toggleActionCompletion}
        />

        <TryAnotherButton onPress={tryAnotherAction} />
      </View>
    </View>
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
});
