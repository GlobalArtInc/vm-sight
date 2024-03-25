import { RoleModel } from './role.model';

export class UserModel {
  id: number;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  avatar: string;
  roles: RoleModel[];
}
