import Joi from 'joi';

import config from '../config';
import { SearchQuery, RequestBody, PathParams } from '../types/properties';

const { pagination } = config;

export const searchQuerySchema = Joi.object<SearchQuery>({
  page: Joi.number().integer().min(1).default(pagination.defaultPage),
  pageSize: Joi.number()
    .integer()
    .min(pagination.minPageSize)
    .max(pagination.maxPageSize)
    .default(pagination.defaultPageSize),
  address: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number(),
  minBedrooms: Joi.number().integer().min(0),
  maxBedrooms: Joi.number().integer(),
  minBathrooms: Joi.number().integer().min(0),
  maxBathrooms: Joi.number().integer(),
  type: Joi.array().single(),
});

export const requestBodySchema = Joi.object<RequestBody>({
  address: Joi.string().required().min(1),
  price: Joi.number().required().min(0),
  bedrooms: Joi.number().integer().required().min(0),
  bathrooms: Joi.number().integer().required().min(0),
  type: Joi.string(),
});

export const pathParamsSchema = Joi.object<PathParams>({
  id: Joi.number().integer().required().min(0),
});
