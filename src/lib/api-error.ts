export const API_ERROR_NAME = 'ApiError';

export const API_ERRORS = {
  badRequest: {
    errorName: 'Bad Request',
    statusCode: 400,
  },
  unauthorized: {
    errorName: 'Unauthorized',
    statusCode: 401,
  },
  forbidden: {
    errorName: 'Forbidden',
    statusCode: 403,
  },
  notFound: {
    errorName: 'Not Found',
    statusCode: 404,
  },
  internalServerError: {
    errorName: 'Internal Server Error',
    statusCode: 500,
  },
};

class ApiError extends Error {
  public errorName: string;
  public statusCode: number;

  constructor(message: string, code: keyof typeof API_ERRORS) {
    super(message);

    const { errorName, statusCode } = API_ERRORS[code];

    this.errorName = errorName;
    this.statusCode = statusCode;
    this.name = API_ERROR_NAME;
  }
}

export default ApiError;
