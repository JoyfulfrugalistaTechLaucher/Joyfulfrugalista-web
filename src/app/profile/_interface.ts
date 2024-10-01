export interface Task {
  goal: number,
  setDate: string,
};

export interface User {
  email: string,
  name: string,
  gender?: string,
  phone?: string,
  avatar?: string,
  task?: Task,
};

export interface UserProfileProps {
  user: User,
  handler: (update: Partial<User>) => void;
};
