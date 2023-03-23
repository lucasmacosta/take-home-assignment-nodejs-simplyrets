import { RequestHandler } from 'express';

import { propertyService } from '../services';
import { SearchQuery, PathParams, RequestBody } from '../types/properties';
import ApiError from '../lib/api-error';

export const searchProperties: RequestHandler = async (req, res) => {
  const params = res.locals.validatedQuery as SearchQuery;

  const properties = await propertyService.get(params);

  res.send(properties);
};

export const getProperty: RequestHandler = async (req, res) => {
  const { id } = res.locals.validatedParams as PathParams;

  const property = await propertyService.getById(id);

  if (!property) {
    throw new ApiError('Property not found', 'notFound');
  }

  res.send(property);
};

export const insertProperty: RequestHandler = async (req, res) => {
  const body = res.locals.validatedBody as RequestBody;

  const property = await propertyService.create(body);

  if (!property) {
    throw new ApiError('Error while creating property', 'internalServerError');
  }

  res.send(property);
};

export const updateProperty: RequestHandler = async (req, res) => {
  const { id } = res.locals.validatedParams as PathParams;
  const body = res.locals.validatedBody as RequestBody;

  const property = await propertyService.update(id, body);

  if (!property) {
    throw new ApiError('Property not found', 'notFound');
  }

  res.send(property);
};

export const deleteProperty: RequestHandler = async (req, res) => {
  const { id } = res.locals.validatedParams as PathParams;

  const property = await propertyService.delete(id);

  if (!property) {
    throw new ApiError('Property not found', 'notFound');
  }

  res.send(property);
};
