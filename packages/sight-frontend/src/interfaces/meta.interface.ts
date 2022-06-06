import { User } from '@/interfaces/auth.interface';
import { RouteMeta } from 'vue-router';

export interface RouteMetaI extends RouteMeta {
  resolve: object;
}

export interface MetaInterface {
  users: User[] | null;
  user: User;
}
