
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
}) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Deeds',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar-check" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-bar" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'My Bee',
          tabBarIcon: ({ color }) => <TabBarIcon name="bug" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Badges',
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
