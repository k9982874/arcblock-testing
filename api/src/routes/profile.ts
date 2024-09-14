import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

import * as api from '../api';

const prisma = new PrismaClient();

export async function getProfile(req: Request<{ id: string }>, res: Response) {
  const user = await prisma.user.findFirst({
    where: { id: Number.parseInt(req.params.id, 10) },
  });
  if (!user) {
    return api.notFound(res);
  }

  return api.success(res, {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birthday: user.birthday ? dayjs(user.birthday).format('YYYY-MM-DD') : undefined,
    avatar: user.avatar,
  });
}

export async function putProfile(
  req: Request<
    { id: string },
    any,
    {
      username: string;
      email: string;
      phone?: string;
      gender?: number;
      birthday?: string;
    }
  >,
  res: Response,
) {
  try {
    await prisma.user.update({
      where: { id: Number.parseInt(req.params.id, 10) },
      data: {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        birthday: req.body.birthday ? dayjs(req.body.birthday).toISOString() : undefined,
      },
    });
    return api.success(res);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return api.notFound(res, 404, 'User record not found');
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      return api.badRequest(res, 400, err.message);
    }
    return api.internalServerError(res, 500, 'The server is now unable to deal with this request');
  }
}

export async function uploadAvatar(req: Request<{ id: string }, any, any>, res: Response) {
  if (!req.file) {
    return api.badRequest(res, 400, 'No avatarfile to uploaded');
  }

  try {
    const encoded = req.file.buffer.toString('base64');
    const avatar = `data:${req.file.mimetype};base64,${encoded}`;

    await prisma.user.update({
      where: { id: Number.parseInt(req.params.id, 10) },
      data: { avatar },
    });
    return api.success(res, { avatar });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return api.notFound(res, 404, 'User record not found');
      }
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      return api.badRequest(res, 400, err.message);
    }
    return api.internalServerError(res, 500, 'The server is now unable to deal with this request');
  }
}
