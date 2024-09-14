export const ApiStatus = {
  OK: 200,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  MethodNotAllowed: 405,
  Timeout: 408,
  Conflict: 409,
  PreconditionFailed: 412,
  RequestTooLarge: 413,
  UnsupportedMediaType: 415,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
} as const;

export const ApiStatusText: Record<number, keyof typeof ApiStatus> = {
  200: 'OK',
  400: 'BadRequest',
  401: 'Unauthorized',
  404: 'NotFound',
  403: 'Forbidden',
  405: 'MethodNotAllowed',
  408: 'Timeout',
  409: 'Conflict',
  412: 'PreconditionFailed',
  413: 'RequestTooLarge',
  415: 'UnsupportedMediaType',
  422: 'UnprocessableEntity',
  429: 'TooManyRequests',
  500: 'InternalServerError',
  501: 'NotImplemented',
  502: 'BadGateway',
  503: 'ServiceUnavailable',
};

export class ApiError extends Error {
  constructor(
    readonly code: number,
    override readonly message: string,
  ) {
    super(message);
  }

  override get name(): string {
    return 'ApiError';
  }

  clone() {
    return new ApiError(this.code, this.message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals(error: any) {
    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty('code')) {
      return this.code === error.code;
    }
    return false;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }

  static getReasonPhrase(code: number): string {
    if (code in ApiStatusText) {
      return ApiStatusText[code] as string;
    }

    return 'InternalServerError';
  }

  static resolve(code: number, message?: string): ApiError {
    if (code in ApiStatusText) {
      return new ApiError(code, message ?? (ApiStatusText[code] as string));
    }
    return new ApiError(ApiStatus.InternalServerError, 'InternalServerError');
  }
}
