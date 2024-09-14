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
    username: z.string()
      .min(2, { message: 'User name must be at least 2 characters' })
      .max(32, { message: 'User name must be less than or equal to 16 characters' }),
    email: z.string().email({
      message: 'Email is invalid',
    }),
    phone: z
      .string()
      .regex(/^(?:(?:\+|00)86)?1\d{10}$/, {
        message: 'Phone number is invalid',
      })
      .optional(),
    gender: z.number()
      .refine((value) => value >= -1 && value <= 1, {
        message: 'Gender is invalid',
      })
      .optional(),
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
