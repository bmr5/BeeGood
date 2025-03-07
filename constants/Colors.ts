
export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#F6B93B', // Honey gold
    tabIconDefault: '#CCCCCC',
    tabIconSelected: '#F6B93B',
    secondaryText: '#666666',
    borderColor: '#E0E0E0',
    cardBackground: '#F8F8F8',
    // Category colors
    personalGrowth: '#FF9966', // Orange
    familyBonds: '#6699FF', // Blue
    friendship: '#FF66B2', // Pink
    communityImpact: '#66CC99', // Green
    environmentalCare: '#99CC66', // Light Green
    compassion: '#CC99FF', // Purple
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: '#F6B93B', // Honey gold
    tabIconDefault: '#444444',
    tabIconSelected: '#F6B93B',
    secondaryText: '#AAAAAA',
    borderColor: '#333333',
    cardBackground: '#242424',
    // Category colors
    personalGrowth: '#FF9966', // Orange
    familyBonds: '#6699FF', // Blue 
    friendship: '#FF66B2', // Pink
    communityImpact: '#66CC99', // Green
    environmentalCare: '#99CC66', // Light Green
    compassion: '#CC99FF', // Purple
  },
};

export default Colors;

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
