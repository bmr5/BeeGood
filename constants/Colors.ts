
export const Colors = {
  light: {
    text: '#4A4A4A', // Soft dark gray for text
    background: '#FFFFFF', // Clean white background
    tint: '#FFD166', // Warm yellow as primary tint
    tabIconDefault: '#E0E0E0', // Light gray for inactive tabs
    tabIconSelected: '#FFD166', // Yellow for selected tabs
    secondaryText: '#8A8A8A', // Medium gray for secondary text
    borderColor: '#F5F5F5', // Very light gray for borders
    cardBackground: '#FFFCF5', // Very light yellow/cream for cards
    // Category colors (softer, more pastel versions)
    personalGrowth: '#FFAF87', // Soft peach
    familyBonds: '#A6D0FF', // Light blue
    friendship: '#FFB6D9', // Soft pink
    communityImpact: '#A8E6CF', // Mint green
    environmentalCare: '#C1E1A6', // Soft lime
    compassion: '#DFC0EB', // Lavender
  },
  dark: {
    text: '#FFFFFF', // White text for dark mode
    background: '#FFF8E1', // Very light cream/yellow background
    tint: '#FFD166', // Same yellow tint
    tabIconDefault: '#CCCCCC', // Light gray for inactive tabs
    tabIconSelected: '#FFD166', // Yellow for selected tabs
    secondaryText: '#D0D0D0', // Light gray for secondary text
    borderColor: '#FFE082', // Light yellow borders
    cardBackground: '#FFF8E1', // Light cream/yellow card background
    // Category colors (same as light mode for consistency)
    personalGrowth: '#FFAF87', // Soft peach
    familyBonds: '#A6D0FF', // Light blue
    friendship: '#FFB6D9', // Soft pink
    communityImpact: '#A8E6CF', // Mint green
    environmentalCare: '#C1E1A6', // Soft lime
    compassion: '#DFC0EB', // Lavender
  },
};

export default Colors;

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
