import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Configure logger before any other Reanimated imports or usage
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

import { Animated, View, StyleSheet } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { useUserStore } from "@/stores/useUserStore";
import { setupDeviceUser } from "@/lib/setupDeviceUser";
import { getSupabaseClient } from "@/lib/supabase";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";
import { BeeThemedView } from "@/components/BeeThemedView";
import { superwallService } from "@/services/superwall-service";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { useOneSignal } from "@/hooks/useOneSignal";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isDev = __DEV__ || Constants.expoConfig?.extra?.env === "development";
  const initializeDeviceUser = useUserStore(
    (state) => state.initializeDeviceUser
  );
  const [isUserInitialized, setIsUserInitialized] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity: 0

  // Always use light theme background
  const backgroundColor = Colors.light.background;

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useOneSignal();

  // Single initialization flow
  useEffect(() => {
    const init = async () => {
      try {
        // First ensure we have a device ID
        const deviceId = await setupDeviceUser();

        // Then initialize Supabase client with the device ID set in async storage
        const client = await getSupabaseClient();

        // Finally initialize the user in the store
        await initializeDeviceUser();

        setIsUserInitialized(true);

        superwallService.initialize();

        // if (isDev) {
        // if (isDev) {
        //   console.log("clearing storage");
        //   await AsyncStorage.clear();
        //   console.log("storage cleared,");
        // }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Even if there's an error, we should mark initialization as complete
        setIsUserInitialized(true);
      }
    };

    init();
  }, [initializeDeviceUser]);

  // Hide splash screen when both fonts and user are loaded
  useEffect(() => {
    if (loaded && isUserInitialized) {
      // Hide splash screen
      SplashScreen.hideAsync();

      // Start fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Adjust duration as needed
        useNativeDriver: true,
      }).start();
    }
  }, [loaded, isUserInitialized, fadeAnim]);

  if (!loaded || !isUserInitialized) {
    // Return a view with the same background color as the app
    return <BeeThemedView />;
  }

  return (
    <PostHogProvider
      apiKey="phc_sGZqLdDDWYFDwA1gYNTqgGLVSptJVYf17j7D8JsDsbB"
      options={{
        host: "https://us.i.posthog.com",

        // check https://posthog.com/docs/session-replay/installation?tab=React+Native
        // for more config and to learn about how we capture sessions on mobile
        // and what to expect
        enableSessionReplay: true,
        sessionReplayConfig: {
          // Whether text inputs are masked. Default is true.
          // Password inputs are always masked regardless
          maskAllTextInputs: true,
          // Whether images are masked. Default is true.
          maskAllImages: true,
          // Capture logs automatically. Default is true.
          // Android only (Native Logcat only)
          captureLog: true,
          // Whether network requests are captured in recordings. Default is true
          // Only metric-like data like speed, size, and response code are captured.
          // No data is captured from the request or response body.
          // iOS only
          captureNetworkTelemetry: true,
          // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 500ms
          androidDebouncerDelayMs: 500,
          // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
          iOSdebouncerDelayMs: 1000,
        },
      }}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </Animated.View>
      </View>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
