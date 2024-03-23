import type { Role } from './role.types';

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  roles: Role[];
}
