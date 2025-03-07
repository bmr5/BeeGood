import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { BeeThemedText } from '@/components/BeeThemedText';
import { BeeThemedView } from '@/components/BeeThemedView';
import Colors from '@/constants/Colors';

export default function StatsScreen() {
  // Sample data for stats
  const stats = [
    { category: 'Personal Growth', value: 76, color: 'personalGrowth' },
    { category: 'Family Bonds', value: 82, color: 'familyBonds' },
    { category: 'Friendship', value: 65, color: 'friendship' },
    { category: 'Community Impact', value: 58, color: 'communityImpact' },
    { category: 'Environmental Care', value: 70, color: 'environmentalCare' },
    { category: 'Compassion', value: 85, color: 'compassion' },
  ];

  const overallGoodness = Math.round(
    stats.reduce((sum, stat) => sum + stat.value, 0) / stats.length
  );

  return (
    <BeeThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <BeeThemedText type="title" style={styles.header}>Your Goodness Stats</BeeThemedText>

        <BeeThemedView style={styles.overallContainer}>
          <BeeThemedText type="subtitle" style={styles.overallLabel}>Overall Goodness</BeeThemedText>
          <View style={styles.overallScoreContainer}>
            <BeeThemedText style={styles.overallScore}>{overallGoodness}</BeeThemedText>
          </View>
          <BeeThemedText style={styles.overallDescription}>
            Keep up the great work with your daily good deeds!
          </BeeThemedText>
        </BeeThemedView>

        <BeeThemedText type="subtitle" style={styles.categoryHeader}>Categories</BeeThemedText>

        {stats.map((stat, index) => (
          <BeeThemedView key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <BeeThemedText type="defaultSemiBold" style={styles.categoryName}>
                {stat.category}
              </BeeThemedText>
              <BeeThemedText style={styles.statValue}>{stat.value}</BeeThemedText>
            </View>

            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${stat.value}%`,
                    backgroundColor: Colors.light[stat.color as keyof typeof Colors.light]
                  }
                ]} 
              />
            </View>

            <BeeThemedText type="secondary" style={styles.statTip}>
              {getTipForCategory(stat.category)}
            </BeeThemedText>
          </BeeThemedView>
        ))}
      </ScrollView>
    </BeeThemedView>
  );
}

function getTipForCategory(category: string): string {
  switch (category) {
    case 'Personal Growth':
      return 'Try learning something new this week!';
    case 'Family Bonds':
      return 'Consider calling a family member you haven\'t spoken to recently.';
    case 'Friendship':
      return 'Reach out to a friend who might need support.';
    case 'Community Impact':
      return 'Look for local volunteer opportunities.';
    case 'Environmental Care':
      return 'Try reducing plastic usage this week.';
    case 'Compassion':
      return 'Small acts of kindness make a big difference!';
    default:
      return 'Keep doing good deeds!';
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
    textAlign: 'center',
  },
  overallContainer: {
    backgroundColor: '#FFFCF5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  overallLabel: {
    marginBottom: 10,
  },
  overallScoreContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD166',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  overallScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  overallDescription: {
    textAlign: 'center',
    marginTop: 10,
  },
  categoryHeader: {
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#FFFCF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  statTip: {
    fontSize: 14,
  },
});