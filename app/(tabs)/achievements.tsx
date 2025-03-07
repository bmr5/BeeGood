
import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

// Sample achievements data
const ACHIEVEMENTS = [
  {
    id: 'first_deed',
    name: 'First Steps',
    description: 'Complete your first good deed',
    icon: 'footsteps',
    unlocked: true,
    color: '#4CD964'
  },
  {
    id: 'three_day_streak',
    name: 'Getting in the Groove',
    description: 'Complete at least one deed for 3 days in a row',
    icon: 'calendar',
    unlocked: true,
    color: '#5AC8FA'
  },
  {
    id: 'environmental',
    name: 'Earth Guardian',
    description: 'Complete 5 Environmental Care deeds',
    icon: 'leaf',
    unlocked: true,
    color: '#4CD964'
  },
  {
    id: 'friendship',
    name: 'True Friend',
    description: 'Complete 5 Friendship deeds',
    icon: 'people',
    unlocked: false,
    color: '#FF9500'
  },
  {
    id: 'community',
    name: 'Community Champion',
    description: 'Complete 5 Community Impact deeds',
    icon: 'home',
    unlocked: false,
    color: '#FF2D55'
  },
  {
    id: 'family',
    name: 'Family Matters',
    description: 'Complete 5 Family Bonds deeds',
    icon: 'heart',
    unlocked: false,
    color: '#5856D6'
  },
  {
    id: 'compassion',
    name: 'Heart of Gold',
    description: 'Complete 5 Compassion deeds',
    icon: 'medical',
    unlocked: false,
    color: '#FFCC00'
  },
  {
    id: 'personal',
    name: 'Self Improver',
    description: 'Complete 5 Personal Growth deeds',
    icon: 'fitness',
    unlocked: false,
    color: '#FF2D55'
  },
  {
    id: 'seven_day_streak',
    name: 'Consistency is Key',
    description: 'Complete at least one deed for 7 days in a row',
    icon: 'timer',
    unlocked: false,
    color: '#5AC8FA'
  },
  {
    id: 'fourteen_day_streak',
    name: 'Habit Formed',
    description: 'Complete at least one deed for 14 days in a row',
    icon: 'ribbon',
    unlocked: false,
    color: '#FF9500'
  },
  {
    id: 'thirty_day_streak',
    name: 'Lifestyle Change',
    description: 'Complete at least one deed for 30 days in a row',
    icon: 'trophy',
    unlocked: false,
    color: '#F6B93B'
  }
];

const AchievementBadge = ({ achievement }) => {
  return (
    <ThemedView style={[
      styles.achievementBadge, 
      achievement.unlocked ? styles.unlockedBadge : styles.lockedBadge
    ]}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: achievement.unlocked ? achievement.color : '#cccccc' }
      ]}>
        <Ionicons 
          name={achievement.icon} 
          size={28} 
          color={achievement.unlocked ? 'white' : '#888888'} 
        />
      </View>
      <View style={styles.badgeTextContainer}>
        <ThemedText style={[
          styles.badgeName,
          achievement.unlocked ? {} : styles.lockedText
        ]}>
          {achievement.name}
        </ThemedText>
        <ThemedText style={[
          styles.badgeDescription,
          achievement.unlocked ? {} : styles.lockedText
        ]}>
          {achievement.description}
        </ThemedText>
      </View>
      {achievement.unlocked && (
        <Ionicons name="checkmark-circle" size={24} color="#4CD964" style={styles.checkmark} />
      )}
    </ThemedView>
  );
};

export default function AchievementsScreen() {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Achievements</ThemedText>
        <ThemedText style={styles.subtitle}>
          You've unlocked {unlockedCount} of {ACHIEVEMENTS.length} badges
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.achievementsContainer}>
        {ACHIEVEMENTS.map(achievement => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </ThemedView>
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
  achievementsContainer: {
    padding: 16,
  },
  achievementBadge: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  unlockedBadge: {
    borderColor: 'rgba(0,0,0,0.1)',
  },
  lockedBadge: {
    borderColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  lockedText: {
    opacity: 0.5,
  },
  checkmark: {
    alignSelf: 'center',
  },
});
