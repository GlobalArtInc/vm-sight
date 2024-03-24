import { RoleModel } from './role.model';

export type UserModel = {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  roles: RoleModel[];
};
