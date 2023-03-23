import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import ApiError from '../lib/api-error';

type RequestPart = 'body' | 'query' | 'params';

function buildValidationMiddleware<T>(
  requestPart: RequestPart,
  schema: Joi.Schema<T>,
) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { error, value } = schema.validate(req[requestPart]);

    if (error) {
      throw new ApiError('Invalid Request', 'badRequest');
    }

    let reqField: string;

    switch (requestPart) {
      case 'body':
        reqField = 'validatedBody';
        break;
      case 'query':
        reqField = 'validatedQuery';
        break;
      case 'params':
        reqField = 'validatedParams';
        break;
    }

    res.locals[reqField] = value;

    next();
  };
}

export default buildValidationMiddleware;
