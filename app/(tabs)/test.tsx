import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import SessionTest from "@/components/test/SessionTest";
import PosthogTest from "@/components/test/PosthogTest";
import { OneSignalTest } from "@/components/test/OneSignalTest";
export default function TestSessionScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SessionTest />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <PosthogTest />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <OneSignalTest />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 10,
  },
  divider: {
    height: 10,
    backgroundColor: "#f0f0f0",
  },
});
