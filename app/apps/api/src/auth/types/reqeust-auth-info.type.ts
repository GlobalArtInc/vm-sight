import { UserEntity } from '@app/dal/repositories';
import { type Request } from 'express';

export type AuthRequest = Request & { authorizationInfo: { sessionId: string; userId: number; user: UserEntity } };
