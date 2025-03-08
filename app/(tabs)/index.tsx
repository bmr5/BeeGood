import { StyleSheet, View } from 'react-native';
import { BeeThemedView } from '@/components/BeeThemedView';
import { BeeThemedText } from '@/components/BeeThemedText';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable } from 'react-native';

// Mock data for good deed
const TODAYS_DEED = {
  id: '1',
  title: 'Compliment someone today',
  category: 'compassion',
  completed: false,
};

export default function DailyDeedsScreen() {
  const colorScheme = useColorScheme();
  const [deed, setDeed] = useState(TODAYS_DEED);
  const [streak, setStreak] = useState(3); // Example streak value

  // Toggle completion status for deed
  const toggleDeedCompletion = () => {
    setDeed({...deed, completed: !deed.completed});
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    return Colors[colorScheme ?? 'light'][category as keyof typeof Colors.light] || '#F6B93B';
  };

  return (
    <BeeThemedView style={styles.container}>
      <View style={styles.header}>
        <BeeThemedText type="title" style={{color: '#333'}}>Daily Good</BeeThemedText>
        <BeeThemedText type="subtitle" style={[styles.subtitle, {color: '#555'}]}>
          Your little acts of kindness add up
        </BeeThemedText>
      </View>

      {/* Streak Card */}
      <View 
        style={[
          styles.streakCard,
          {backgroundColor: Colors[colorScheme ?? 'light'].cardBackground}
        ]}
      >
        <FontAwesome5 
          name="fire" 
          size={32} 
          color={Colors[colorScheme ?? 'light'].tint} 
        />
        <View style={styles.streakContent}>
          <BeeThemedText type="defaultSemiBold" style={[styles.streakValue, {color: '#333'}]}>{streak}</BeeThemedText>
          <BeeThemedText type="secondary" style={{color: '#555'}}>Day Streak</BeeThemedText>
        </View>
      </View>

      {/* Today's Deed Card */}
      <BeeThemedText type="subtitle" style={[styles.todaysLabel, {color: '#333'}]}>Today's Suggested Good Deed</BeeThemedText>

      <Pressable 
        style={[
          styles.deedCard,
          {backgroundColor: Colors[colorScheme ?? 'light'].cardBackground}
        ]}
        onPress={toggleDeedCompletion}
      >
        <View style={styles.deedMain}>
          <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(deed.category) }]} />
          <View style={styles.deedContent}>
            <BeeThemedText type="defaultSemiBold" style={[styles.deedTitle, {color: '#333'}]}>{deed.title}</BeeThemedText>
            <BeeThemedText type="secondary" style={{color: '#555'}}>
              {deed.completed ? "Completed today" : "Tap to mark as complete"}
            </BeeThemedText>
          </View>
        </View>
        <Pressable
          style={[
            styles.checkbox,
            deed.completed && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={toggleDeedCompletion}
        >
          {deed.completed && (
            <FontAwesome5 name="check" size={16} color="#FFFFFF" />
          )}
        </Pressable>
      </Pressable>

      {/* Additional content */}
      <View style={styles.inspiration}>
        <BeeThemedText type="secondary" style={[styles.inspirationText, {color: '#555'}]}>
          "The smallest act of kindness is worth more than the grandest intention."
        </BeeThemedText>
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
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakContent: {
    marginLeft: 16,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  todaysLabel: {
    marginBottom: 12,
  },
  deedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deedMain: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIndicator: {
    width: 8,
    height: '100%',
    borderRadius: 4,
    marginRight: 16,
  },
  deedContent: {
    flex: 1,
  },
  deedTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F6B93B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspiration: {
    marginTop: 'auto',
    padding: 16,
    alignItems: 'center',
  },
  inspirationText: {
    fontStyle: 'italic',
    textAlign: 'center',
  }
});