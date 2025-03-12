import React, { useCallback, useEffect } from "react";
import {
  InAppMessageClickEvent,
  NotificationClickEvent,
  OneSignal,
  LogLevel,
  PushSubscriptionChangedState,
  InAppMessageDidDismissEvent,
  InAppMessageDidDisplayEvent,
  UserChangedState,
  NotificationWillDisplayEvent,
} from "react-native-onesignal";

import Constants from "expo-constants";
import { useOneSignalStore } from "@/stores/useOneSignalStore";

// Initialize OneSignal
OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize(Constants.expoConfig?.extra?.oneSignalAppId);

export const useOneSignal = () => {
  const { hasPermission, isOptedIn, initialize, setPermission, setIsOptedIn } =
    useOneSignalStore();
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Simple logging function that doesn't depend on component state
  const logOSEvent = useCallback((message: string, optionalArg: any = null) => {
    let logMessage = message;

    if (optionalArg !== null) {
      logMessage = `${message} ${JSON.stringify(optionalArg)}`;
    }

    console.log(logMessage);
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Notification clicked
    const notificationClickListener = (event: NotificationClickEvent) => {
      logOSEvent("OneSignal: notification clicked:", event);
    };
    OneSignal.Notifications.addEventListener(
      "click",
      notificationClickListener
    );

    // In-App Message listeners
    const iamClickListener = (event: InAppMessageClickEvent) => {
      logOSEvent("OneSignal IAM clicked:", event);
    };
    OneSignal.InAppMessages.addEventListener("click", iamClickListener);

    // Will display IAM listener
    const iamWillDisplayListener = (event: InAppMessageDidDisplayEvent) => {
      logOSEvent("OneSignal: will display IAM:", event);
    };
    OneSignal.InAppMessages.addEventListener(
      "willDisplay",
      iamWillDisplayListener
    );

    // Did display IAM listener
    const iamDidDisplayListener = (event: InAppMessageDidDisplayEvent) => {
      logOSEvent("OneSignal: did display IAM:", event);
    };
    OneSignal.InAppMessages.addEventListener(
      "didDisplay",
      iamDidDisplayListener
    );

    // Will dismiss IAM listener
    const iamWillDismissListener = (event: InAppMessageDidDismissEvent) => {
      logOSEvent("OneSignal: will dismiss IAM:", event);
    };
    OneSignal.InAppMessages.addEventListener(
      "willDismiss",
      iamWillDismissListener
    );

    // Did dismiss IAM listener
    const iamDidDismissListener = (event: InAppMessageDidDismissEvent) => {
      logOSEvent("OneSignal: did dismiss IAM:", event);
    };
    OneSignal.InAppMessages.addEventListener(
      "didDismiss",
      iamDidDismissListener
    );

    // Push subscription change listener
    const subscriptionChangeListener = (
      subscription: PushSubscriptionChangedState
    ) => {
      logOSEvent("OneSignal: subscription changed:", subscription);
      setIsOptedIn(subscription.current.optedIn);
    };
    OneSignal.User.pushSubscription.addEventListener(
      "change",
      subscriptionChangeListener
    );

    // Permission change listener
    const permissionChangeListener = (granted: boolean) => {
      logOSEvent("OneSignal: permission changed:", granted);
      setPermission(granted);
    };
    OneSignal.Notifications.addEventListener(
      "permissionChange",
      permissionChangeListener
    );

    // User change listener
    const userChangeListener = (event: UserChangedState) => {
      logOSEvent("OneSignal: user changed:", event);
    };
    OneSignal.User.addEventListener("change", userChangeListener);

    // Foreground display listener
    const foregroundDisplayListener = (event: NotificationWillDisplayEvent) => {
      logOSEvent("OneSignal: notification will show in foreground:", event);
      // Optional: Add alert to control notification display
      event.preventDefault();
      // some async work

      // Use display() to display the notification after some async work
      event.getNotification().display();
    };
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      foregroundDisplayListener
    );

    // Clean up all listeners when component unmounts
    return () => {
      OneSignal.Notifications.removeEventListener(
        "click",
        notificationClickListener
      );
      OneSignal.InAppMessages.removeEventListener("click", iamClickListener);
      OneSignal.InAppMessages.removeEventListener(
        "willDisplay",
        iamWillDisplayListener
      );
      OneSignal.InAppMessages.removeEventListener(
        "didDisplay",
        iamDidDisplayListener
      );
      OneSignal.InAppMessages.removeEventListener(
        "willDismiss",
        iamWillDismissListener
      );
      OneSignal.InAppMessages.removeEventListener(
        "didDismiss",
        iamDidDismissListener
      );
      OneSignal.User.pushSubscription.removeEventListener(
        "change",
        subscriptionChangeListener
      );
      OneSignal.Notifications.removeEventListener(
        "permissionChange",
        permissionChangeListener
      );
      OneSignal.User.removeEventListener("change", userChangeListener);
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        foregroundDisplayListener
      );
    };
  }, [logOSEvent]);

  // Return any methods you want to expose from this hook
  return {
    logOSEvent,
  };
};
