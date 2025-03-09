import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  SafeAreaView,
} from "react-native";
import { BeeThemedView } from "@/components/BeeThemedView";
import { BeeThemedText } from "@/components/BeeThemedText";
import { useState } from "react";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome5 } from "@expo/vector-icons";
import BeeGardenAnimation from "@/components/BeeGardenAnimation";

// Mock data for good deed
const TODAYS_DEED = {
  id: "1",
  title: "Call mom today, let her know I love her",
  category: "general",
  completed: false,
};

export default function DailyDeedsScreen() {
  const colorScheme = useColorScheme();
  const [deed, setDeed] = useState(TODAYS_DEED);
  const [streak, setStreak] = useState(3);

  // Toggle completion status for deed
  const toggleDeedCompletion = () => {
    setDeed({ ...deed, completed: !deed.completed });
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    return (
      Colors[colorScheme ?? "light"][category as keyof typeof Colors.light] ||
      "#F6B93B"
    );
  };

  return (
    <BeeThemedView style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        {/* Header with Crown and Streak */}
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <BeeThemedText type="secondary" style={styles.streakText}>
              ✨ {streak} day streak
            </BeeThemedText>
          </View>
          <FontAwesome5
            name="crown"
            size={24}
            color={Colors[colorScheme ?? "light"].tint}
          />
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
      </SafeAreaView>

      {/* Full-width container for bee animation - now positioned after the deed content */}
      <View style={styles.beeAnimationWrapper}>
        <BeeGardenAnimation
          height={120}
          speedFactor={deed.completed ? 2 : 1}
          onBeeVisitFlower={() => {
            // Optional: Add haptic feedback or sound effect when bee visits a flower
          }}
        />
      </View>

      <SafeAreaView style={styles.bottomContainer}>
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
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0, // Remove bottom padding to make room for bee animation
  },
  bottomContainer: {
    padding: 16,
    paddingTop: 0, // Remove top padding since it follows the bee animation
  },
  beeAnimationWrapper: {
    width: "100%",
    height: 120,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: "transparent",
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
