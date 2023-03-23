import { Repository } from 'typeorm';

import AppDataSource from '../dataSource';
import { Property } from '../entities';
import { SearchQuery, RequestBody } from '../types/properties';

const propertyRepository = AppDataSource.getRepository(Property);

export class PropertyService {
  constructor(private propertyRepository: Repository<Property>) {}

  async get(params: SearchQuery) {
    const {
      page,
      pageSize,
      address,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      type,
    } = params;
    const offset = (page - 1) * pageSize;

    const queryBuilder = this.propertyRepository.createQueryBuilder('property');

    if (address) {
      queryBuilder.andWhere('property.address LIKE :address', {
        address: `%${address}%`,
      });
    }

    if (minPrice) {
      queryBuilder.andWhere('property.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('property.price <= :maxPrice', { maxPrice });
    }

    if (minBedrooms) {
      queryBuilder.andWhere('property.bedrooms >= :minBedrooms', {
        minBedrooms,
      });
    }

    if (maxBedrooms) {
      queryBuilder.andWhere('property.bedrooms <= :maxBedrooms', {
        maxBedrooms,
      });
    }

    if (minBathrooms) {
      queryBuilder.andWhere('property.bathrooms >= :minBathrooms', {
        minBathrooms,
      });
    }

    if (maxBathrooms) {
      queryBuilder.andWhere('property.bathrooms <= :maxBathrooms', {
        maxBathrooms,
      });
    }

    if (type) {
      queryBuilder.andWhere('property.type IN (:...type)', { type });
    }

    const [count, items] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.limit(pageSize).offset(offset).getMany(),
    ]);

    return {
      items,
      count,
    };
  }

  async getById(id: number) {
    return this.propertyRepository
      .createQueryBuilder('property')
      .where('property.id = :id', { id })
      .getOne();
  }

  async create(params: RequestBody) {
    const result = await this.propertyRepository
      .createQueryBuilder('property')
      .insert()
      .into(Property)
      .values(params)
      .execute();

    const newIdObj = result.identifiers.shift();

    if (!newIdObj) {
      return null;
    }

    return this.getById(newIdObj.id);
  }

  async update(id: number, params: RequestBody) {
    const result = await this.propertyRepository
      .createQueryBuilder('property')
      .update(Property)
      .set(params)
      .where('property.id = :id', { id })
      .execute();

    if (result.affected !== 1) {
      return null;
    }

    return this.getById(id);
  }

  async delete(id: number) {
    const item = await this.getById(id);

    if (!item) {
      return null;
    }

    await this.propertyRepository
      .createQueryBuilder('property')
      .delete()
      .from(Property)
      .where('property.id = :id', { id })
      .execute();

    return item;
  }
}

export const propertyService = new PropertyService(propertyRepository);
