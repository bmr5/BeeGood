
import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Share } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

// Sample data for stats categories
const CATEGORIES = [
  { 
    id: 'personal', 
    name: 'Personal Growth', 
    score: 68, 
    increase: 5, 
    color: '#FF2D55'  // Pink
  },
  { 
    id: 'family', 
    name: 'Family Bonds', 
    score: 72, 
    increase: 3, 
    color: '#5856D6'  // Purple
  },
  { 
    id: 'friendship', 
    name: 'Friendship', 
    score: 85, 
    increase: 7, 
    color: '#FF9500'  // Orange
  },
  { 
    id: 'community', 
    name: 'Community Impact', 
    score: 45, 
    increase: 10, 
    color: '#4CD964'  // Green
  },
  { 
    id: 'environment', 
    name: 'Environmental Care', 
    score: 62, 
    increase: 4, 
    color: '#5AC8FA'  // Blue
  },
  { 
    id: 'compassion', 
    name: 'Compassion', 
    score: 78, 
    increase: 2, 
    color: '#FFCC00'  // Yellow
  }
];

const StatBar = ({ category }) => {
  return (
    <ThemedView style={styles.statBarContainer}>
      <View style={styles.labelContainer}>
        <ThemedText style={styles.statLabel}>{category.name}</ThemedText>
        <View style={styles.scoreContainer}>
          <ThemedText style={styles.statScore}>{category.score}</ThemedText>
          <ThemedText style={styles.statIncrease}>+{category.increase}</ThemedText>
        </View>
      </View>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { 
              backgroundColor: category.color,
              width: `${category.score}%` 
            }
          ]} 
        />
      </View>
    </ThemedView>
  );
};

export default function StatsScreen() {
  // Calculate overall score as average of all categories
  const overallScore = Math.floor(
    CATEGORIES.reduce((sum, cat) => sum + cat.score, 0) / CATEGORIES.length
  );
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `🐝 My Bee Good Score: ${overallScore}! I'm making the world better one good deed at a time. #BeeGood`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.overallContainer}>
        <ThemedText style={styles.overallLabel}>Overall Goodness</ThemedText>
        <ThemedText style={styles.overallScore}>{overallScore}</ThemedText>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color="#000000" />
          <ThemedText style={styles.shareButtonText}>Share My Score</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedText style={styles.sectionTitle}>Goodness Categories</ThemedText>
        
        {CATEGORIES.map(category => (
          <StatBar key={category.id} category={category} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overallContainer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  overallLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overallScore: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#F6B93B',
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6B93B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shareButtonText: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000000',
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statBarContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  statIncrease: {
    fontSize: 12,
    color: '#4CD964',
    fontWeight: 'bold',
  },
  barBackground: {
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});
