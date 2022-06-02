export interface User {
  id: string;
  username: string;
  password: string;
  locale: string;
  role: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  token: string | null;
  isLogged: boolean;
  user: User | null;
}
