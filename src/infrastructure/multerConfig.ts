import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { Request } from 'express';

// Ensure upload directory exists
const uploadDir = config.upload.uploadDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const sanitized = path
      .basename(file.originalname)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files (JPG, PNG, GIF, WEBP, SVG) are allowed'));
    }
    cb(null, true);
  },
});

export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files (JPG, PNG, GIF, WEBP, SVG) are allowed'));
    }
    cb(null, true);
  },
});
