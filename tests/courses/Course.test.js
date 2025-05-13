const request = require('supertest');
const app = require('../../app');

describe('Course API', () => {
  let createdId;

  it('should create a Course', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .send({
      code: "code_value",
      name: "name_value",
      departmentIds: null,
      branchIds: null,
      durationInMonths: 1,
      courseFees: null,
      courseDescription: "courseDescription_value",
      isDeleted: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all Courses', async () => {
    const res = await request(app).get('/api/v1/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch Course by ID', async () => {
    const res = await request(app).get(`/api/v1/courses/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update Course', async () => {
    const res = await request(app)
      .put(`/api/v1/courses/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete Course', async () => {
    const res = await request(app).delete(`/api/v1/courses/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
