import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { networkInterfaces } from 'os';
import { config, AppConfig } from '../config';
import { initializeDataSource } from '../infrastructure/database';
import { Logger } from '../shared/logger';
import { errorHandler, loggerMiddleware } from './middleware';
import registerRoutes from './routes';

const app = express();

let isAppReady = false;
let resolveAppReady: () => void;
const appReadyPromise = new Promise<void>((resolve) => {
  resolveAppReady = resolve;
});

// Health check endpoint — available immediately before DB is ready
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// Readiness probe middleware — delays requests until app is fully initialized
app.use(async (req, res, next) => {
  if (req.path === '/health' || isAppReady) {
    return next();
  }
  try {
    await appReadyPromise;
    next();
  } catch (err) {
    next(err);
  }
});

// Standard middleware
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        config.frontendUrl,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), config.upload.uploadDir)));

// ── Helper: get local network IP ──────────────────────────────────────────────
const getLocalIPAddress = (): string => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netInterface = nets[name];
    if (!netInterface) continue;
    for (const net of netInterface) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

// ── Server bootstrap ──────────────────────────────────────────────────────────
const startHTTPServer = async (cfg: AppConfig) => {
  Logger.info('🚀 Starting hack-portfolio-backend...');
  const localIP = getLocalIPAddress();
  const PORT = cfg.port;

  // Start HTTP server first so the container/process listens immediately
  const server = app.listen(PORT, '0.0.0.0', () => {
    Logger.info(`🚀 Server listening on http://0.0.0.0:${PORT}`);
    Logger.info(`📱 Local:   http://localhost:${PORT}`);
    Logger.info(`📱 Network: http://${localIP}:${PORT}`);
    Logger.info(`💚 Health:  http://localhost:${PORT}/health`);
  });

  server.on('error', (error: any) => {
    Logger.error(`❌ Server error: ${error}`);
    if (error.code === 'EADDRINUSE') {
      Logger.error(`Port ${PORT} is already in use`);
    }
    process.exit(1);
  });

  // Initialize DB after server is already listening
  try {
    await initializeDataSource();
    Logger.info('✅ Database initialized');
  } catch (err) {
    Logger.error(`❌ Database initialization failed: ${err}`);
    Logger.error('⚠️  Server is running but database is not connected');
  }

  // Register routes
  try {
    registerRoutes(app);
    Logger.info('✅ Routes initialized');
  } catch (err) {
    Logger.error(`❌ Route initialization failed: ${err}`);
  } finally {
    isAppReady = true;
    resolveAppReady!();
  }

  // Global error handler (must be last)
  app.use(errorHandler);
};

// ── Process error handling ────────────────────────────────────────────────────
process.on('uncaughtException', (error: Error) => {
  Logger.error(`❌ Uncaught Exception: ${error.message}`);
  Logger.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  Logger.error(`❌ Unhandled Rejection: ${reason}`);
});

process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

startHTTPServer(config).catch((error) => {
  Logger.error(`❌ Failed to start server: ${error}`);
  process.exit(1);
});
