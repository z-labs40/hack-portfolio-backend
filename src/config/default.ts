import { AppConfig } from './index';
import { Logger } from '../shared/logger';

export default (): AppConfig => {
  Logger.info('📦 Loading system configurations from environment..');
  return {
    port: Number(process.env.PORT) || 3001,
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    db: {
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      name: process.env.DB_NAME as string,
    },
    upload: {
      maxSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10,
      uploadDir: process.env.UPLOAD_DIR || 'uploads',
    },
  };
};
