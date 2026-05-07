import { Response, Router } from 'express';
import { upload } from '../../infrastructure/multerConfig';
import { authMiddleware } from '../../frameworks/middleware';
import { AppError } from '../../shared/error';
import { Logger } from '../../shared/logger';
import { SuccessResponse } from '../../frameworks/types';

export class UploadController {
  public router: Router = Router();

  constructor() {
    this.router.post('/', authMiddleware, upload.single('file'), this.uploadFile.bind(this));
  }

  async uploadFile(req: any, res: any, next: any) {
    try {
      if (!req.file) {
        throw new AppError("No file uploaded. Use field name 'file'.", 400);
      }

      const fileName = req.file.filename;
      const publicUrl = `/uploads/${fileName}`;

      Logger.info(`📁 File uploaded: ${fileName}`);

      return res.status(200).json({
        ok: true,
        data: {
          fileName,
          publicUrl,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size,
        },
      } as SuccessResponse<any>);
    } catch (error) {
      return next(error);
    }
  }
}
