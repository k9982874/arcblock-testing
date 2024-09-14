import { createAxios } from '@blocklet/js-sdk';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from './errors';

interface Response<T> {
  code: number;
  message: string;
  data: T | undefined;
}

export type Profile = {
  username: string;
  email: string;
  phone?: string;
  gender?: number;
  birthday?: string;
  avatar?: string;
};

const api = createAxios({
  baseURL: window?.blocklet?.prefix || '/',
});

export function useGetProfileAPI(userId: number, options?: UseQueryOptions<Profile>) {
  return useQuery<Profile>({
    ...options,
    queryKey: ['getProfile', userId],
    queryFn: async () => {
      try {
        const res = await api.get<Response<Profile>>(`/api/profile/${userId}`);
        if (res.status !== 200) {
          throw ApiError.resolve(res.data.code, res.data.message);
        }
        return res.data.data!;
      } catch (err) {
        throw ApiError.cause(err as Error);
      }
    },
  });
}

export function usePutProfileAPI(userId: number, options?: UseMutationOptions<unknown, Error, Profile, unknown>) {
  return useMutation<unknown, Error, Profile, unknown>({
    ...options,
    mutationKey: ['putProfile', userId],
    mutationFn: async (profile) => {
      try {
        await api.put<Response<unknown>>(`/api/profile/${userId}`, profile);
      } catch (err) {
        throw ApiError.cause(err as Error);
      }
    },
  });
}

export function useUploadAvatarAPI(
  userId: number,
  options?: UseMutationOptions<{ avatar: string }, Error, File, unknown>,
) {
  return useMutation<{ avatar: string }, Error, File, unknown>({
    ...options,
    mutationKey: ['uploadAvatar', userId],
    mutationFn: async (file) => {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await api.post(`/api/profile/${userId}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return { avatar: res.data.data?.avatar };
      } catch (err) {
        throw ApiError.cause(err as Error);
      }
    },
  });
}

export default api;
