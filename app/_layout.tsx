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
import { Animated, View, StyleSheet } from "react-native";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

import { useUserStore } from "@/stores/useUserStore";
import { setupDeviceUser } from "@/lib/setupDeviceUser";
import { getSupabaseClient } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Colors from "@/constants/Colors";
import { BeeThemedView } from "@/components/BeeThemedView";
import { superwallService } from "@/services/superwall-service";
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
