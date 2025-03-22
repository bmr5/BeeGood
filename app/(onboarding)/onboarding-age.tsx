import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BeeThemedView } from "@/components/BeeThemedView";
import { Animated } from "react-native";
import { HoveringBee } from "./hoveringBee";
import { BeePositionsEnum } from "./BeePositionsEnum";

// Type definition for age ranges
type AgeRange =
  | "Under 13"
  | "13-17"
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-64"
  | "65+";

const ageRanges = [
  { id: 1, label: "13-17" },
  { id: 2, label: "18-25" },
  { id: 3, label: "26-34" },
  { id: 4, label: "35-50" },
  { id: 5, label: "50+" },
];

export default function OnboardingAge() {
  const [fadeAnims] = useState(() =>
    ageRanges.map(() => new Animated.Value(0))
  );
  const [subtitleFade] = useState(new Animated.Value(0));
  const beeHover = useRef(new Animated.Value(0)).current;
  const [selectedAge, setSelectedAge] = useState<{
    id: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    // Animate subtitle first (kept at 1200 for smooth intro)
    Animated.timing(subtitleFade, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Animate items one after another with shorter delays
    ageRanges.forEach((_, index) => {
      Animated.sequence([
        Animated.delay(800 + index * 400), // Reduced from 1200 + 1500 to 800 + 400
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 800, // Reduced from 1200 to 800
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const handleSelection = async (ageRange: { id: number; label: string }) => {
    try {
      // Update local state
      setSelectedAge(ageRange);

      // Save to AsyncStorage
      await AsyncStorage.setItem("userAge", JSON.stringify(ageRange));

      // Verify the save was successful by reading it back
      const savedAge = await AsyncStorage.getItem("userAge");
      if (!savedAge) {
        throw new Error("Failed to save age range");
      }

      // Optional: Verify the saved data matches what we tried to save
      const parsedSavedAge = JSON.parse(savedAge);
      if (
        parsedSavedAge.id !== ageRange.id ||
        parsedSavedAge.label !== ageRange.label
      ) {
        throw new Error("Saved age range does not match selected age range");
      }
    } catch (error) {
      console.error("Error handling age selection:", error);
      // You might want to show an error message to the user here
      // and/or reset the selection
      setSelectedAge(null);
    }
  };

  const handleNext = async () => {
    if (selectedAge) {
      try {
        // Verify the age is saved before proceeding
        const savedAge = await AsyncStorage.getItem("userAge");
        if (!savedAge) {
          throw new Error("Age not found in storage");
        }

        // If we get here, the age is saved and we can proceed
        router.push("./onboarding-axes");
      } catch (error) {
        console.error("Error verifying saved age:", error);
        // Optionally show an error message to the user
        // and/or prevent navigation
      }
    }
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HoveringBee xPosition={BeePositionsEnum.AGE} />
        <View style={styles.content}>
          <Text style={styles.title}>What's your age range?</Text>
          <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
            This helps us customize your experience
          </Animated.Text>

          <View style={styles.optionsContainer}>
            {ageRanges.map((range, index) => (
              <Animated.View
                key={range.id}
                style={{ opacity: fadeAnims[index] }}
              >
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedAge?.id === range.id && styles.selectedOption,
                  ]}
                  onPress={() => handleSelection(range)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAge?.id === range.id && styles.selectedOptionText,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !selectedAge && styles.disabledButton]}
            onPress={handleNext}
            disabled={!selectedAge}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
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
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#FFF7E1",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  beeIcon: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 40,
    left: 20,
    transform: [{ scaleX: -1 }], // Flip the bee horizontally in the base styles
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: "auto",
    marginBottom: 20,
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
  selectedOption: {
    backgroundColor: "#FFB800",
    borderColor: "#FFB800",
  },
  selectedOptionText: {
    color: "#fff",
  },
});
