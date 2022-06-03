import { User } from '@/interfaces/auth.interface';

export interface MetaInterface {
  users: User[] | null;
  user: User;
}
