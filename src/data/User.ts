export interface Task {
  goal: number,
  setDate: string,
};

export interface User {
  email: string,
  name: string,
  gender?: string,
  goal?: number,
  phone?: string,
  avatar?: string,
  task?: Task,
};
