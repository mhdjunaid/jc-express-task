const request = require('supertest');
const server = require('../../server');
const { sequelize } = require('../../database/models/index');
let jwtToken;
beforeAll(async () => {
  const response = await request(server)
    .post("/auth/login")
    .send({ email: 'test@jc.com', password: 'test1234' })
    .expect(200);
  jwtToken = response.body.accessToken;
});


describe('Tower Integration Test', () => {
  it('should return created tower!', async () => {
    await request(server)
      .post("/towers")
      .send({ name: 'T1', location: 'AUH', lat: '54.382951', long: '11.1', floors: 5, rate: 4 })
      .set('Authorization', 'JWT ' + jwtToken)
      .expect(200);
  });
  it('should return unauthorized', async () => {
    await request(server)
    .post("/towers")
    .send({ name: 'T2', location: 'AUH', lat: '54.382951', long: '11.1', floors: 5, rate: 4 })
    .expect(401);
  });
  it('should return list of towers', async () => {
    const response = await request(server)
    .get("/towers")
    .expect(200);
    const towers = response.body;
    expect(towers).toHaveLength(1);
  });
});

