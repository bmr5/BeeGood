export const Colors = {
  light: {
    text: "#101210", // Black'ish for text
    background: "#FFF8DE", // Clean white background
    tint: "#E0B040", // Main yellow as primary tint
    tabIconDefault: "#E7E7E0", // Light white for inactive tabs
    tabIconSelected: "#E0B040", // Main yellow for selected tabs
    secondaryText: "#8A8A8A", // Medium gray for secondary text
    borderColor: "#E7E7E0", // Light white for borders
    cardBackground: "#FFF8DE", // Brighter yellow background for cards
    // Category colors (incorporating bee theme)
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

// For type safety, we maintain the ColorName type but reference only light theme
export type ColorName = keyof typeof Colors.light;

// light white: #E7E7E0
// light pink #E9B5A0
// main yellow #E0B040
// dark yellow brown #C88F50
// black'ish #101210
