import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Track initialization state
let initializedClient: SupabaseClient | null = null;
let isInitializing = false;
let initializationPromise: Promise<SupabaseClient> | null = null;

// Function to create a Supabase client with the device ID
export const createSupabaseClient = async () => {
  // Get the device ID from AsyncStorage
  const deviceId = await AsyncStorage.getItem("deviceId");

  // Create the Supabase client with the device ID in headers
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        "x-device-id": deviceId || "",
      },
    },
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};

// Helper function to get the initialized client
export async function getSupabaseClient(): Promise<SupabaseClient> {
  console.log("HERE: Getting supabase client");
  // Return existing client if already initialized
  if (initializedClient) {
    console.log("HERE: Returning existing client");
    return initializedClient;
  }

  // If initialization is in progress, return the existing promise
  if (isInitializing && initializationPromise) {
    console.log("HERE: Returning existing promise");
    return initializationPromise;
  }

  // Start initialization
  isInitializing = true;
  initializationPromise = createSupabaseClient().then((client) => {
    initializedClient = client;
    console.log("HERE: Initialized client:", initializedClient);
    updateSupabaseReference(client);
    isInitializing = false;
    return client;
  });

  return initializationPromise;
}

// For immediate use in services where async isn't possible
// This will be replaced with the initialized client after setup
export let supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// After initialization, update this reference
export function updateSupabaseReference(client: SupabaseClient) {
  // Replace the entire supabase object instead of using Object.assign
  supabase = client;
  console.log("Supabase reference updated with device ID headers");
}
