const request = require('supertest');
const app = require('../../app');

describe('department API', () => {
  let createdId;

  it('should create a department', async () => {
    const res = await request(app).post('/api/v1/departments').send({
      name: 'name_value',
      slug: 'slug_value',
      code: 'code_value',
      description: null,
      closingDate: 5,
      isDeleted: false
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all departments', async () => {
    const res = await request(app).get('/api/v1/departments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch department by ID', async () => {
    const res = await request(app).get(`/api/v1/departments/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update department', async () => {
    const res = await request(app).put(`/api/v1/departments/${createdId}`).send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete department', async () => {
    const res = await request(app).delete(`/api/v1/departments/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
