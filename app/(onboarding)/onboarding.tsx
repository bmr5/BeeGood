import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { BeeThemedText } from "@/components/BeeThemedText";
import { BeeThemedView } from "@/components/BeeThemedView";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("./onboarding-age");
  };

  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <BeeThemedText
            type="title"
            style={[styles.title, { fontWeight: "400" }]}
          >
            Make life sweeter
          </BeeThemedText>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/icons/splash-icon.png")}
            style={styles.beeImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { fontWeight: "400" }]}>
              Let's get started
            </Text>
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
  contentContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    textAlign: "center",
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  imageContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  beeImage: {
    width: 250,
    height: 250,
  },
});
