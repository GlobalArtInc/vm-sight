import { EndpointEntity } from '@app/dal/repositories/endpoint';
import { EndpointUsersEntity } from '@app/dal/repositories/endpoint/endpoint-users.entity';
import { RoleEntity } from '@app/dal/repositories/role';
import { SessionEntity } from '@app/dal/repositories/session/session.entity';
import { UserEntity } from '@app/dal/repositories/user';
import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseCredentials = {
  host: 'vm-sight-pgdb',
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  schema: 'public',
};

const entities = [UserEntity, RoleEntity, SessionEntity, EndpointEntity, EndpointUsersEntity];

export const defaultDatabaseConfig = {
  type: 'postgres',
  synchronize: true,
  entities,
  migrationsTableName: 'migration',
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const dbConfig = registerAs('db', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));
