const request = require('supertest');
const app = require('../../app');

describe('User API', () => {
  let createdId;

  it('should create a User', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
      email: "test@example.com",
      roles: "roles_value",
      password: "password_value",
      firstName: null,
      lastName: null,
      isDeleted: false,
      contact: null,
      employeeId: "employeeId_value",
      managerEmail: "test@example.com",
      manager: "manager_value",
      displayName: "displayName_value",
      isSuperAdmin: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all Users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch User by ID', async () => {
    const res = await request(app).get(`/api/v1/users/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update User', async () => {
    const res = await request(app)
      .put(`/api/v1/users/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete User', async () => {
    const res = await request(app).delete(`/api/v1/users/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
