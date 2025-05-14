const request = require('supertest');
const app = require('../../app');

describe('bank API', () => {
  let createdId;

  it('should create a bank', async () => {
    const res = await request(app)
      .post('/api/v1/banks')
      .send({
      name: "name_value",
      slug: "slug_value",
      branch: "branch_value",
      isDeleted: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all banks', async () => {
    const res = await request(app).get('/api/v1/banks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch bank by ID', async () => {
    const res = await request(app).get(`/api/v1/banks/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update bank', async () => {
    const res = await request(app)
      .put(`/api/v1/banks/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete bank', async () => {
    const res = await request(app).delete(`/api/v1/banks/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
