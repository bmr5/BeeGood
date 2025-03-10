import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { useUserStore } from "@/stores/useUserStore";
import { router } from "expo-router";

export default function StreakButton() {
  // Get streak from user profile in the store
  const user = useUserStore((state) => state.user);
  const streak = user?.streak_count || 0;

  // Handle navigation to stats page
  const goToStats = () => {
    router.push("/stats");
  };

  return (
    <Pressable style={styles.streakContainer} onPress={goToStats}>
      <BeeThemedText type="title" style={styles.streakNumber}>
        {streak}
      </BeeThemedText>
      <BeeThemedText type="secondary" style={styles.streakEmoji}>
        ✨
      </BeeThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  streakEmoji: {
    fontSize: 24,
  },
});
