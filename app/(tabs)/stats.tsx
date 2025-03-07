
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
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { BeeThemedView } from '@/components/BeeThemedView';
import { BeeThemedText } from '@/components/BeeThemedText';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

// Mock stats data
const INITIAL_STATS = {
  personalGrowth: 65,
  familyBonds: 42,
  friendship: 78,
  communityImpact: 31,
  environmentalCare: 59,
  compassion: 83,
};

const CATEGORY_ICONS = {
  personalGrowth: 'brain',
  familyBonds: 'home',
  friendship: 'user-friends',
  communityImpact: 'hands-helping',
  environmentalCare: 'leaf',
  compassion: 'heart',
};

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const [stats, setStats] = useState(INITIAL_STATS);
  
  // Calculate overall goodness score (average of all stats)
  const overallScore = Math.round(
    Object.values(stats).reduce((sum, val) => sum + val, 0) / Object.values(stats).length
  );

  // Get human readable category name
  const getCategoryName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <BeeThemedView style={styles.container}>
      <View style={styles.header}>
        <BeeThemedText type="title">Your Goodness Stats</BeeThemedText>
      </View>
      
      <View style={[
        styles.overallScoreCard, 
        {backgroundColor: Colors[colorScheme ?? 'light'].tint}
      ]}>
        <BeeThemedText style={styles.overallScoreText} darkColor="#000000">
          Overall Goodness
        </BeeThemedText>
        <View style={styles.overallScoreCircle}>
          <BeeThemedText style={styles.overallScoreValue} darkColor="#000000">
            {overallScore}
          </BeeThemedText>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <FontAwesome5 name="share-alt" size={20} color="#000000" />
          <BeeThemedText style={styles.shareText} darkColor="#000000">Share</BeeThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.statsContainer}>
        {Object.entries(stats).map(([category, value]) => (
          <View key={category} style={styles.statItem}>
            <View style={styles.statHeader}>
              <View style={styles.categoryIconContainer}>
                <FontAwesome5 
                  name={CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || 'circle'} 
                  size={18} 
                  color="#FFFFFF" 
                  style={styles.categoryIcon}
                />
              </View>
              <BeeThemedText type="defaultSemiBold">
                {getCategoryName(category)}
              </BeeThemedText>
              <BeeThemedText style={{marginLeft: 'auto'}}>
                {value}/100
              </BeeThemedText>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  {
                    width: `${value}%`, 
                    backgroundColor: Colors[colorScheme ?? 'light'][category as keyof typeof Colors.light]
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </ScrollView>
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
  overallScoreCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  overallScoreText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  overallScoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  overallScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  statsContainer: {
    flex: 1,
  },
  statItem: {
    marginBottom: 20,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F6B93B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryIcon: {},
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});
