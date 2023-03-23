import { ErrorRequestHandler } from 'express';

import { API_ERROR_NAME, API_ERRORS } from '../lib/api-error';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error.name === API_ERROR_NAME) {
    return res
      .status(error.statusCode)
      .json({ error: error.errorName, message: error.message });
  }

  const serverError = API_ERRORS.internalServerError;

  res
    .status(serverError.statusCode)
    .json({ error: serverError.errorName, message: 'Unexpected error' });
};

export default errorHandler;
