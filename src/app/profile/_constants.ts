import { User } from './_interface';

export const DEFAULT_AVATAR = 'assets/portrait.png';
export const AVATARS: string[] = [
  'assets/portrait.png',
  'assets/saving_jar0.jpg',
  'assets/saving_jar1.jpg',
  'assets/saving_jar2.jpg',
  'assets/saving_jar3.jpg',
  'assets/saving_jar_usp0.jpg',
  'assets/saving_jar_usp1.jpg',
  'assets/saving_jar_usp2.webp',
  'assets/saving_jar_usp3.webp',
  'assets/saving_jar_usp4.webp',
];
export const MAX_NAME_LEN = 30;
export const GENDERS: string[] = ['Male', 'Female', 'Secret', 'Trans'];

// a minimum valid user object to avoid handling null
export const DUSER: User = {
  email: '',
  name: '',
  gender: '',
  phone: '',
  avatar: DEFAULT_AVATAR,
  task: {
    goal: 0,
    setDate: '',
  },
};
