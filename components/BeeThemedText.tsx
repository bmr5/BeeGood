
import { Text, TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
};

export type BeeThemedTextProps = TextProps & ThemedProps & {
  type?: 'title' | 'subtitle' | 'default' | 'defaultSemiBold' | 'secondary' | 'link';
};

export function BeeThemedText(props: BeeThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let fontStyles = {};
  switch (type) {
    case 'title':
      fontStyles = { fontSize: 28, fontWeight: '700' as const };
      break;
    case 'subtitle':
      fontStyles = { fontSize: 20, fontWeight: '600' as const };
      break;
    case 'defaultSemiBold':
      fontStyles = { fontSize: 16, fontWeight: '600' as const };
      break;
    case 'secondary':
      fontStyles = { fontSize: 14, color: useThemeColor({}, 'secondaryText') };
      break;
    case 'link':
      fontStyles = { color: useThemeColor({}, 'tint'), textDecorationLine: 'underline' as const };
      break;
    default:
      fontStyles = { fontSize: 16 };
  }

  return <Text style={[{ color }, fontStyles, style]} {...otherProps} />;
}
