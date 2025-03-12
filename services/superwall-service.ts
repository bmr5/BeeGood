import { Platform } from "react-native";
import Superwall, {
  SuperwallOptions,
  LogLevel,
  LogScope,
} from "@superwall/react-native-superwall";

export const SUPERWALL_TRIGGERS = {
  ONBOARDING: "campaign_trigger",
  FEATURE_UNLOCK: "campaign_trigger",
  // Add more triggers as needed
} as const;

const createSuperwallConfig = () => {
  const options = new SuperwallOptions();

  // Enable debug logging in development
  if (__DEV__) {
    options.logging.level = LogLevel.Debug;
    options.logging.scopes = [
      LogScope.PaywallPresentation,
      LogScope.PaywallTransactions,
      LogScope.Network,
    ];
  }

  return options;
};

class SuperwallService {
  private static instance: SuperwallService;
  private initialized = false;

  private constructor() {}

  static getInstance(): SuperwallService {
    if (!SuperwallService.instance) {
      SuperwallService.instance = new SuperwallService();
    }
    return SuperwallService.instance;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_IOS,
      android: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID,
      default: undefined,
    });

    if (!apiKey) {
      console.warn("[Superwall] No API key found for platform:", Platform.OS);
      return;
    }

    try {
      const options = createSuperwallConfig();
      Superwall.configure({ apiKey, options });
      this.initialized = true;
      console.log("[Superwall] Initialized successfully");
    } catch (error) {
      console.error("[Superwall] Initialization failed:", error);
    }
  }

  async presentPaywall(
    triggerId: string,
    featureCallback?: () => void,
    params?: Record<string, any>
  ): Promise<void> {
    try {
      console.log("[Superwall] Presenting paywall for trigger:", triggerId);
      await Superwall.shared.register({
        placement: triggerId,
        feature: featureCallback,
        params: params,
      });
    } catch (error) {
      console.error("[Superwall] Failed to present paywall:", error);
      throw error;
    }
  }

  //   async getSubscriptionStatus() {
  //     Superwall.shared.subscriptionStatusEmitter.addListener("change", (status) => {
  //         switch (status.status) {
  //           case "ACTIVE":
  //             break
  //           default:
  //             break
  //         }
  //       })
  //   }
}

export const superwallService = SuperwallService.getInstance();
