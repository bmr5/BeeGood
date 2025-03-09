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
import { router } from "expo-router";
import BeeGardenAnimation from "@/components/BeeGardenAnimation";
import ShakableHive from "@/components/ShakableHive";
import * as Haptics from "expo-haptics";
import DeedCompletionButton from "@/components/DeedCompletionButton";

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

  // Navigate to stats page
  const goToStats = () => {
    // You can replace this with the actual route to your stats page
    router.push("/stats");
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Comment out the random flying bee */}
        {/* <RandomFlyingBee
          speedFactor={deed.completed ? 1.5 : 1}
          pauseDuration={3000}
        /> */}

        {/* Absolute positioned hive with shake animation */}
        <ShakableHive
          source={require("@/assets/images/hive.png")}
          style={styles.hiveIcon}
        />

        {/* Header with Streak only */}
        <View style={styles.header}>
          <Pressable style={styles.streakContainer} onPress={goToStats}>
            <BeeThemedText type="title" style={styles.streakNumber}>
              {streak}
            </BeeThemedText>
            <BeeThemedText type="secondary" style={styles.streakEmoji}>
              ✨
            </BeeThemedText>
          </Pressable>
        </View>

        {/* Main Deed Content */}
        <View style={styles.mainContent}>
          <View style={styles.deedContainer}>
            <BeeThemedText type="title" style={styles.deedTitle}>
              {deed.title}
            </BeeThemedText>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <DeedCompletionButton
                completed={deed.completed}
                onPress={toggleDeedCompletion}
              />

              <Pressable
                onPress={() => {
                  // Light haptic feedback for "Try Another"
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                  setDeed({
                    ...TODAYS_DEED,
                    title: "Help someone carry their groceries",
                  });
                }}
              >
                <BeeThemedText type="secondary">
                  I want a different deed
                </BeeThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Add the BeeGardenAnimation below the quote */}
        <View style={styles.gardenContainer}>
          <BeeGardenAnimation
            height={120}
            speedFactor={deed.completed ? 1.5 : 1}
            onBeeVisitFlower={() => {}}
          />
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
  streakNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  streakEmoji: {
    fontSize: 24,
  },
  hiveIcon: {
    width: 100,
    height: 100,
    position: "absolute",
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
  gardenContainer: {
    width: "100%",
    marginBottom: 20,
  },
});
