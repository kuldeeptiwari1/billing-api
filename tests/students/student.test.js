const request = require('supertest');
const app = require('../../app');

describe('student API', () => {
  let createdId;

  it('should create a student', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .send({
      name: "name_value",
      email: "test@example.com",
      phone: "phone_value",
      gender: "gender_value",
      dateOfBirth: "2025-05-07T18:44:22.524Z",
      state: "state_value",
      city: "city_value",
      degreee: "degreee_value",
      courseName: "courseName_value",
      collegeName: "collegeName_value",
      passingYear: "passingYear_value",
      modeOfClass: "modeOfClass_value",
      department: "department_value",
      totalFees: "totalFees_value",
      paidAmount: "paidAmount_value",
      remainingFees: "remainingFees_value",
      feesDueDate: "2025-05-07T18:44:22.524Z",
      preferredBranch: "preferredBranch_value",
      paymentMode: "paymentMode_value",
      documentType: "documentType_value",
      documentNo: "documentNo_value",
      profession: "profession_value",
      preferredBatch: "preferredBatch_value",
      counsellorName: "counsellorName_value",
      isDeleted: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all students', async () => {
    const res = await request(app).get('/api/v1/students');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch student by ID', async () => {
    const res = await request(app).get(`/api/v1/students/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update student', async () => {
    const res = await request(app)
      .put(`/api/v1/students/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete student', async () => {
    const res = await request(app).delete(`/api/v1/students/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
