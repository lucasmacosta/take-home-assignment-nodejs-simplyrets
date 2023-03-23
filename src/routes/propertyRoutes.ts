import express from 'express';
import bodyParser from 'body-parser';

export const propertyRoutes = express.Router();

import {
  searchProperties,
  getProperty,
  insertProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/properties';
import buildValidationMiddleware from '../middlewares/validation';
import {
  searchQuerySchema,
  requestBodySchema,
  pathParamsSchema,
} from '../validations/properties';

propertyRoutes.use(bodyParser.json());

propertyRoutes.get(
  '/',
  buildValidationMiddleware('query', searchQuerySchema),
  searchProperties,
);

propertyRoutes.get(
  '/:id',
  buildValidationMiddleware('params', pathParamsSchema),
  getProperty,
);

propertyRoutes.post(
  '/',
  buildValidationMiddleware('body', requestBodySchema),
  insertProperty,
);

propertyRoutes.put(
  '/:id',
  buildValidationMiddleware('params', pathParamsSchema),
  buildValidationMiddleware('body', requestBodySchema),
  updateProperty,
);

propertyRoutes.delete(
  '/:id',
  buildValidationMiddleware('params', pathParamsSchema),
  deleteProperty,
);
