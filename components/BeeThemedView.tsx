import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

export type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
  useGradient?: boolean;
  gradientType?: keyof typeof Colors.gradients;
};

export type BeeThemedViewProps = ViewProps & ThemedProps;

export function BeeThemedView(props: BeeThemedViewProps) {
  const {
    style,
    lightColor,
    darkColor,
    useGradient = true,
    gradientType = "primary",
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  if (useGradient) {
    const gradient = Colors.gradients[gradientType];
    return (
      <LinearGradient
        colors={gradient.colors as [string, string, ...string[]]}
        start={gradient.start}
        end={gradient.end}
        style={style}
        {...otherProps}
      />
    );
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
