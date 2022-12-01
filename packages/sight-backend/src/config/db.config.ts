import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const databaseCredentials = {
  database: 'sight.db',
};

export const defaultDatabaseConfig = {
  type: 'sqlite',
  logging: false,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['src/migrations/**/*.{ts,js}'],
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: 'src/migrations',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export const dbConfig = registerAs('databaseConfiguration', () => ({
  ...defaultDatabaseConfig,
  ...databaseCredentials,
}));
