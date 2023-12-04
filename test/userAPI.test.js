const request = require("supertest");
const app = require("../code/backend/server.js"); // Adjust the path as needed

describe("API Tests for /api/register", () => {

  test("should return 400 for POST request with empty body", async () => {
    const response = await request(app).post("/api/register").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ success: false });
  });

  // Test for valid credentials
  test("should return 200 or 400 for POST request with valid credentials", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({ username: "testerUsername", password: "test" });
    expect([200, 400]).toContain(response.statusCode);
    if (response.statusCode === 200) {
      expect(response.body).toEqual({ success: true });
    } else {
      expect(response.body).toEqual({ success: false, reason: "Username already exists" });
    }
  });

  // Test for duplicate registration
  test("should return 400 for POST request with duplicate credentials", async () => {
    // First registration
    const response = await request(app)
      .post("/api/register")
      .send({ username: "testerUsername", password: "test" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      reason: "Username already exists",
    });
  });
});

let token; // Variable to store the token

describe("API Tests for /api/login", () => {
  test("should return 400 for POST request with empty body", async () => {
    const response = await request(app).post("/api/login").send({});

    expect(response.statusCode).toBe(400);
  });

  test("should return 403 for POST request with wrong credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "wrongUsername", password: "wrongPassword" });

    expect(response.statusCode).toBe(403);
  });

  test("should return 200 and token for POST request with correct credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername", password: "test" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token; // Save the token for later use
  });
});

describe("API Tests for /api/tokenTest", () => {
  test("should return 401 for request without authorization header", async () => {
    const response = await request(app).post("/api/tokenTest");

    expect(response.statusCode).toBe(401);
  });

  test("should return 403 for request with bad authorization header", async () => {
    const response = await request(app)
      .post("/api/tokenTest")
      .set("Authorization", `Bearer randomWrongToken`);

    expect(response.statusCode).toBe(403);
  });

  test("should return 200 for request with correct token", async () => {
    const response = await request(app)
      .post("/api/tokenTest")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
