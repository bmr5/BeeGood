
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: '#F6B93B',
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#F6B93B',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#000000',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Ionicons name="today-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'My Bee',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Achievements',
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
