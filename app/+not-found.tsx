
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { BeeThemedText } from '@/components/BeeThemedText';
import { BeeThemedView } from '@/components/BeeThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <BeeThemedView style={styles.container}>
        <BeeThemedText type="title">This screen doesn't exist.</BeeThemedText>
        <Link href="/" style={styles.link}>
          <BeeThemedText type="link">Go to home screen!</BeeThemedText>
        </Link>
      </BeeThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
