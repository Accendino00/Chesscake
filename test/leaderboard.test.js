const request = require("supertest");
const {app} = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");

describe("API Tests for /api/leaderboard", () => {

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

  // Ritorna la leaderboard standard utilizzata per le altre
  test("should return leaderboard data", async () => {
    const response = await request(app)
      .get("/api/leaderboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });


  //Controlliamo se quando si richiede la leaderboard per elo, rank e daily
  test("should return leaderboard data for elo", async () => {
    const response = await request(app)
      .get("/api/leaderboard/elo")
      .set("Authorization", `Bearer ${token}`);

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
      .set("Authorization", `Bearer ${token}`);

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
      .set("Authorization", `Bearer ${token}`);

    expect([200, 201]).toContain(response.statusCode);
    expect(response.body.success).toBe(true);
    expect(response.body.leaderboard).toBeDefined();
    expect(response.body).toBeDefined();
    if (response.statusCode === 200) 
      expect(response.body.leaderboard.length).toBeGreaterThan(0);
    expect(response.body.userPlace).toBeDefined();
  });

  test("should return leaderboard data for kriegspiel", async () => {
    const response = await request(app)
      .get("/api/leaderboard/eloKriegspiel")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 201]).toContain(response.statusCode);
    expect(response.body.success).toBe(true);
    expect(response.body.leaderboard).toBeDefined();
    expect(response.body).toBeDefined();
    if (response.statusCode === 200) 
      expect(response.body.leaderboard.length).toBeGreaterThan(0);
    expect(response.body.userPlace).toBeDefined();
  });

  
});