const request = require("supertest");
const {app} = require("../code/backend/server.js"); // Adjust the path as needed
let {server} = require("../code/backend/server.js"); // Adjust the path as needed

describe("API Tests for /api/leaderboard", () => {

  // closing the server
  afterAll(async () => {
    await server.close();        
  });

  test("should return leaderboard data", async () => {
    const response = await request(app)
      .get("/api/leaderboard")
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("should return leaderboard data for elo", async () => {
    const response = await request(app)
      .get("/api/leaderboard/elo")
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.leaderboard).toBeDefined();
    expect(response.body.leaderboard.length).toBeGreaterThan(0);
    expect(response.body.userPlace).toBeDefined();
  });

  test("should return leaderboard data for rank", async () => {
    const response = await request(app)
      .get("/api/leaderboard/rank")
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.leaderboard).toBeDefined();
    expect(response.body.leaderboard.length).toBeGreaterThan(0);
    expect(response.body.userPlace).toBeDefined();
  });

  test("should return leaderboard data for daily", async () => {
    const response = await request(app)
      .get("/api/leaderboard/daily")
      .set("Content-Type", "application/json");

    expect([200, 201]).toContain(response.statusCode);
    expect(response.body.success).toBe(true);
    expect(response.body.leaderboard).toBeDefined();
    expect(response.body).toBeDefined();
    if (response.statusCode === 200) 
      expect(response.body.leaderboard.length).toBeGreaterThan(0);
    expect(response.body.userPlace).toBeDefined();
  });
});