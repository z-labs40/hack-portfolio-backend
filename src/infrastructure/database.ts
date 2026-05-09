import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config';
import { Logger } from '../shared/logger';
import { User } from '../adapters/models/User';
import { Project } from '../adapters/models/Project';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: config.env === 'development', // Only for development; use migrations for production
  logging: false,
  entities: [User, Project],
  subscribers: [],
  migrations: [],
  ssl: {
    rejectUnauthorized: false, // Required for Supabase in many environments
  },
});

export async function initializeDataSource(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      Logger.info('🔌 Attempting to connect to PostgreSQL...');
      await AppDataSource.initialize();
      Logger.info('✅ Database connection established successfully.');

      // Run migrations automatically
      Logger.info('🏃 Running auto-migrations...');
      await AppDataSource.runMigrations();
      Logger.info('✅ Auto-migrations completed.');
    }
  } catch (error) {
    Logger.error(`❌ Failed to initialize database connection: ${error}`);
    throw error;
  }
}
