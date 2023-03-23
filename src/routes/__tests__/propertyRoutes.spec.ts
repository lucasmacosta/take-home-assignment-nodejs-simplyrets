import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  describe('GET /properties', () => {
    it('should return the first page of properties', async () => {
      const response = await request(app).get('/properties');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        count: 126,
        items: expect.any(Array),
      });
      expect(response.body.items.length).toEqual(10);
      expect(response.body.items[0]).toEqual({
        id: 1,
        address: '74434 East Sweet Bottom Br #18393',
        price: 20714261,
        bedrooms: 2,
        bathrooms: 5,
        type: null,
      });
    });

    it('should allow to paginate search results', async () => {
      const response = await request(app).get('/properties').query({
        page: 2,
        pageSize: 20,
      });

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        count: 126,
        items: expect.any(Array),
      });
      expect(response.body.items.length).toEqual(20);
      expect(response.body.items[0]).toEqual({
        id: 21,
        address: '52876 North Newark Blvd B Trace #2035',
        price: 18065342,
        bedrooms: 4,
        bathrooms: 6,
        type: 'Townhouse',
      });
    });

    it('should allow to filter properties with different params', async () => {
      const response = await request(app)
        .get('/properties')
        .query({
          page: 1,
          pageSize: 10,
          address: 'north newark',
          minPrice: 18000000,
          maxPrice: 19000000,
          minBedrooms: 3,
          maxBedrooms: 5,
          minBathrooms: 5,
          maxBathrooms: 6,
          type: ['Townhouse', 'Another'],
        });

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        count: 3,
        items: expect.any(Array),
      });
      expect(response.body.items.length).toEqual(3);
      expect(response.body.items[0]).toEqual({
        id: 21,
        address: '52876 North Newark Blvd B Trace #2035',
        price: 18065342,
        bedrooms: 4,
        bathrooms: 6,
        type: 'Townhouse',
      });
    });

    it('should fail if query params are invalid', async () => {
      const response = await request(app).get('/properties').query({
        page: 'foo',
      });

      expect(response.status).toEqual(400);
    });
  });

  describe('GET /properties/:id', () => {
    it('should return the requested property', async () => {
      const response = await request(app).get('/properties/1');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 1,
        address: '74434 East Sweet Bottom Br #18393',
        price: 20714261,
        bedrooms: 2,
        bathrooms: 5,
        type: null,
      });
    });

    it('should fail if requested property does not exists', async () => {
      const response = await request(app).get('/properties/130');

      expect(response.status).toEqual(404);
    });

    it('should fail if path param is invalid', async () => {
      const response = await request(app).get('/properties/foo');

      expect(response.status).toEqual(400);
    });
  });

  describe('POST /properties', () => {
    it('should create a new property', async () => {
      const response = await request(app).post('/properties').send({
        address: '12354 Another Boring Street #18393',
        price: 20123456,
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 127,
        address: '12354 Another Boring Street #18393',
        price: 20123456,
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });
    });

    it('should fail if required field is missing', async () => {
      const response = await request(app).post('/properties').send({
        price: 20123456,
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(400);
    });

    it('should fail if required field format is invalid', async () => {
      const response = await request(app).post('/properties').send({
        address: '12354 Another Boring Street #18393',
        price: 'foo',
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(400);
    });
  });

  describe('PUT /properties/:id', () => {
    it('should update an existing property', async () => {
      const response = await request(app).put('/properties/127').send({
        address: '54321 Another Fun Street #99881',
        price: 20654321,
        bedrooms: 5,
        bathrooms: 4,
        type: 'Apartment',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 127,
        address: '54321 Another Fun Street #99881',
        price: 20654321,
        bedrooms: 5,
        bathrooms: 4,
        type: 'Apartment',
      });
    });

    it('should fail if property does not exists', async () => {
      const response = await request(app).put('/properties/130').send({
        address: '54321 Another Fun Street #99881',
        price: 20654321,
        bedrooms: 5,
        bathrooms: 4,
        type: 'Apartment',
      });

      expect(response.status).toEqual(400);
    });

    it('should fail if required field is missing', async () => {
      const response = await request(app).put('/properties/127').send({
        price: 20123456,
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(400);
    });

    it('should fail if required field format is invalid', async () => {
      const response = await request(app).put('/properties/127').send({
        address: '12354 Another Boring Street #18393',
        price: 'foo',
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(400);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should delete an existing property', async () => {
      const response = await request(app).delete('/properties/127');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 127,
        address: '54321 Another Fun Street #99881',
        price: 20654321,
        bedrooms: 5,
        bathrooms: 4,
        type: 'Apartment',
      });
    });

    it('should fail if property does not exists', async () => {
      const response = await request(app).delete('/properties/127');

      expect(response.status).toEqual(404);
    });

    it('should fail if path param format is invalid', async () => {
      const response = await request(app).delete('/properties/foo');

      expect(response.status).toEqual(400);
    });
  });
});
