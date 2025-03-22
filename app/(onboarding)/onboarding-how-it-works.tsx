import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { BeeThemedView } from "@/components/BeeThemedView";
import { HoveringBee } from "./hoveringBee";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { BeePositionsEnum } from "./BeePositionsEnum";

const { width } = Dimensions.get("window");

// Example good deeds to display in the rolodex
const goodDeeds = [
  "Text an old friend you haven't heard from in a while",
  "Pick up litter in your local park",
  "Leave a kind note for a neighbor",
  "Compliment a stranger on something genuine",
  "Donate unused items to a local shelter",
];

export default function OnboardingHowItWorks() {
  // Animation values
  const [titleFade] = useState(new Animated.Value(0));
  const [descriptionFade] = useState(new Animated.Value(0));
  const [suggestionOpacity] = useState(new Animated.Value(0));
  const [suggestionY] = useState(new Animated.Value(0));
  const [checkmarkScale] = useState(new Animated.Value(0));
  const [greatJobFade] = useState(new Animated.Value(0));
  const [additionalTextFade] = useState(new Animated.Value(0));
  const [buttonFade] = useState(new Animated.Value(0));

  // State for content
  const [currentDeedIndex, setCurrentDeedIndex] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const animateNextDeed = (index: number) => {
    // Hide current deed
    Animated.parallel([
      Animated.timing(suggestionOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(suggestionY, {
        toValue: 40,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentDeedIndex(index);
      suggestionY.setValue(-40);

      // Show next deed
      Animated.parallel([
        Animated.timing(suggestionOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(suggestionY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start(() => {
        // If we're not at the last deed, schedule the next one
        if (index < goodDeeds.length - 1) {
          setTimeout(() => animateNextDeed(index + 1), 1500);
        } else {
          // We're at the last deed, wait longer before showing completion
          setTimeout(() => showCompletion(), 2000); // Increased delay for last suggestion
        }
      });
    });
  };

  const showCompletion = () => {
    // Hide the last deed
    Animated.timing(suggestionOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCheckmark(true);

      // Show checkmark and "Great job!" text
      Animated.sequence([
        Animated.timing(checkmarkScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
        Animated.timing(greatJobFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Short pause before showing additional text
        Animated.delay(300),
        // Show additional text
        Animated.timing(additionalTextFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Short pause before showing button
        Animated.delay(300),
        // Show button
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Initial animation sequence
  useEffect(() => {
    Animated.sequence([
      // Show title
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Short pause
      Animated.delay(300),
      // Show description and first deed simultaneously
      Animated.parallel([
        Animated.timing(descriptionFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(suggestionOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Start the deed cycle after initial animations
      setTimeout(() => animateNextDeed(1), 1500);
    });
  }, []);

  const handleNext = () => {
    router.push("/onboarding-schedule");
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HoveringBee
          xPosition={BeePositionsEnum.OVERVIEW}
          startingXPosition={BeePositionsEnum.LIVING}
          yOffset={40}
        />

        <View style={styles.content}>
          <View style={styles.topSection}>
            <Animated.Text style={[styles.title, { opacity: titleFade }]}>
              How It Works
            </Animated.Text>

            <Animated.Text
              style={[styles.description, { opacity: descriptionFade }]}
            >
              Every day we suggest a small action you can take to make your
              world a better place.
            </Animated.Text>
          </View>

          <View style={styles.middleSection}>
            <View style={styles.rolodexContainer}>
              {!showCheckmark ? (
                <Animated.Text
                  style={[
                    styles.deedText,
                    {
                      opacity: suggestionOpacity,
                      transform: [{ translateY: suggestionY }],
                    },
                  ]}
                >
                  {goodDeeds[currentDeedIndex]}
                </Animated.Text>
              ) : (
                <View style={styles.completedContainer}>
                  <Animated.View
                    style={[
                      styles.checkmarkContainer,
                      {
                        transform: [{ scale: checkmarkScale }],
                      },
                    ]}
                  >
                    <FontAwesome
                      name="check-circle"
                      size={40}
                      color="#4CAF50"
                    />
                  </Animated.View>
                  <Animated.Text
                    style={[
                      styles.greatJobText,
                      {
                        opacity: greatJobFade,
                      },
                    ]}
                  >
                    Great job!
                  </Animated.Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Animated.View
              style={[
                styles.additionalTextContainer,
                {
                  opacity: additionalTextFade,
                },
              ]}
            >
              <View style={styles.benefitItem}>
                <FontAwesome5
                  name="fire"
                  size={18}
                  color="#FFB800"
                  style={styles.benefitIcon}
                />
                <Text style={styles.benefitText}>
                  Build streaks by completing daily suggestions
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <FontAwesome5
                  name="compass"
                  size={18}
                  color="#FFB800"
                  style={styles.benefitIcon}
                />
                <Text style={styles.benefitText}>
                  Choose areas of your life to focus on
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <FontAwesome5
                  name="magic"
                  size={18}
                  color="#FFB800"
                  style={styles.benefitIcon}
                />
                <Text style={styles.benefitText}>
                  Suggestions become more personalized over time
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[styles.buttonContainer, { opacity: buttonFade }]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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
    justifyContent: "space-between", // Distribute space between sections
  },
  topSection: {
    alignItems: "center",
  },
  middleSection: {
    flex: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center",
    paddingVertical: 40, // Add vertical padding
  },
  bottomSection: {
    marginTop: 20, // Add space above the bottom section
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20, // Reduced from 40
    color: "#666",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  rolodexContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: width - 60,
    overflow: "hidden",
  },
  deedText: {
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 20,
  },
  completedContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  checkmarkContainer: {
    marginBottom: 10,
  },
  greatJobText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  additionalTextContainer: {
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
