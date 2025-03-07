import React from 'react';
import { StyleSheet, View, FlatList, useColorScheme } from 'react-native';
import { BeeThemedText } from '@/components/BeeThemedText';
import { BeeThemedView } from '@/components/BeeThemedView';
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

// Sample achievements data
const ACHIEVEMENTS = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Complete your first good deed',
    icon: 'shoe-prints',
    unlocked: true,
  },
  {
    id: 'a2',
    title: 'Helping Hand',
    description: 'Complete 5 good deeds',
    icon: 'hands-helping',
    unlocked: true,
  },
  {
    id: 'a3',
    title: 'Kindness Warrior',
    description: 'Complete 10 good deeds',
    icon: 'hand-peace',
    unlocked: true,
  },
  {
    id: 'a4',
    title: 'Week Streak',
    description: 'Complete a good deed every day for 7 days',
    icon: 'calendar-week',
    unlocked: true,
  },
  {
    id: 'a5',
    title: 'Month Streak',
    description: 'Complete a good deed every day for 30 days',
    icon: 'calendar-alt',
    unlocked: false,
  },
  {
    id: 'a6',
    title: 'Environmental Hero',
    description: 'Complete 5 environmental good deeds',
    icon: 'leaf',
    unlocked: true,
  },
  {
    id: 'a7',
    title: 'Community Champion',
    description: 'Complete 5 community good deeds',
    icon: 'users',
    unlocked: true,
  },
  {
    id: 'a8',
    title: 'Family First',
    description: 'Complete 5 family good deeds',
    icon: 'home',
    unlocked: false,
  },
  {
    id: 'a9',
    title: 'Friendship Goals',
    description: 'Complete 5 friendship good deeds',
    icon: 'user-friends',
    unlocked: false,
  },
  {
    id: 'a10',
    title: 'Self-Care Master',
    description: 'Complete 5 personal growth good deeds',
    icon: 'heartbeat',
    unlocked: false,
  },
];

export default function AchievementsScreen() {
  const colorScheme = useColorScheme();
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <BeeThemedView style={styles.container}>
      <View style={styles.header}>
        <BeeThemedText type="title">Achievements</BeeThemedText>
        <BeeThemedText type="subtitle" style={styles.subtitle}>
          {unlockedCount} / {ACHIEVEMENTS.length} Unlocked
        </BeeThemedText>
      </View>

      <FlatList
        data={ACHIEVEMENTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => (
          <View style={styles.achievementContainer}>
            <View 
              style={[
                styles.achievementCard,
                {
                  backgroundColor: item.unlocked 
                    ? Colors[colorScheme ?? 'light'].tint 
                    : Colors[colorScheme ?? 'light'].cardBackground,
                  opacity: item.unlocked ? 1 : 0.7,
                }
              ]}
            >
              <FontAwesome5 
                name={item.icon} 
                size={32} 
                color={item.unlocked ? '#000000' : Colors[colorScheme ?? 'light'].text} 
                style={styles.achievementIcon}
              />

              <BeeThemedText 
                type="defaultSemiBold"
                style={[
                  styles.achievementTitle,
                  {color: item.unlocked ? '#000000' : Colors[colorScheme ?? 'light'].text}
                ]}
              >
                {item.title}
              </BeeThemedText>

              <BeeThemedText 
                type="secondary"
                style={[
                  styles.achievementDescription,
                  {color: item.unlocked ? '#000000' : Colors[colorScheme ?? 'light'].text}
                ]}
              >
                {item.description}
              </BeeThemedText>
            </View>
          </View>
        )}
      />
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
  listContainer: {
    paddingBottom: 40,
  },
  achievementContainer: {
    width: '50%',
    padding: 8,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    textAlign: 'center',
    fontSize: 12,
  },
});