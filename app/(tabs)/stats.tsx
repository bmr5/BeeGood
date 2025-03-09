import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { BeeThemedView } from "@/components/BeeThemedView";
import { BeeCard } from "@/components/BeeCard";
import Colors from "@/constants/Colors";

export default function StatsScreen() {
  // Sample data for stats
  const stats = [
    { category: "Personal Growth", value: 76, color: "personalGrowth" },
    { category: "Family Bonds", value: 82, color: "familyBonds" },
    { category: "Friendship", value: 65, color: "friendship" },
    { category: "Community Impact", value: 58, color: "communityImpact" },
    { category: "Environmental Care", value: 70, color: "environmentalCare" },
    { category: "Compassion", value: 85, color: "compassion" },
  ];

  const overallGoodness = Math.round(
    stats.reduce((sum, stat) => sum + stat.value, 0) / stats.length
  );

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <BeeCard style={styles.overallContainer}>
            <BeeThemedText type="subtitle" style={styles.overallLabel}>
              Overall Goodness
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

          <BeeThemedText type="subtitle" style={styles.categoryHeader}>
            Categories
          </BeeThemedText>

          <View style={styles.gridContainer}>
            {stats.map((stat, index) => (
              <BeeCard key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <BeeThemedText
                    type="defaultSemiBold"
                    style={styles.categoryName}
                  >
                    {stat.category}
                  </BeeThemedText>
                  <BeeThemedText style={styles.statValue}>
                    {stat.value}
                  </BeeThemedText>
                </View>

                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${stat.value}%`,
                        backgroundColor:
                          Colors.light[stat.color as keyof typeof Colors.light],
                      },
                    ]}
                  />
                </View>

                <BeeThemedText type="secondary" style={styles.statTip}>
                  {getTipForCategory(stat.category)}
                </BeeThemedText>
              </BeeCard>
            ))}
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
    case "Community":
      return "Look for local volunteer opportunities.";
    case "Environmental":
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
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    flexShrink: 1, // Allow text to shrink if needed
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  statTip: {
    fontSize: 14,
  },
});
