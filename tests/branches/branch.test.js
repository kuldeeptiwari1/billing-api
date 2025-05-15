const request = require('supertest');
const app = require('../../app');

describe('branch API', () => {
  let createdId;

  it('should create a branch', async () => {
    const res = await request(app).post('/api/v1/branches').send({
      name: 'name_value',
      slug: 'slug_value',
      code: 'code_value',
      address: 'address_value',
      email: 'test@example.com',
      contact: 'contact_value',
      closingDay: 5,
      isDeleted: false
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all branches', async () => {
    const res = await request(app).get('/api/v1/branches');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch branch by ID', async () => {
    const res = await request(app).get(`/api/v1/branches/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update branch', async () => {
    const res = await request(app).put(`/api/v1/branches/${createdId}`).send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete branch', async () => {
    const res = await request(app).delete(`/api/v1/branches/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
