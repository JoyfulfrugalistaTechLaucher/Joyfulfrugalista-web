export interface Category {
  id: string;
  title: string;
  iconName: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'Housing', title: '住房', iconName: '/assets/housing.png', color: '#D0C6E1' },
  { id: 'Household', title: '家居', iconName: '/assets/household.png', color: '#F1EBF2' },
  { id: 'Utilities', title: '生活缴费', iconName: '/assets/utilities.png', color: '#C4D3EB' },
  { id: 'Transport', title: '交通', iconName: '/assets/transport.png', color: '#D0ECF3' },
  { id: 'Leisure', title: '休闲', iconName: '/assets/leisure.png', color: '#D6E4F2' },
  { id: 'Holidays', title: '假期', iconName: '/assets/holidays.png', color: '#BCE1D6' },
  { id: 'Wellbeing', title: '身心健康', iconName: '/assets/wellbeing.png', color: '#E6D6FF' },
  { id: 'Education', title: '教育', iconName: '/assets/education.png', color: '#F5C4DB' },
  { id: 'Grooming', title: '个人护理', iconName: '/assets/grooming.png', color: '#E8CCFF' },
  { id: 'Gifts', title: '礼物', iconName: '/assets/gifts.png', color: '#FFCCCC' },
  { id: 'Christmas', title: '圣诞节', iconName: '/assets/christmas.png', color: '#CCF5E1' },
  { id: 'Insurance', title: '保险', iconName: '/assets/insurance.png', color: '#F7E8E4' },
  { id: 'Childcare', title: '托儿', iconName: '/assets/childcare.png', color: '#FFE6CC' },
  { id: 'Food', title: '食品', iconName: '/assets/food.png', color: '#BCE1D6' },
  { id: 'Health', title: '健康', iconName: '/assets/health.png', color: '#C5E1BA' },
  { id: 'Appearance', title: '外貌', iconName: '/assets/appearance.png', color: '#F7E8E4' },
  { id: 'Lifestyle', title: '生活方式', iconName: '/assets/lifestyle.png', color: '#F4EB85' },
  { id: 'Treat yourself', title: '犒劳自己', iconName: '/assets/treatyourself.png', color: '#F0EAD6' },
];
