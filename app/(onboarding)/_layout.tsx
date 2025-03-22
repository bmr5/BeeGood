import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export default function OnboardingLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding-age" />
        <Stack.Screen name="onboarding-living" />
        <Stack.Screen name="onboarding-how-it-works" />
        <Stack.Screen name="onboarding-schedule" />
        <Stack.Screen name="onboarding-goals" />
        <Stack.Screen name="features" />
        <Stack.Screen name="final" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
