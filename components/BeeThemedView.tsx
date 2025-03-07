
import { View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export type BeeThemedViewProps = ViewProps & ThemedProps;

export function BeeThemedView(props: BeeThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
