const request = require('supertest');
const server = require('../../server');
let jwtToken;
let towerId;
let officeId;

beforeAll(async () => {
  const response = await request(server)
    .post("/auth/login")
    .send({ email: 'test@jc.com', password: 'test1234' })
    .expect(200);
  jwtToken = response.body.accessToken;
});


describe('Office Integration Test', () => {
  it('should return created office!', async () => {
    await request(server)
      .post("/tower")
      .send({ name: 'TOffice', location: 'AUH', lat: '54.382951', long: '11.1', floors: 5, rate: 4 })
      .set('Authorization', 'JWT ' + jwtToken)
      .expect(200);
  });

  it('should return one tower created', async () => {
    const response = await request(server)
      .get("/tower?c[name]=TOffice")
      .expect(200);
    const towers = response.body;
    towerId = towers[0].id;
  });
  it('should return create an office in tower', async () => {
    const response = await request(server)
      .post("/office")
      .send({ name: 'TOffice', number: 'O123ASD', towerId })
      .set('Authorization', 'JWT ' + jwtToken)
      .expect(200);
    officeId = response.body.id;
  });
  it('should delete the office', async () => {
    await request(server)
      .delete(`/office/${officeId}`)
      .set('Authorization', 'JWT ' + jwtToken)
      .expect(200);

  });
  it('should delete the tower', async () => {
    await request(server)
      .delete(`/tower/${towerId}`)
      .set('Authorization', 'JWT ' + jwtToken)
      .expect(200);
  });
});
