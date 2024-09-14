import { validateRequest } from 'zod-express';

import * as api from '../api';
import { getUserProfileSchema, putUserProfileSchema, uploadAvatarSchema } from './schema';

export function validateGetUserProfile() {
  return validateRequest(getUserProfileSchema, {
    sendErrors: (errors, res) => {
      const errorMessages = errors[0]!.errors.errors[0]!.message;
      api.badRequest(res, 400, errorMessages);
    },
  });
}

export function validatePutUserProfile() {
  return validateRequest(putUserProfileSchema, {
    sendErrors: (errors, res) => {
      const errorMessages = errors[0]!.errors.errors[0]!.message;
      api.badRequest(res, 400, errorMessages);
    },
  });
}

export function validateUploadAvatar() {
  return validateRequest(uploadAvatarSchema, {
    sendErrors: (errors, res) => {
      const errorMessages = errors[0]!.errors.errors[0]!.message;
      api.badRequest(res, 400, errorMessages);
    },
  });
}
