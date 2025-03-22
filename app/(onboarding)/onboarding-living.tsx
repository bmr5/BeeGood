import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { BeeThemedView } from "@/components/BeeThemedView";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { HoveringBee } from "./hoveringBee";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BeePositionsEnum } from "./BeePositionsEnum";

export default function OnboardingLivingScreen() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Load any previously saved selections when component mounts
  useEffect(() => {
    const loadSavedSelections = async () => {
      try {
        const savedSelections = await AsyncStorage.getItem(
          "userLivingSituation"
        );
        if (savedSelections) {
          setSelectedOptions(JSON.parse(savedSelections));
        }
      } catch (error) {
        console.error("Error loading living situation data:", error);
      }
    };

    loadSavedSelections();
  }, []);

  const livingOptions = [
    "Living alone",
    "Living with roommates",
    "Living with partner",
    "Living with family",
    "Living with children",
    "Other",
  ];

  const toggleOption = async (option: string) => {
    const newSelections = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newSelections);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(
        "userLivingSituation",
        JSON.stringify(newSelections)
      );
    } catch (error) {
      console.error("Error saving living situation data:", error);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      router.push("/onboarding-how-it-works");
    }
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HoveringBee
          xPosition={BeePositionsEnum.LIVING}
          startingXPosition={BeePositionsEnum.GOALS}
          yOffset={35}
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <BeeThemedText type="title" style={styles.title}>
              What's your living situation?
            </BeeThemedText>
            <BeeThemedText style={styles.subtitle}>
              Select all that apply
            </BeeThemedText>
          </View>

          <View style={styles.optionsContainer}>
            {livingOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedOptions.includes(option) && styles.selectedOption,
                ]}
                onPress={() => toggleOption(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedOptions.length === 0 && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={selectedOptions.length === 0}
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
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionButton: {
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  selectedOption: {
    backgroundColor: "#FFB800",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
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
    marginTop: 30,
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
