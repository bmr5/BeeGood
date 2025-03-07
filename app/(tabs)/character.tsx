import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { BeeThemedText } from '@/components/BeeThemedText';
import { BeeThemedView } from '@/components/BeeThemedView';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

// Sample bee character stages
const BEE_STAGES = [
  {
    id: 'stage1',
    name: 'Baby Bee',
    description: 'Just starting out on your journey of goodness!',
    requiredDeeds: 0,
    imagePlaceholder: '🐝' // Using emoji as placeholder for actual image
  },
  {
    id: 'stage2',
    name: 'Worker Bee',
    description: 'Growing stronger through consistent good deeds!',
    requiredDeeds: 10,
    imagePlaceholder: '🐝✨' // Using emoji as placeholder for actual image
  },
  {
    id: 'stage3',
    name: 'Queen Bee',
    description: 'A true champion of goodness! Your influence is growing.',
    requiredDeeds: 25,
    imagePlaceholder: '👑🐝' // Using emoji as placeholder for actual image
  }
];

export default function CharacterScreen() {
  const colorScheme = useColorScheme();
  const [completedDeeds, setCompletedDeeds] = useState(12); // Example value

  // Determine current bee stage
  const currentStage = BEE_STAGES.reduce((prev, current) => {
    return (completedDeeds >= current.requiredDeeds) ? current : prev;
  });

  // Find next stage if there is one
  const currentIndex = BEE_STAGES.findIndex(stage => stage.id === currentStage.id);
  const nextStage = currentIndex < BEE_STAGES.length - 1 ? BEE_STAGES[currentIndex + 1] : null;

  // Calculate progress to next stage
  const progressToNext = nextStage 
    ? Math.min(100, ((completedDeeds - currentStage.requiredDeeds) / (nextStage.requiredDeeds - currentStage.requiredDeeds)) * 100)
    : 100;

  return (
    <BeeThemedView style={styles.container}>
      <View style={styles.header}>
        <BeeThemedText type="title">Your Bee</BeeThemedText>
        <BeeThemedText type="subtitle" style={styles.subtitle}>
          {currentStage.name}
        </BeeThemedText>
      </View>

      <View style={styles.characterContainer}>
        <View style={styles.beeBubble}>
          <BeeThemedText style={styles.beeEmoji}>{currentStage.imagePlaceholder}</BeeThemedText>
        </View>

        <BeeThemedText type="defaultSemiBold">{currentStage.name}</BeeThemedText>
        <BeeThemedText type="secondary" style={styles.beeDescription}>{currentStage.description}</BeeThemedText>

        {nextStage && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressToNext}%` }]} />
            </View>
            <BeeThemedText type="secondary" style={styles.progressText}>
              {completedDeeds} / {nextStage.requiredDeeds} deeds to evolve
            </BeeThemedText>
          </View>
        )}
      </View>

      <View style={[
        styles.statsCard,
        {backgroundColor: Colors[colorScheme ?? 'light'].cardBackground}
      ]}>
        <BeeThemedText type="defaultSemiBold" style={styles.statsTitle}>
          Character Stats
        </BeeThemedText>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <FontAwesome5 
              name="trophy" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <BeeThemedText type="secondary" style={styles.statLabel}>Level</BeeThemedText>
            <BeeThemedText style={styles.statValue}>2</BeeThemedText>
          </View>

          <View style={styles.statItem}>
            <FontAwesome5 
              name="calendar-check" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <BeeThemedText type="secondary" style={styles.statLabel}>Deeds</BeeThemedText>
            <BeeThemedText style={styles.statValue}>{completedDeeds}</BeeThemedText>
          </View>

          <View style={styles.statItem}>
            <FontAwesome5 
              name="fire" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <BeeThemedText type="secondary" style={styles.statLabel}>Day Streak</BeeThemedText>
            <BeeThemedText style={styles.statValue}>3</BeeThemedText>
          </View>

          <View style={styles.statItem}>
            <FontAwesome5 
              name="medal" 
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <BeeThemedText type="secondary" style={styles.statLabel}>Achievements</BeeThemedText>
            <BeeThemedText style={styles.statValue}>6</BeeThemedText>
          </View>
        </View>
      </View>
    </BeeThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.8,
  },
  characterContainer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
    borderRadius: 16,
  },
  beeBubble: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF2CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#F6B93B',
  },
  beeEmoji: {
    fontSize: 80,
  },
  beeDescription: {
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    width: '80%',
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F6B93B',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statLabel: {
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '600',
  },
});