
import { StyleSheet, View, FlatList } from 'react-native';
import { BeeThemedView } from '@/components/BeeThemedView';
import { BeeThemedText } from '@/components/BeeThemedText';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable } from 'react-native';

// Mock data for deeds
const MOCK_DEEDS = [
  {
    id: '1',
    title: 'Compliment someone today',
    category: 'compassion',
    difficulty: 'Easy',
    completed: false,
  },
  {
    id: '2',
    title: 'Read a book for 15 minutes',
    category: 'personalGrowth',
    difficulty: 'Medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Pick up 3 pieces of litter',
    category: 'environmentalCare',
    difficulty: 'Easy',
    completed: false,
  },
  {
    id: '4',
    title: 'Call a family member',
    category: 'familyBonds',
    difficulty: 'Medium',
    completed: false,
  },
  {
    id: '5',
    title: 'Donate to a local cause',
    category: 'communityImpact',
    difficulty: 'Challenge',
    completed: false,
  },
];

export default function DailyDeedsScreen() {
  const colorScheme = useColorScheme();
  const [deeds, setDeeds] = useState(MOCK_DEEDS);

  // Toggle completion status for a deed
  const toggleDeedCompletion = (id: string) => {
    setDeeds(deeds.map(deed => 
      deed.id === id ? {...deed, completed: !deed.completed} : deed
    ));
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    return Colors[colorScheme ?? 'light'][category as keyof typeof Colors.light] || '#F6B93B';
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'seedling';
      case 'Medium': return 'tree';
      case 'Challenge': return 'mountain';
      default: return 'circle';
    }
  };

  return (
    <BeeThemedView style={styles.container}>
      <View style={styles.header}>
        <BeeThemedText type="title">Daily Good Deeds</BeeThemedText>
        <BeeThemedText type="subtitle" style={styles.subtitle}>
          Complete these to grow your bee!
        </BeeThemedText>
      </View>
      
      <FlatList
        data={deeds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => (
          <Pressable 
            style={[
              styles.deedCard,
              {backgroundColor: Colors[colorScheme ?? 'light'].cardBackground}
            ]}
            onPress={() => toggleDeedCompletion(item.id)}
          >
            <View style={styles.deedMain}>
              <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(item.category) }]} />
              <View style={styles.deedContent}>
                <BeeThemedText type="defaultSemiBold">{item.title}</BeeThemedText>
                <View style={styles.deedMeta}>
                  <FontAwesome5 
                    name={getDifficultyIcon(item.difficulty)} 
                    size={12} 
                    color={Colors[colorScheme ?? 'light'].secondaryText} 
                    style={styles.difficultyIcon}
                  />
                  <BeeThemedText type="secondary">{item.difficulty}</BeeThemedText>
                </View>
              </View>
            </View>
            <Pressable
              style={[
                styles.checkbox,
                item.completed && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={() => toggleDeedCompletion(item.id)}
            >
              {item.completed && (
                <FontAwesome5 name="check" size={16} color="#FFFFFF" />
              )}
            </Pressable>
          </Pressable>
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
  deedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
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
    borderRadius: 4,
    marginRight: 12,
  },
  deedContent: {
    flex: 1,
  },
  deedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  difficultyIcon: {
    marginRight: 4,
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
});
