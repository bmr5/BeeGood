import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { BeeThemedView } from "@/components/BeeThemedView";
import BeeGardenAnimation from "@/components/home/BeeGardenAnimation";
import ShakableHive from "@/components/home/ShakableHive";
import StreakButton from "@/components/home/StreakButton";
import { ActionDisplay } from "@/components/home/ActionDisplay";
import Colors from "@/constants/Colors";

export default function DailyDeedsScreen() {
  return (
    <BeeThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Absolute positioned hive with shake animation */}
        <ShakableHive
          source={require("@/assets/images/hive.png")}
          style={styles.hiveIcon}
        />

        {/* Header with Streak and user name if available */}
        <View style={styles.header}>
          <StreakButton />
        </View>

        {/* Main Deed Content */}
        <View style={styles.mainContent}>
          <ActionDisplay />
        </View>

        {/* Add the BeeGardenAnimation below the quote */}
        <View style={styles.gardenContainer}>
          <BeeGardenAnimation
            height={120}
            speedFactor={1}
            onBeeVisitFlower={() => {}}
          />
        </View>
      </SafeAreaView>
    </BeeThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
  },
  hiveIcon: {
    width: 100,
    height: 100,
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gardenContainer: {
    width: "100%",
    marginBottom: 20,
  },
  statusContainer: {
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
});
