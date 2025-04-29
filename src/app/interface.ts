// Common types and interfaces for component props and more
export interface Task {
  goal: number;
  setDate: string;
};

export type User = {
  readonly id: string;
  email: string;
  name: string;
  gender?: string;
  phone?: string;
  avatar?: string;
  task?: Task;
};

export type UserProfileProps = {
  user: User;
  handler: (update: Partial<User>) => void;
};

export type SavingsRecord = {
  readonly id?: string;
  date: Date;
  category: string;
  saved: number;
  description?: string;
}

export type RawRecord = {
  date: string;
  category: string;
  saved: number;
  description?: string;
}

export type SavingsRecordProps = {
  record: SavingsRecord;
  handler: (update: Partial<SavingsRecord>) => void;
}
