import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { usePostHog } from "posthog-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PosthogTest() {
  const posthog = usePostHog();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [eventHistory, setEventHistory] = useState<string[]>([]);

  // Load the current device ID
  useEffect(() => {
    const loadDeviceId = async () => {
      const id = await AsyncStorage.getItem("deviceId");
      setDeviceId(id);
    };

    loadDeviceId();
  }, []);

  // Test basic event capture
  const captureBasicEvent = async () => {
    setLoading(true);
    try {
      posthog.capture("test_basic_event", {
        source: "posthog_test_screen",
        timestamp: new Date().toISOString(),
      });

      addToHistory("Basic event captured: test_basic_event");
    } catch (e) {
      console.error("Error capturing basic event:", e);
      addToHistory(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  // Test event with properties
  const captureEventWithProps = async () => {
    setLoading(true);
    try {
      posthog.capture("test_event_with_props", {
        source: "posthog_test_screen",
        deviceId: deviceId,
        testProperty: "test_value",
        numericValue: 42,
        booleanValue: true,
        timestamp: new Date().toISOString(),
      });

      addToHistory("Event with properties captured: test_event_with_props");
    } catch (e) {
      console.error("Error capturing event with props:", e);
      addToHistory(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  // Test user identification
  const identifyUser = async () => {
    setLoading(true);
    try {
      posthog.identify(deviceId || "unknown_device", {
        lastTested: new Date().toISOString(),
        fromTestScreen: true,
        deviceType: "mobile",
      });

      addToHistory(`User identified with ID: ${deviceId || "unknown_device"}`);
    } catch (e) {
      console.error("Error identifying user:", e);
      addToHistory(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  // Test screen view
  const captureScreenView = async () => {
    setLoading(true);
    try {
      posthog.screen("PostHog Test Screen", {
        source: "manual_test",
        timestamp: new Date().toISOString(),
      });

      addToHistory("Screen view captured: PostHog Test Screen");
    } catch (e) {
      console.error("Error capturing screen view:", e);
      addToHistory(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  // Add to history log
  const addToHistory = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventHistory((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PostHog Test</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Current Device ID:</Text>
        <Text style={styles.value}>{deviceId || "Not found"}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Capture Basic Event"
          onPress={captureBasicEvent}
          disabled={loading}
          color="#722ED1"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Capture Event with Properties"
          onPress={captureEventWithProps}
          disabled={loading}
          color="#722ED1"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Identify User"
          onPress={identifyUser}
          disabled={loading}
          color="#722ED1"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Capture Screen View"
          onPress={captureScreenView}
          disabled={loading}
          color="#722ED1"
        />
      </View>

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Event History</Text>
      <ScrollView style={styles.historyContainer}>
        {eventHistory.length > 0 ? (
          eventHistory.map((event, index) => (
            <Text key={index} style={styles.historyItem}>
              {event}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyHistory}>No events captured yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontFamily: "monospace",
  },
  buttonContainer: {
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  historyItem: {
    fontFamily: "monospace",
    fontSize: 12,
    marginBottom: 6,
    color: "#333",
  },
  emptyHistory: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
