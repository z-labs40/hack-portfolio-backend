import dotenv from 'dotenv';
import defaultConfig from './default';
import { Logger } from '../shared/logger';

dotenv.config();

export interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}

export interface AppConfig {
  port: number;
  env: string;
  frontendUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  db: DBConfig;
  upload: {
    maxSizeMb: number;
    uploadDir: string;
  };
}

export class Config {
  public static config: AppConfig | null = null;

  private static validate = (config: AppConfig): void => {
    const requiredVars = [
      { key: 'JWT_SECRET', value: config.jwt.secret },
      { key: 'DB_HOST', value: config.db.host },
      { key: 'DB_USER', value: config.db.user },
      { key: 'DB_PASSWORD', value: config.db.password },
      { key: 'DB_NAME', value: config.db.name },
    ];

    const missing = requiredVars
      .filter((v) => !v.value || v.value.toString().trim() === '')
      .map((v) => v.key);

    if (missing.length > 0) {
      Logger.error(`❌ Missing environment variables: ${missing.join(', ')}`);
      Logger.error(`🛑 Process exiting due to configuration error.`);
      process.exit(1);
    }

    Logger.info('✅ Configuration validated successfully.');
  };

  private static load = (): AppConfig => {
    const loadedConfig = defaultConfig();
    Config.validate(loadedConfig);
    return loadedConfig;
  };

  static get = (): AppConfig => {
    if (!Config.config) {
      Config.config = this.load();
    }
    return Config.config;
  };
}

export const config = Config.get();
