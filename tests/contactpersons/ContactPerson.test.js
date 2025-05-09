const request = require('supertest');
const app = require('../../app');

describe('ContactPerson API', () => {
  let createdId;

  it('should create a ContactPerson', async () => {
    const res = await request(app)
      .post('/api/v1/contactpersons')
      .send({
      name: "name_value",
      phone: "phone_value",
      email: "test@example.com",
      isDeleted: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all ContactPeople', async () => {
    const res = await request(app).get('/api/v1/contactpersons');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch ContactPerson by ID', async () => {
    const res = await request(app).get(`/api/v1/contactpersons/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update ContactPerson', async () => {
    const res = await request(app)
      .put(`/api/v1/contactpersons/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete ContactPerson', async () => {
    const res = await request(app).delete(`/api/v1/contactpersons/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
