import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: Colors.light.background,
          elevation: 0, // Remove shadow on Android
          borderTopWidth: 0, // Remove top border
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Daily Deeds",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="test-session"
        options={{
          title: "Test Session",
        }}
      />
    </Tabs>
  );
}
