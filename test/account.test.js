const request = require("supertest");
const { app } = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");
let token; // Variable to store the token
// Chiudiamo il server dopo i test
afterAll(async () => {
  await server.close();        
});

beforeAll(async () => {
  const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername", password: "test" });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("token");
    // Salviamo il token
    token = loginResponse.body.token;
});
describe("API Tests for /api/account", () => {
  test("should return account data for existing user", async () => {
    const response = await request(app)
      .get("/api/account/getAccountData")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
  test("should return account data for existing user", async () => {
    const response = await request(app)
      .get("/api/account/getAccountData/testerUsername")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("should return the last games for existing user", async () => {
    const response = await request(app)
      .get("/api/account/getLastGames/testerUsername")
      .send({ username: "testerUsername" })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

});