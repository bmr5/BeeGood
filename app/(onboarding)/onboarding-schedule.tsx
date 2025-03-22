import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BeeThemedView } from "@/components/BeeThemedView";
import { HoveringBee } from "./hoveringBee";
import { BeePositionsEnum } from "./BeePositionsEnum";

// Redefined schedule options focusing on free time
const scheduleOptions = [
  {
    id: 1,
    label: "Early bird",
    description: "I have the most free time in the mornings",
  },
  {
    id: 2,
    label: "Afternoon breaker",
    description: "I usually have pockets of free time during the day",
  },
  {
    id: 3,
    label: "Evening warrior",
    description: "Evenings are when I can take time for myself",
  },
  {
    id: 4,
    label: "Night owl",
    description: "Late nights are my most productive free hours",
  },
  {
    id: 5,
    label: "Unpredictable",
    description: "My free time varies day-to-day",
  },
];

export default function OnboardingScheduleScreen() {
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: number;
    label: string;
    description: string;
  } | null>(null);

  const [fadeAnims] = useState(() =>
    scheduleOptions.map(() => new Animated.Value(0))
  );
  const [subtitleFade] = useState(new Animated.Value(0));

  // Load any previously saved selection when component mounts
  useEffect(() => {
    // Animate subtitle first
    Animated.timing(subtitleFade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate items one after another
    scheduleOptions.forEach((_, index) => {
      Animated.sequence([
        Animated.delay(600 + index * 300),
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const loadSavedSchedule = async () => {
      try {
        const savedSchedule = await AsyncStorage.getItem("userSchedule");
        if (savedSchedule) {
          setSelectedSchedule(JSON.parse(savedSchedule));
        }
      } catch (error) {
        console.error("Error loading schedule data:", error);
      }
    };

    loadSavedSchedule();
  }, []);

  const handleSelection = async (schedule: {
    id: number;
    label: string;
    description: string;
  }) => {
    setSelectedSchedule(schedule);

    try {
      await AsyncStorage.setItem("userSchedule", JSON.stringify(schedule));
    } catch (error) {
      console.error("Error saving schedule data:", error);
    }
  };

  const handleNext = () => {
    if (selectedSchedule) {
      // Navigate to the next screen - adjust this as needed
      router.push("/onboarding-axes");
    }
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HoveringBee
          xPosition={BeePositionsEnum.SCHEDULE}
          startingXPosition={BeePositionsEnum.OVERVIEW}
          yOffset={40}
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>When do you have free time?</Text>
            <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
              We'll suggest activities that fit your schedule
            </Animated.Text>
          </View>

          <View style={styles.optionsContainer}>
            {scheduleOptions.map((option, index) => (
              <Animated.View
                key={option.id}
                style={{ opacity: fadeAnims[index] }}
              >
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedSchedule?.id === option.id && styles.selectedOption,
                  ]}
                  onPress={() => handleSelection(option)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedSchedule?.id === option.id &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        selectedSchedule?.id === option.id &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                !selectedSchedule && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={!selectedSchedule}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BeeThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionButton: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  optionContent: {
    flexDirection: "column",
  },
  selectedOption: {
    backgroundColor: "#FFB800",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  selectedOptionText: {
    color: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: "auto",
  },
  button: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
