import { Text, TextProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedProps = {
  lightColor?: string;
};

export type BeeThemedTextProps = TextProps &
  ThemedProps & {
    type?:
      | "title"
      | "subtitle"
      | "default"
      | "defaultSemiBold"
      | "secondary"
      | "link";
  };

export function BeeThemedText(props: BeeThemedTextProps) {
  const { style, lightColor, type = "default", ...otherProps } = props;

  let fontStyles = {};
  switch (type) {
    case "title":
      fontStyles = {
        fontSize: 28,
        fontWeight: "700" as const,
        color: "#333333", // Ensure dark text for titles
      };
      break;
    case "subtitle":
      fontStyles = {
        fontSize: 20,
        fontWeight: "600" as const,
        color: "#333333", // Ensure dark text for subtitles
      };
      break;
    case "defaultSemiBold":
      fontStyles = {
        fontSize: 16,
        fontWeight: "600" as const,
      };
      break;
    case "secondary":
      fontStyles = {
        fontSize: 14,
        color: useThemeColor({}, "secondaryText"),
      };
      break;
    case "link":
      fontStyles = {
        color: "#E6A40B", // Slightly darker tint for better visibility
        textDecorationLine: "underline" as const,
      };
      break;
    default:
      fontStyles = { fontSize: 16 };
  }

  return (
    <Text style={[{ color: lightColor }, fontStyles, style]} {...otherProps} />
  );
}
