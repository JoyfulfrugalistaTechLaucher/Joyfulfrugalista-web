// global constants

import { User } from './interface';

export const FB_URL =
  'https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/';

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

// a minimum valid user object to avoid handling null
export const DUSER: User = {
  email: 'example@com.au',
  name: 'Joyfule Jar',
  gender: 'Prefer not to say',
  phone: '',
  avatar: DEFAULT_AVATAR,
  task: {
    goal: 100,
    setDate: '2024-10-08',
  },
};
