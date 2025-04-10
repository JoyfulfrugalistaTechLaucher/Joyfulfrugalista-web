export interface Category {
  id: string;
  title: string;
  iconName: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'General', title: 'General', iconName: '/assets/housing.png', color: '#D0C6E1' },
  { id: 'Housing', title: 'Housing', iconName: '/assets/housing.png', color: '#D0C6E1' },
  { id: 'Household', title: 'Household', iconName: '/assets/household.png', color: '#F1EBF2' },
  { id: 'Utilities', title: 'Utilities', iconName: '/assets/utilities.png', color: '#C4D3EB' },
  { id: 'Transport', title: 'Transport', iconName: '/assets/transport.png', color: '#D0ECF3' },
  { id: 'Leisure', title: 'Leisure', iconName: '/assets/leisure.png', color: '#D6E4F2' },
  { id: 'Holidays', title: 'Holidays', iconName: '/assets/holidays.png', color: '#BCE1D6'},
  { id: 'Wellbeing', title: 'Wellbeing', iconName: '/assets/wellbeing.png', color: '#E6D6FF' },
  { id: 'Education', title: 'Education', iconName: '/assets/education.png', color: '#F5C4DB' },
  { id: 'Grooming', title: 'Grooming', iconName: '/assets/grooming.png', color: '#E8CCFF' },
  { id: 'Gifts', title: 'Gifts', iconName: '/assets/gifts.png', color: '#FFCCCC' },
  { id: 'Christmas', title: 'Christmas', iconName: '/assets/christmas.png', color: '#CCF5E1' },
  { id: 'Insurance', title: 'Insurance', iconName: '/assets/insurance.png', color: '#F7E8E4' },
  { id: 'Childcare', title: 'Childcare', iconName: '/assets/childcare.png', color: '#FFE6CC' },
  { id: 'Food', title: 'Food', iconName: '/assets/food.png', color: '#BCE1D6' },
  { id: 'Health', title: 'Health', iconName: '/assets/health.png', color: '#C5E1BA' },
  { id: 'Appearance', title: 'Appearance', iconName: '/assets/appearance.png', color: '#F7E8E4' },
  { id: 'Lifestyle', title: 'Lifestyle', iconName: '/assets/lifestyle.png', color: '#F4EB85' },
  { id: 'Treat yourself', title: 'Treat yourself', iconName: '/assets/treatyourself.png', color: '#F0EAD6' },
];
