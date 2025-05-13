const request = require('supertest');
const app = require('../../app');

describe('Receipt API', () => {
  let createdId;

  it('should create a Receipt', async () => {
    const res = await request(app)
      .post('/api/v1/receipts')
      .send({
      receiptNo: "receiptNo_value",
      receiptDate: "2025-05-08T12:21:19.855Z",
      studentId: "studentId_value",
      contactPersonIds: "contactPersonIds_value",
      totalAmount: "totalAmount_value",
      paidReceiptAmount: "paidReceiptAmount_value",
      paidAmount: "paidAmount_value",
      remainingAmount: "remainingAmount_value",
      fineAmount: "fineAmount_value",
      paymentMode: "paymentMode_value",
      paymentModeType: "paymentModeType_value",
      paymentModeName: "paymentModeName_value",
      bookIssue: "bookIssue_value",
      bookCode: "bookCode_value",
      ReceiptType: "ReceiptType_value",
      paymentDetails: "paymentDetails_value",
      notes: "notes_value",
      isDeleted: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all Receipts', async () => {
    const res = await request(app).get('/api/v1/receipts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch Receipt by ID', async () => {
    const res = await request(app).get(`/api/v1/receipts/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update Receipt', async () => {
    const res = await request(app)
      .put(`/api/v1/receipts/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete Receipt', async () => {
    const res = await request(app).delete(`/api/v1/receipts/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
