import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseCredentials = {
  host: 'vm-sight-pgdb',
  username: 'postgres',
  password: '',
  database: 'vm-sight',
};

const entities: any = [];

export const defaultDatabaseConfig = {
  type: 'postgres',
  logging: ['error'],
  synchronize: false,
  schema: 'public',
  entities,
  migrationsTableName: 'migration',
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const dbConfig = registerAs('db', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));
