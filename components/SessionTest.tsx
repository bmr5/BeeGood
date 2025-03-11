import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SessionTest() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [unauthorizedTest, setUnauthorizedTest] = useState<any>(null);
  const [unauthorizedLoading, setUnauthorizedLoading] = useState(false);

  // Load the current device ID
  useEffect(() => {
    const loadDeviceId = async () => {
      const id = await AsyncStorage.getItem("deviceId");
      setDeviceId(id);
    };

    loadDeviceId();
  }, []);

  // Test the session function
  const testSession = async () => {
    setLoading(true);
    try {
      const deviceId = await AsyncStorage.getItem("deviceId");
      console.log("Device ID from AsyncStorage:", deviceId);

      const { data, error } = await supabase.rpc("get_current_user_id");

      if (error) {
        console.error("Error testing session:", error);
        setSessionInfo({ error: error.message });
      } else {
        console.log("Session info:", data);
        setSessionInfo(data);
      }
    } catch (e) {
      console.error("Exception testing session:", e);
      setSessionInfo({ error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  // Test unauthorized access
  const testUnauthorizedAccess = async () => {
    setUnauthorizedLoading(true);
    try {
      // Try to access a user with a different device ID
      // We're using Nick's device ID from the seed data
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("device_id", "nick-device-789")
        .single();

      if (error) {
        console.error("Error in unauthorized test:", error);
        setUnauthorizedTest({ error: error.message });
      } else {
        console.log("Unauthorized test result:", data);
        setUnauthorizedTest(data);
      }
    } catch (e) {
      console.error("Exception in unauthorized test:", e);
      setUnauthorizedTest({ error: String(e) });
    } finally {
      setUnauthorizedLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Test</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Current Device ID:</Text>
        <Text style={styles.value}>{deviceId || "Not found"}</Text>
      </View>

      <Button
        title={loading ? "Testing..." : "Test Session"}
        onPress={testSession}
        disabled={loading}
      />

      {sessionInfo && (
        <View style={styles.resultContainer}>
          <Text style={styles.subtitle}>Results:</Text>
          <Text style={styles.code}>
            {JSON.stringify(sessionInfo, null, 2)}
          </Text>
        </View>
      )}

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Unauthorized Access Test</Text>
      <Button
        title={unauthorizedLoading ? "Testing..." : "Test Unauthorized Access"}
        onPress={testUnauthorizedAccess}
        disabled={unauthorizedLoading}
        color="#ff6347" // Tomato color to indicate this is a security test
      />

      {unauthorizedTest && (
        <View style={[styles.resultContainer, styles.unauthorizedContainer]}>
          <Text style={styles.subtitle}>Unauthorized Test Results:</Text>
          <Text style={styles.code}>
            {JSON.stringify(unauthorizedTest, null, 2)}
          </Text>
          <Text style={styles.explanation}>
            {unauthorizedTest.error
              ? "✅ Access denied as expected (RLS working)"
              : "❌ WARNING: Unauthorized access succeeded (RLS not working)"}
          </Text>
        </View>
      )}
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
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  code: {
    fontFamily: "monospace",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  unauthorizedContainer: {
    backgroundColor: "#fff0f0",
  },
  explanation: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#555",
  },
});
