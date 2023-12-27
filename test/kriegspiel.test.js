const request = require("supertest");
const {app} = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");
let token; // Variable to store the token
let token2; // Variable to store the token
const Chess = require("chess.js").Chess;


describe("Create a game and surrend", () => {
// Chiudiamo il server dopo i test
  afterAll(async () => {
      await server.close();        
  });

  beforeAll(async () => {
    // Facciamo il login prima di fare i test, poiché serve un token valido
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername", password: "test" });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("token");
    // Salviamo il token
    token = loginResponse.body.token;
    const loginResponse2 = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername2", password: "test" });

    expect(loginResponse2.statusCode).toBe(200);
    expect(loginResponse2.body).toHaveProperty("token");
    // Salviamo il token
    token2 = loginResponse2.body.token;
  });

  // Controlliamo l'api per kriegspiel
  test("should return 200 for GET request to /api/kriegspiel", async () => {
    const response = await request(app)
      .get("/api/kriegspiel")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  //Creaimo un nuovo gioco e salviamo l'id
  let gameID = null;
  test("should create a new game", async () => {
    
    const response = await request(app)
      .post("/api/kriegspiel/newGame")
      .send({ username: "testerUsername" ,settings: { mode: "kriegspiel" } })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    gameID = response.body.gameId;
    expect(gameID).toBeDefined();
  });

  test("should join a game", async () => {
    // Facciamo il login prima di fare i test, poiché serve un token valido
    const response = await request(app)
      .post("/api/kriegspiel/joinGame/" + gameID)
      .set("Authorization", `Bearer ${token2}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    const move = await request(app)
      .post("/api/kriegspiel/movePiece/" + gameID)
      .send({
        from: "c2",
        to: "c3",
        promotion: "q",
      })
      .set("Authorization", `Bearer ${token2}`);
      expect([200, 400]).toContain(move.statusCode);
      expect([true, false]).toContain(move.body.success);
    if (move.statusCode === 400) {
      expect(move.body.message).toBe("It's not your turn");
    }
  });

  //Controlliamo se il gioco è stato creato
  test("should return 200 for post to /api/kriegspiel/getGame/:gameId/user", async () => {
    const response = await request(app)
      .get("/api/kriegspiel/getGame/" + gameID + "/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.gameID).not.toBe(null);
    expect(response.body.success).toBe(true);
  });

  test('should check if the game isDrawable', async () => {
    const response = await request(app)
      .post('/api/kriegspiel/isDrawable/' + gameID)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test("Surrender" , async () => {
    const response = await request(app)
      .post("/api/kriegspiel/surrender/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("Create a game and surrend", () => {
  // Chiudiamo il server dopo i test
    afterAll(async () => {
        await server.close();        
    });
  
    beforeAll(async () => {
      // Facciamo il login prima di fare i test, poiché serve un token valido
      const loginResponse = await request(app)
        .post("/api/login")
        .send({ username: "testerUsername", password: "test" });
  
      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body).toHaveProperty("token");
      // Salviamo il token
      token = loginResponse.body.token;
    });
  
    // Controlliamo l'api per kriegspiel
    test("should return 200 for GET request to /api/kriegspiel", async () => {
      const response = await request(app)
        .get("/api/kriegspiel")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.statusCode).toBe(200);
    });
  
    //Creaimo un nuovo gioco e salviamo l'id
    let gameID = null;
    test("should create a new game", async () => {
      
      const response = await request(app)
        .post("/api/kriegspiel/newGame")
        .send({ username: "testerUsername" ,settings: { mode: "kriegspiel" } })
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.statusCode).toBe(200);
      gameID = response.body.gameId;
      expect(gameID).toBeDefined();
    });
  
    test("should join a game", async () => {
      // Facciamo il login prima di fare i test, poiché serve un token valido
      const response = await request(app)
        .post("/api/kriegspiel/joinGame/" + gameID)
        .set("Authorization", `Bearer ${token2}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      const move = await request(app)
        .post("/api/kriegspiel/movePiece/" + gameID)
        .send({
          from: "c2",
          to: "c3",
          promotion: "q",
        })
        .set("Authorization", `Bearer ${token2}`);
        expect([200, 400]).toContain(move.statusCode);
        expect([true, false]).toContain(move.body.success);
        if (move.statusCode === 400) {
          expect(move.body.message).toBe("It's not your turn");
        }
    });
  
    //Controlliamo se il gioco è stato creato
    test("should return 200 for post to /api/kriegspiel/getGame/:gameId/user", async () => {
      const response = await request(app)
        .get("/api/kriegspiel/getGame/" + gameID + "/user")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.gameID).not.toBe(null);
      expect(response.body.success).toBe(true);
    });
  
    test('should check if the game isDrawable', async () => {
      const response = await request(app)
        .post('/api/kriegspiel/isDrawable/' + gameID)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
    });
  
    test("should draw the game" , async () => {
      const response = await request(app)
        .post("/api/kriegspiel/draw/" + gameID)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
});