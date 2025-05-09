const request = require('supertest');
const app = require('../../app');

describe('invoice API', () => {
  let createdId;

  it('should create a invoice', async () => {
    const res = await request(app)
      .post('/api/v1/invoices')
      .send({
      invoiceNo: "invoiceNo_value",
      studentName: "studentName_value",
      studentId: "studentId_value",
      issueDate: "2025-05-08T11:49:40.301Z",
      taxPercentage: "taxPercentage_value",
      discount: "discount_value",
      totalPrice: "totalPrice_value",
      couresAmount: "couresAmount_value",
      totalDiscount: "totalDiscount_value",
      subTotal: "subTotal_value",
      totalTaxes: "totalTaxes_value",
      finalAmount: "finalAmount_value",
      isDeleted: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all invoices', async () => {
    const res = await request(app).get('/api/v1/invoices');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch invoice by ID', async () => {
    const res = await request(app).get(`/api/v1/invoices/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update invoice', async () => {
    const res = await request(app)
      .put(`/api/v1/invoices/${createdId}`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete invoice', async () => {
    const res = await request(app).delete(`/api/v1/invoices/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
