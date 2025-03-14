import { supabase } from "@/lib/supabase";
import { useOneSignalStore } from "@/stores/useOneSignalStore";
import { useUserStore } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { OneSignal } from "react-native-onesignal";

export const OneSignalTest = () => {
  const { user } = useUserStore();
  const { hasPermission, isOptedIn } = useOneSignalStore();
  const [loading, setLoading] = useState(false);
  const [eventHistory, setEventHistory] = useState<string[]>([]);

  // Add to history log
  const addToHistory = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventHistory((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleTestNotification = async () => {
    setLoading(true);
    try {
      // Check if notifications are enabled in OneSignal
      if (!hasPermission) {
        // Show a simple alert instead of the permission prompt
        Alert.alert(
          "Notifications Disabled",
          "Please enable notifications using the 'Enable Notifications' toggle above to test this feature.",
          [{ text: "OK", style: "default" }]
        );
        addToHistory("Error: Notifications are disabled");
        return;
      }

      // User has permission, proceed with OneSignal API notification test
      if (!user?.id) {
        Alert.alert("Error", "User not found");
        addToHistory("Error: User not found");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "send-notification",
          {
            body: {
              contents: {
                en: "This is a test notification from the OneSignal Test component!",
              },
              headings: {
                en: "Test Notification",
              },
              target_channel: "push",
              include_aliases: {
                external_id: [user.device_id],
              },
            },
          }
        );

        if (error) {
          throw new Error(error.message);
        }

        addToHistory(
          `OneSignal notification sent successfully. ID: ${data.recipients}`
        );
        Alert.alert(
          "Success",
          "OneSignal notification sent! It may take a moment to arrive."
        );
      } catch (error) {
        console.error("Error sending OneSignal notification:", error);
        Alert.alert("Error", "Failed to send OneSignal notification");
        addToHistory(`Error sending OneSignal notification: ${error}`);
      }
    } catch (error) {
      console.error("Error with notifications:", error);
      Alert.alert("Error", "Failed to process notification request");
      addToHistory(`Error with notifications: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissionStatus = () => {
    addToHistory(`Permission status: ${hasPermission ? "Granted" : "Denied"}`);
    addToHistory(`Opted in status: ${isOptedIn ? "Yes" : "No"}`);
    Alert.alert(
      "OneSignal Status",
      `Permission: ${hasPermission ? "Granted" : "Denied"}\nOpted in: ${
        isOptedIn ? "Yes" : "No"
      }`
    );
  };

  const triggerInAppMessage = () => {
    try {
      OneSignal.InAppMessages.addTrigger("notification_permission", "true");
      addToHistory(
        "Triggered in-app message with 'notification_permission' trigger"
      );
      Alert.alert(
        "Trigger Added",
        "Added 'notification_permission' trigger. If you have an in-app message configured for this trigger, it should display."
      );
    } catch (error) {
      console.error("Error triggering in-app message:", error);
      addToHistory(`Error triggering in-app message: ${error}`);
      Alert.alert("Error", "Failed to trigger in-app message");
    }
  };

  const requestPermissions = () => {
    try {
      OneSignal.Notifications.requestPermission(true);
      addToHistory("Requested notification permissions directly");
      Alert.alert(
        "Permission Request",
        "Notification permission request initiated"
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      addToHistory(`Error requesting permissions: ${error}`);
      Alert.alert("Error", "Failed to request notification permissions");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OneSignal Test</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Notification Permission:</Text>
        <Text style={styles.value}>{hasPermission ? "Granted" : "Denied"}</Text>

        <Text style={styles.label}>Opted In Status:</Text>
        <Text style={styles.value}>{isOptedIn ? "Yes" : "No"}</Text>

        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?.id || "Not found"}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={checkPermissionStatus}
          disabled={loading}
        >
          <Ionicons name="information-circle-outline" size={18} color="#333" />
          <Text style={styles.testButtonText}>Check Permission Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={requestPermissions}
          disabled={loading}
        >
          <Ionicons name="notifications-outline" size={18} color="#333" />
          <Text style={styles.testButtonText}>Request Permissions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleTestNotification}
          disabled={loading || !hasPermission}
        >
          <Ionicons name="paper-plane-outline" size={18} color="#333" />
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={triggerInAppMessage}
          disabled={loading}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#333" />
          <Text style={styles.testButtonText}>Trigger In-App Message</Text>
        </TouchableOpacity>
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
          <Text style={styles.emptyHistory}>No events recorded yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

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
    marginTop: 5,
  },
  value: {
    fontFamily: "monospace",
    marginBottom: 5,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  testButtonText: {
    marginLeft: 8,
    fontWeight: "500",
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
