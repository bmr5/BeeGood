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
import { BeePositionsEnum } from "./BeePositionsEnum";

interface AxisItem {
  id: number;
  text: string;
  icon: string;
  description: string;
}

const axes: AxisItem[] = [
  {
    id: 1,
    text: "Community",
    icon: "users",
    description:
      "The spaces we share and the people and things that we share them with.",
  },
  {
    id: 2,
    text: "Relationships",
    icon: "heart",
    description: "The people in our lives that matter most.",
  },
  {
    id: 3,
    text: "Self",
    icon: "user",
    description: "Because being good to ourselves helps us be good to others.",
  },
];

export default function OnboardingAxes() {
  const [fadeAnims] = useState(() => axes.map(() => new Animated.Value(0)));
  const [buttonFade] = useState(new Animated.Value(0));
  const [subtitleFade] = useState(new Animated.Value(0));
  const [iconAnims] = useState(() =>
    axes.map(() => ({
      scale: new Animated.Value(0),
      beat: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  );

  useEffect(() => {
    // Animate subtitle first
    Animated.timing(subtitleFade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate items one after another with shorter delays
    axes.forEach((item, index) => {
      Animated.sequence([
        Animated.delay(600 + index * 400),
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After each item fades in, animate its icon
        switch (item.icon) {
          case "users":
            // Community icon grows and slightly rotates
            Animated.sequence([
              Animated.spring(iconAnims[index].scale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
              }),
              Animated.spring(iconAnims[index].rotate, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
              }),
            ]).start();
            break;

          case "heart":
            // Heart icon beats
            Animated.sequence([
              Animated.spring(iconAnims[index].scale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
              }),
              Animated.loop(
                Animated.sequence([
                  Animated.timing(iconAnims[index].beat, {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                  }),
                  Animated.timing(iconAnims[index].beat, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                  }),
                ]),
                { iterations: 2 }
              ),
            ]).start();
            break;

          case "user":
            // Self icon scales up with bounce
            Animated.spring(iconAnims[index].scale, {
              toValue: 1,
              tension: 40,
              friction: 4,
              useNativeDriver: true,
            }).start();
            break;
        }
      });
    });

    // Animate button after all items
    Animated.sequence([
      Animated.delay(2000),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    // Navigate to next screen
    router.push("/onboarding-goals");
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HoveringBee
          xPosition={BeePositionsEnum.AXES}
          startingXPosition={BeePositionsEnum.AGE}
          yOffset={5}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Focusing on what matters most</Text>
          <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
            Each day you'll be challenged to put some more good into a key part
            of your world:
          </Animated.Text>

          <View style={styles.axesContainer}>
            {axes.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[styles.axisItem, { opacity: fadeAnims[index] }]}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [
                        {
                          scale: Animated.multiply(
                            iconAnims[index].scale,
                            iconAnims[index].beat
                          ),
                        },
                        {
                          rotate: iconAnims[index].rotate.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <FontAwesome5 name={item.icon} size={24} color="#FFB800" />
                </Animated.View>
                <View style={styles.axisContent}>
                  <Text style={styles.axisText}>{item.text}</Text>
                  <Text style={styles.axisDescription}>{item.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <Animated.View style={{ opacity: buttonFade }}>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Let's do it</Text>
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
  axesContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 30,
  },
  axisItem: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#FFF7E1",
    borderRadius: 12,
    gap: 15,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  axisContent: {
    flex: 1,
  },
  axisText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  axisDescription: {
    fontSize: 14,
    color: "#666",
  },
});
