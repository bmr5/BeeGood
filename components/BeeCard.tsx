import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";

export type BeeCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function BeeCard(props: BeeCardProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    {
      light: lightColor || Colors.light.cardBackground,
      dark: darkColor || Colors.dark.cardBackground,
    },
    "background"
  );

  return (
    <View style={[styles.card, { backgroundColor }, style]} {...otherProps} />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
