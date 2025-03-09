import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  SafeAreaView,
  Image,
} from "react-native";
import { BeeThemedView } from "@/components/BeeThemedView";
import { BeeThemedText } from "@/components/BeeThemedText";
import { useState } from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import RandomFlyingBee from "@/components/RandomFlyingBee";

// Mock data for good deed
const TODAYS_DEED = {
  id: "1",
  title: "Call mom today, let her know I love her",
  category: "general",
  completed: false,
};

export default function DailyDeedsScreen() {
  const [deed, setDeed] = useState(TODAYS_DEED);
  const [streak, setStreak] = useState(3);

  // Toggle completion status for deed
  const toggleDeedCompletion = () => {
    setDeed({ ...deed, completed: !deed.completed });
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Add the random flying bee */}
        <RandomFlyingBee
          speedFactor={deed.completed ? 1.5 : 1}
          pauseDuration={3000}
        />

        {/* Absolute positioned hive */}
        <Image
          source={require("@/assets/images/hive.png")}
          style={styles.hiveIcon}
          resizeMode="contain"
        />

        {/* Header with Streak only */}
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <BeeThemedText type="secondary" style={styles.streakText}>
              ✨ {streak} day streak
            </BeeThemedText>
          </View>
        </View>

        {/* Main Deed Content */}
        <View style={styles.mainContent}>
          <View style={styles.deedContainer}>
            <View style={styles.categoryPill}>
              <BeeThemedText type="secondary" style={styles.categoryText}>
                {deed.category.charAt(0).toUpperCase() + deed.category.slice(1)}
              </BeeThemedText>
            </View>

            <BeeThemedText type="title" style={styles.deedTitle}>
              {deed.title}
            </BeeThemedText>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable
                style={[
                  styles.completeButton,
                  deed.completed && styles.completedButton,
                ]}
                onPress={toggleDeedCompletion}
              >
                <BeeThemedText type="defaultSemiBold" style={styles.buttonText}>
                  {deed.completed ? "Completed!" : "Complete Deed"}
                </BeeThemedText>
              </Pressable>

              <Pressable
                onPress={() =>
                  setDeed({
                    ...TODAYS_DEED,
                    title: "Help someone carry their groceries",
                  })
                }
              >
                <BeeThemedText type="secondary" style={styles.tryAnotherText}>
                  Try Another
                </BeeThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Inspirational Quote */}
        <View style={styles.quoteContainer}>
          <BeeThemedText type="secondary" style={styles.quoteText}>
            "The smallest act of kindness is worth more than the grandest
            intention."
          </BeeThemedText>
        </View>
      </SafeAreaView>
    </BeeThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: 18,
    opacity: 0.7,
  },
  hiveIcon: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 45,
    right: 0,
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deedContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: -40, // This helps offset the spacing from header/footer
  },
  categoryPill: {
    backgroundColor: "rgba(246, 185, 59, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryText: {
    color: "#F6B93B",
    fontSize: 14,
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
  completeButton: {
    backgroundColor: "#F6B93B",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  tryAnotherText: {
    color: "#F6B93B",
    fontSize: 16,
  },
  quoteContainer: {
    padding: 24,
    borderRadius: 16,
    marginTop: "auto",
    marginBottom: 24,
  },
  quoteText: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 24,
  },
});
