import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const databaseCredentials = {
  database: './data/sight.db',
};

export const defaultDatabaseConfig = {
  type: 'sqlite',
  logging: false,
  synchronize: true,
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
