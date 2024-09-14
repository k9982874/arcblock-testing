import { z } from 'zod';

export const getUserProfileSchema = {
  params: z.object({
    id: z.string().refine((id) => !Number.isNaN(Number(id)), {
      message: 'User ID is invalid',
    }),
  }),
};

export const putUserProfileSchema = {
  params: z.object({
    id: z.string().refine((id) => !Number.isNaN(Number(id)), {
      message: 'User ID is invalid',
    }),
  }),
  body: z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters',
    }),
    email: z.string().email({
      message: 'Email is invalid',
    }),
    phone: z
      .string()
      .regex(/^(?:(?:\+|00)86)?1\d{10}$/, {
        message: 'Phone number is invalid',
      })
      .optional(),
    gender: z.number().min(-1, 'Gender is invalid').max(1, 'Gender is invalid').optional(),
    birthday: z.string().date('Birthday is invalid').optional(),
  }),
};

export const uploadAvatarSchema = {
  params: z.object({
    id: z.string().refine((id) => !Number.isNaN(Number(id)), {
      message: 'User ID is invalid',
    }),
  }),
};
