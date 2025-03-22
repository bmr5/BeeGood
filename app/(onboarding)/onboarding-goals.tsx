import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { BeeThemedView } from "@/components/BeeThemedView";
import { HoveringBee } from "./hoveringBee";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BeePositionsEnum } from "./BeePositionsEnum";

interface GoalItem {
  id: number;
  text: string;
  icon: string;
  description: string;
}

const goals: GoalItem[] = [
  {
    id: 1,
    text: "Feel More Connected",
    icon: "hands-helping",
    description: "Build stronger relationships and deeper community bonds",
  },
  {
    id: 2,
    text: "Make a Difference",
    icon: "heart",
    description: "Create positive change in your world, big and small",
  },
  {
    id: 3,
    text: "Build Better Habits",
    icon: "seedling",
    description: "Develop consistent practices of kindness and generosity",
  },
  {
    id: 4,
    text: "Find More Joy",
    icon: "smile",
    description: "Experience more happiness from helping myself and others",
  },
];

export default function OnboardingGoals() {
  const [fadeAnims] = useState(() => goals.map(() => new Animated.Value(0)));
  const [buttonFade] = useState(new Animated.Value(0));
  const [subtitleFade] = useState(new Animated.Value(0));
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    // Animate subtitle first
    Animated.timing(subtitleFade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate items one after another
    goals.forEach((_, index) => {
      Animated.sequence([
        Animated.delay(800 + index * 400),
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Animate button after all items
    Animated.sequence([
      Animated.delay(goals.length * 400 + 1200),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Load any previously saved selections when component mounts
    const loadSavedGoals = async () => {
      try {
        const savedGoals = await AsyncStorage.getItem("userGoals");
        if (savedGoals) {
          setSelectedGoals(JSON.parse(savedGoals));
        }
      } catch (error) {
        console.error("Error loading goals data:", error);
      }
    };

    loadSavedGoals();
  }, []);

  const toggleGoal = async (goal: string) => {
    const newSelections = selectedGoals.includes(goal)
      ? selectedGoals.filter((item) => item !== goal)
      : [...selectedGoals, goal];

    setSelectedGoals(newSelections);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem("userGoals", JSON.stringify(newSelections));
    } catch (error) {
      console.error("Error saving goals data:", error);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      // Navigate to next screen
      router.push("/onboarding-living");
    }
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HoveringBee
          xPosition={BeePositionsEnum.GOALS}
          startingXPosition={BeePositionsEnum.AXES}
          yOffset={50}
        />
        <View style={styles.content}>
          <Text style={styles.title}>What do you hope to gain?</Text>

          <View style={styles.goalsContainer}>
            {goals.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.goalItem,
                  { opacity: fadeAnims[index] },
                  selectedGoals.includes(item.text) && styles.selectedGoal,
                ]}
              >
                <TouchableOpacity
                  style={styles.goalTouchable}
                  onPress={() => toggleGoal(item.text)}
                >
                  <View style={styles.iconContainer}>
                    <FontAwesome5
                      name={item.icon}
                      size={24}
                      color={
                        selectedGoals.includes(item.text)
                          ? "#FFFFFF"
                          : "#FFB800"
                      }
                    />
                  </View>
                  <View style={styles.goalContent}>
                    <Text
                      style={[
                        styles.goalText,
                        selectedGoals.includes(item.text) &&
                          styles.selectedText,
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        styles.goalDescription,
                        selectedGoals.includes(item.text) &&
                          styles.selectedText,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <Animated.View style={{ opacity: buttonFade }}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedGoals.length === 0 && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={selectedGoals.length === 0}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </BeeThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  goalsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
  },
  goalItem: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  selectedGoal: {
    backgroundColor: "#FFB800",
  },
  goalTouchable: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
