
import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

// Temporary deed data until we integrate with backend
const SAMPLE_DEEDS = [
  {
    id: '1',
    title: 'Send a thank you message to someone who helped you',
    category: 'Friendship',
    difficulty: 'Easy',
    color: '#4CD964', // Green
  },
  {
    id: '2',
    title: 'Pick up 3 pieces of litter in your neighborhood',
    category: 'Environmental Care',
    difficulty: 'Medium',
    color: '#5AC8FA', // Blue
  },
  {
    id: '3',
    title: 'Volunteer for 1 hour at a local organization',
    category: 'Community Impact',
    difficulty: 'Challenge',
    color: '#FF9500', // Orange
  },
];

const DifficultyBadge = ({ difficulty }) => {
  const getColor = () => {
    switch (difficulty) {
      case 'Easy': return '#4CD964';
      case 'Medium': return '#FFCC00';
      case 'Challenge': return '#FF3B30';
      default: return '#4CD964';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() }]}>
      <ThemedText style={styles.badgeText}>{difficulty}</ThemedText>
    </View>
  );
};

const DeedCard = ({ deed, onComplete }) => {
  return (
    <ThemedView style={styles.deedCard}>
      <View style={[styles.categoryIndicator, { backgroundColor: deed.color }]} />
      <View style={styles.deedContent}>
        <View style={styles.deedHeader}>
          <ThemedText style={styles.category}>{deed.category}</ThemedText>
          <DifficultyBadge difficulty={deed.difficulty} />
        </View>
        <ThemedText style={styles.deedTitle}>{deed.title}</ThemedText>
        <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(deed.id)}>
          <ThemedText style={styles.completeButtonText}>Mark as Complete</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default function TodayScreen() {
  const [completedDeeds, setCompletedDeeds] = useState<string[]>([]);

  const handleComplete = (id: string) => {
    setCompletedDeeds([...completedDeeds, id]);
    // In a real app, we would send this to the backend
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Today's Good Deeds</ThemedText>
        <ThemedText style={styles.subtitle}>Complete these to improve your bee!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.deedsList}>
        {SAMPLE_DEEDS.map((deed) => (
          <DeedCard 
            key={deed.id} 
            deed={deed} 
            onComplete={handleComplete} 
          />
        ))}
      </ThemedView>

      {completedDeeds.length > 0 && (
        <ThemedView style={styles.completedContainer}>
          <ThemedText style={styles.completedTitle}>
            <Ionicons name="checkmark-circle" size={20} color="#4CD964" /> 
            {' '}You've completed {completedDeeds.length} good deed{completedDeeds.length > 1 ? 's' : ''} today!
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  deedsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  deedCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  deedContent: {
    padding: 16,
  },
  categoryIndicator: {
    height: 8,
    width: '100%',
  },
  deedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  deedTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: '#F6B93B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  completedContainer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
