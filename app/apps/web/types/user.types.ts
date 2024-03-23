import type { Role } from "./role.types";

export type User = {
  id: number
  createdAt: string;
  updatedAt: string;
  username: string;
  roles: Role[];
}