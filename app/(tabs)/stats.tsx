import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { BeeThemedView } from "@/components/BeeThemedView";
import { BeeCard } from "@/components/BeeCard";
import Colors from "@/constants/Colors";

// Define interfaces for our stat types
interface Stat {
  category: string;
  value: number;
  color: string;
}

interface PotentialStat extends Stat {
  differential: number;
  potentialValue: number;
}

export default function StatsScreen() {
  // Add state for the selected filter
  const [selectedFilter, setSelectedFilter] = useState("current");

  // Updated categories for stats with Friends and Family first
  const stats = [
    { category: "Friends", value: 65, color: "friendship" },
    { category: "Family", value: 70, color: "compassion" },
    { category: "Positivity", value: 76, color: "personalGrowth" },
    { category: "Body", value: 82, color: "familyBonds" },
    { category: "Community", value: 58, color: "communityImpact" },
    { category: "Kindness", value: 73, color: "environmentalCare" },
  ];

  // Generate potential differentials to reach 90-98 range
  const statsWithPotential = stats.map((stat) => {
    // Calculate how much to add to reach a value between 90-98
    const targetValue = Math.floor(Math.random() * 9) + 90; // Random number between 90-98
    const differential = targetValue - stat.value;
    return {
      ...stat,
      differential: differential,
      potentialValue: stat.value + differential,
    };
  }) as PotentialStat[];

  // Calculate overall goodness based on the selected filter
  const overallGoodness = Math.round(
    selectedFilter === "potential"
      ? statsWithPotential.reduce((sum, stat) => sum + stat.potentialValue, 0) /
          statsWithPotential.length
      : stats.reduce((sum, stat) => sum + stat.value, 0) / stats.length
  );

  // Function to handle filter button press
  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <BeeThemedView style={styles.container}>
      {/* Add hanging flowers at the top */}
      <Image
        source={require("@/assets/images/hanging-flowers.png")}
        style={styles.hangingFlowers}
        resizeMode="stretch"
      />

      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <BeeCard style={styles.overallContainer}>
            <BeeThemedText type="subtitle" style={styles.overallLabel}>
              Good Rating
            </BeeThemedText>
            <View style={styles.overallScoreContainer}>
              <BeeThemedText style={styles.overallScore}>
                {overallGoodness}
              </BeeThemedText>
            </View>
            <BeeThemedText style={styles.overallDescription}>
              Your rating is based on your daily good deeds, increasing your
              rating over time.
            </BeeThemedText>
          </BeeCard>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.filterButton,
                selectedFilter === "current" && styles.activeButton,
              ]}
              onPress={() => handleFilterPress("current")}
            >
              <BeeThemedText
                style={[
                  styles.buttonText,
                  selectedFilter === "current" && styles.activeButtonText,
                ]}
              >
                Current Rating
              </BeeThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                selectedFilter === "potential" && styles.activeButton,
              ]}
              onPress={() => handleFilterPress("potential")}
            >
              <BeeThemedText
                style={[
                  styles.buttonText,
                  selectedFilter === "potential" && styles.activeButtonText,
                ]}
              >
                Potential
              </BeeThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                selectedFilter === "day1" && styles.activeButton,
              ]}
              onPress={() => handleFilterPress("day1")}
            >
              <BeeThemedText
                style={[
                  styles.buttonText,
                  selectedFilter === "day1" && styles.activeButtonText,
                ]}
              >
                Day 1 Rating
              </BeeThemedText>
            </Pressable>
          </View>

          <View style={styles.gridContainer}>
            {(selectedFilter === "potential" ? statsWithPotential : stats).map(
              (stat, index) => {
                // Use type assertion to handle both stat types
                const statItem =
                  selectedFilter === "potential"
                    ? (stat as PotentialStat)
                    : (stat as Stat);

                return (
                  <BeeCard key={index} style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View style={styles.titleContainer}>
                        <View
                          style={[
                            styles.categoryIcon,
                            {
                              backgroundColor:
                                Colors.light[
                                  statItem.color as keyof typeof Colors.light
                                ],
                            },
                          ]}
                        >
                          <BeeThemedText style={styles.iconText}>
                            {statItem.category.charAt(0)}
                          </BeeThemedText>
                        </View>
                        <BeeThemedText
                          type="defaultSemiBold"
                          style={styles.categoryName}
                        >
                          {statItem.category}
                        </BeeThemedText>
                      </View>
                    </View>

                    <View style={styles.scoreRow}>
                      <BeeThemedText style={styles.statValue}>
                        {selectedFilter === "potential"
                          ? (statItem as PotentialStat).potentialValue
                          : statItem.value}
                      </BeeThemedText>
                      {selectedFilter === "potential" && (
                        <BeeThemedText style={styles.differential}>
                          +{(statItem as PotentialStat).differential}
                        </BeeThemedText>
                      )}
                    </View>

                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${
                              selectedFilter === "potential"
                                ? (statItem as PotentialStat).potentialValue
                                : statItem.value
                            }%`,
                            backgroundColor:
                              Colors.light[
                                statItem.color as keyof typeof Colors.light
                              ],
                          },
                        ]}
                      />
                    </View>
                  </BeeCard>
                );
              }
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </BeeThemedView>
  );
}

function getTipForCategory(category: string): string {
  switch (category) {
    case "Personal Growth":
      return "Try learning something new this week!";
    case "Family Bonds":
      return "Consider calling a family member you haven't spoken to recently.";
    case "Friendship":
      return "Reach out to a friend who might need support.";
    case "Community Impact":
      return "Look for local volunteer opportunities.";
    case "Environmental Care":
      return "Try reducing plastic usage this week.";
    case "Compassion":
      return "Small acts of kindness make a big difference!";
    default:
      return "Keep doing good deeds!";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hangingFlowers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 120, // Adjust height as needed based on your asset
    zIndex: 10, // Ensure it appears above other elements
    resizeMode: "stretch", // Force stretching to fill the width
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  overallContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  overallLabel: {
    marginBottom: 10,
  },
  overallScoreContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFD166",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  overallScore: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  overallDescription: {
    textAlign: "center",
    marginTop: 10,
  },
  categoryHeader: {
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%", // Just under 50% to account for spacing
    marginBottom: 16,
    padding: 12, // Add some padding inside the card
  },
  statHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  categoryName: {
    fontSize: 14,
    flexShrink: 1, // Allow text to shrink if needed
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 8, // Made slightly smaller
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    marginBottom: 0, // Removed bottom margin since we removed the tip
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: Colors.light.tint,
  },
  buttonText: {
    fontSize: 12,
    textAlign: "center",
  },
  activeButtonText: {
    color: "white",
  },
  differential: {
    fontSize: 14,
    color: "#4CAF50", // Green color for positive differential
    marginLeft: 6,
    fontWeight: "bold",
  },
});
