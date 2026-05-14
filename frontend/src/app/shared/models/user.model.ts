export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status?: string;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
