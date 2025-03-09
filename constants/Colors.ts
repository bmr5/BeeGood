export const Colors = {
  light: {
    text: "#101210", // Black'ish for text
    background: "#FFFFFF", // Clean white background
    tint: "#E0B040", // Main yellow as primary tint
    tabIconDefault: "#E7E7E0", // Light white for inactive tabs
    tabIconSelected: "#E0B040", // Main yellow for selected tabs
    secondaryText: "#8A8A8A", // Medium gray for secondary text
    borderColor: "#E7E7E0", // Light white for borders
    // cardBackground: "#FFF2C4", // Brighter yellow background for cards
    cardBackground: "#FFF8DE", // Brighter yellow background for cards
    // Category colors (incorporating bee theme)
    personalGrowth: "#E0B040", // Main yellow
    familyBonds: "#C88F50", // Dark yellow brown
    friendship: "#E9B5A0", // Light pink
    communityImpact: "#E7E7E0", // Light white
    environmentalCare: "#E0B040", // Main yellow
    compassion: "#E9B5A0", // Light pink
  },
  dark: {
    text: "#E7E7E0", // Light white text for contrast on dark backgrounds
    background: "#101210", // Black'ish background
    tint: "#E0B040", // Main yellow tint
    tabIconDefault: "#8A8A8A", // Medium gray for inactive tabs
    tabIconSelected: "#E0B040", // Main yellow for selected tabs
    secondaryText: "#C0C0C0", // Light gray for secondary text
    borderColor: "#C88F50", // Dark yellow brown borders
    cardBackground: "#1A1A1A", // Dark gray card background
    // Category colors (same core colors but adjusted for dark mode)
    personalGrowth: "#E0B040", // Main yellow
    familyBonds: "#C88F50", // Dark yellow brown
    friendship: "#E9B5A0", // Light pink
    communityImpact: "#E7E7E0", // Light white
    environmentalCare: "#E0B040", // Main yellow
    compassion: "#E9B5A0", // Light pink
  },
  gradients: {
    primary: {
      colors: ["#FFF8DE", "#F7DC8D", "#FFF8DE"], // Soft pink gradient
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    warm: {
      colors: ["#FFE5D6", "#FFD6C7", "#FFC7B8"], // Warm peachy gradient
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    honey: {
      colors: ["#E0B040", "#C88F50", "#E9B5A0"], // Yellow to pink transition
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

export default Colors;

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

// light white: #E7E7E0
// light pink #E9B5A0
// main yellow #E0B040
// dark yellow brown #C88F50
// black'ish #101210
