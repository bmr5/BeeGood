
import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
    <View style={styles.container}>
      <ThemedView style={styles.characterContainer}>
        <View style={styles.beeBubble}>
          <ThemedText style={styles.beeEmoji}>{currentStage.imagePlaceholder}</ThemedText>
        </View>
        
        <ThemedText style={styles.beeName}>{currentStage.name}</ThemedText>
        <ThemedText style={styles.beeDescription}>{currentStage.description}</ThemedText>
        
        {nextStage && (
          <ThemedView style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressToNext}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>
              {completedDeeds} / {nextStage.requiredDeeds} deeds to evolve
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      
      <ThemedView style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{completedDeeds}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Good Deeds</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>3</ThemedText>
          <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>6</ThemedText>
          <ThemedText style={styles.statLabel}>Achievements</ThemedText>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  beeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  beeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F6B93B',
  },
  statLabel: {
    fontSize: 14,
  },
});
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { BeeThemedView } from '@/components/BeeThemedView';
import { BeeThemedText } from '@/components/BeeThemedText';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function CharacterScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <BeeThemedView style={styles.container}>
      <View style={styles.header}>
        <BeeThemedText type="title">Your Bee</BeeThemedText>
        <BeeThemedText type="subtitle" style={styles.subtitle}>
          Level 2: Worker Bee
        </BeeThemedText>
      </View>
      
      <View style={styles.characterContainer}>
        <Image 
          source={require('@/assets/images/bee-icon.png')}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.statsContainer}>
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
              <BeeThemedText type="secondary" style={styles.statLabel}>Deeds Done</BeeThemedText>
              <BeeThemedText style={styles.statValue}>17</BeeThemedText>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome5 
                name="fire" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].tint} 
              />
              <BeeThemedText type="secondary" style={styles.statLabel}>Streak</BeeThemedText>
              <BeeThemedText style={styles.statValue}>5 days</BeeThemedText>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome5 
                name="star" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].tint} 
              />
              <BeeThemedText type="secondary" style={styles.statLabel}>XP to Level 3</BeeThemedText>
              <BeeThemedText style={styles.statValue}>23 / 50</BeeThemedText>
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.evolveButton,
          {backgroundColor: Colors[colorScheme ?? 'light'].tint}
        ]}
      >
        <FontAwesome5 name="arrow-up" size={16} color="#000000" />
        <BeeThemedText style={styles.evolveButtonText} darkColor="#000000">
          Needs 27 more XP to evolve
        </BeeThemedText>
      </TouchableOpacity>
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
    justifyContent: 'center',
    height: 200,
    marginBottom: 24,
  },
  characterImage: {
    width: 150,
    height: 150,
  },
  statsContainer: {
    marginBottom: 24,
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
  evolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  evolveButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
});
