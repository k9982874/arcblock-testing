import middleware from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import multer from 'multer';

import * as api from '../api';
import { validateGetUserProfile, validatePutUserProfile, validateUploadAvatar } from '../middleware/validation';
import { getProfile, putProfile, uploadAvatar } from './profile';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } }).single('avatar');

const router = Router();

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

router.get('/profile/:id', validateGetUserProfile(), getProfile);
router.put('/profile/:id', validatePutUserProfile(), putProfile);
router.post(
  '/profile/:id/avatar',
  validateUploadAvatar(),
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return api.badRequest(res, 400, 'File size too large');
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return api.badRequest(res, 400, 'Unexpected avatar file');
          }
          return api.badRequest(res, 400, 'Invalid avatar file');
        }

        return api.internalServerError(res, 500, 'The server is now unable to deal with this request');
      }
      next();
    });
  },
  uploadAvatar,
);

export default router;
