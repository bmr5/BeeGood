import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Share, useColorScheme } from 'react-native';
import { BeeThemedText } from '@/components/BeeThemedText';
import { BeeThemedView } from '@/components/BeeThemedView';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

// Define category icons mapping
const CATEGORY_ICONS = {
  personal: 'user',
  family: 'home',
  friendship: 'users',
  community: 'city',
  environment: 'leaf',
  compassion: 'heart'
};

// Sample data for stats categories
const STATS_CATEGORIES = {
  personal: { 
    name: 'Personal Growth', 
    score: 68, 
    increase: 5, 
    color: '#FF2D55'  // Pink
  },
  family: { 
    name: 'Family Bonds', 
    score: 72, 
    increase: 3, 
    color: '#5856D6'  // Purple
  },
  friendship: { 
    name: 'Friendship', 
    score: 85, 
    increase: 7, 
    color: '#FF9500'  // Orange
  },
  community: { 
    name: 'Community Impact', 
    score: 45, 
    increase: 10, 
    color: '#4CD964'  // Green
  },
  environment: { 
    name: 'Environmental Care', 
    score: 62, 
    increase: 4, 
    color: '#5AC8FA'  // Blue
  },
  compassion: { 
    name: 'Compassion', 
    score: 78, 
    increase: 2, 
    color: '#FFCC00'  // Yellow
  }
};

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const [stats, setStats] = useState(STATS_CATEGORIES);

  // Calculate overall score as average of all categories
  const overallScore = Math.floor(
    Object.values(stats).reduce((sum, cat) => sum + cat.score, 0) / Object.keys(stats).length
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
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <FontAwesome5 name="share-alt" size={20} color="#000000" />
          <BeeThemedText style={styles.shareText} darkColor="#000000">Share</BeeThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.statsContainer}>
        {Object.entries(stats).map(([category, value]) => (
          <View key={category} style={styles.statItem}>
            <View style={styles.statHeader}>
              <View style={[styles.categoryIconContainer, { backgroundColor: value.color }]}>
                <FontAwesome5 
                  name={CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || 'circle'} 
                  size={18} 
                  color="#FFFFFF" 
                  style={styles.categoryIcon}
                />
              </View>
              <BeeThemedText type="defaultSemiBold" style={styles.categoryName}>
                {value.name}
              </BeeThemedText>
              <View style={styles.scoreDisplay}>
                <BeeThemedText style={styles.scoreValue}>{value.score}</BeeThemedText>
                <BeeThemedText style={[styles.scoreIncrease, { color: value.color }]}>
                  +{value.increase}
                </BeeThemedText>
              </View>
            </View>
            <View style={styles.statBarContainer}>
              <View style={styles.statBar}>
                <View 
                  style={[
                    styles.statBarFill, 
                    { 
                      backgroundColor: value.color,
                      width: `${value.score}%` 
                    }
                  ]} 
                />
              </View>
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
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  overallScoreText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  overallScoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  overallScoreValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIcon: {
  },
  categoryName: {
    flex: 1,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  scoreIncrease: {
    fontSize: 14,
    fontWeight: '600',
  },
  statBarContainer: {
    marginLeft: 48,
  },
  statBar: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});