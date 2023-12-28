const request = require("supertest");
const {app} = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");
let token; // Variable to store the token
let token2; // Variable to store the token
let token3; // Variable to store the token
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

    const loginResponse3 = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername3", password: "test" });

    expect(loginResponse3.statusCode).toBe(200);
    expect(loginResponse3.body).toHaveProperty("token");
    // Salviamo il token
    token3 = loginResponse3.body.token;
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


  test("should get the EmptyGames" , async () => {
    const response = await request(app)
      .get("/api/kriegspiel/getEmptyGames/")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
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

  test("should not join in the game because it doesn't exist", async () => {
    // Facciamo il login prima di fare i test, poiché serve un token valido
    const response = await request(app)
      .post("/api/kriegspiel/joinGame/" + gameID + "error")
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test("should not join in the game because you're the owner", async () => {
    // Facciamo il login prima di fare i test, poiché serve un token valido
    const response = await request(app)
      .post("/api/kriegspiel/joinGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("You are already the player1");
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

  test("should not return the game because it doesn't exist", async () => {
    const response = await request(app)
      .get("/api/kriegspiel/getGame/" + gameID + "error" + "/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Game not found");
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

  test("Should not surrend because the game doesn't exist" , async () => {
    const response = await request(app)
      .post("/api/kriegspiel/surrender/" + gameID + "error")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Game not found");
  });

  test("Should not surrend because it's not a game in witch you can partecipate" , async () => {
    const response = await request(app)
      .post("/api/kriegspiel/surrender/" + gameID)
      .set("Authorization", `Bearer ${token3}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Unauthorized");
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
  
    test("should join a game and move a Piece", async () => {
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

    test("should not move the piece because the game doesn't exist", async () => {
      const move = await request(app)
        .post("/api/kriegspiel/movePiece/" + gameID + "error")
        .send({
          from: "c2",
          to: "c3",
          promotion: "q",
        })
        .set("Authorization", `Bearer ${token2}`);
        expect(move.statusCode).toBe(404);
        expect(move.body.success).toBe(false);
        expect(move.body.message).toBe("Game not found");
    });

    test("should not move the piece because it's not a game in witch you can partecipate", async () => {
      const move = await request(app)
        .post("/api/kriegspiel/movePiece/" + gameID)
        .send({
          from: "c2",
          to: "c3",
          promotion: "q",
        })
        .set("Authorization", `Bearer ${token3}`);
        expect(move.statusCode).toBe(403);
        expect(move.body.success).toBe(false);
        expect(move.body.message).toBe("Unauthorized");
    });

    test("should not move the piece because the move is wrongly formatted", async () => {
      const move = await request(app)
        .post("/api/kriegspiel/movePiece/" + gameID)
        .send({
          from: "error",
          to: "error",
          promotion: "error",
        })
        .set("Authorization", `Bearer ${token}`);
        expect(move.statusCode).toBe(400);
        expect(move.body.success).toBe(false);
        expect(move.body.message).toBe("Invalid move");
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

    test('should not tell the game is drawable because it doesnt exist', async () => {
      const response = await request(app)
        .post('/api/kriegspiel/isDrawable/' + gameID + "error")
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Game not found");
    });

    test('should not tell the game is drawable because you are not part of the game', async () => {
      const response = await request(app)
        .post('/api/kriegspiel/isDrawable/' + gameID)
        .set("Authorization", `Bearer ${token3}`);
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Unauthorized");
    });
  
    test("should draw the game" , async () => {
      const response = await request(app)
        .post("/api/kriegspiel/draw/" + gameID)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("should not draw the game because it doesn't exist" , async () => {
      const response = await request(app)
        .post("/api/kriegspiel/draw/" + gameID + "error")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Game not found");
    });

    test("should not draw the game because you are not part of the game" , async () => {
      const response = await request(app)
        .post("/api/kriegspiel/draw/" + gameID)
        .set("Authorization", `Bearer ${token3}`);
  
      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Unauthorized");
    });
});