const request = require("supertest");
const {app} = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");
const chessgames = require("../code/backend/utils/chess/chessgames");
let token; // Variable to store the token
const Chess = require("chess.js").Chess;


describe("API Tests for /api/reallybadchess", () => {

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

  // Controlliamo l'api per reallybadchess
  test("should return 200 for GET request to /api/reallybadchess", async () => {
    const response = await request(app)
      .get("/api/reallybadchess")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  //Creaimo un nuovo gioco e salviamo l'id
  let gameID = null;
  test("should return 200 for post to /api/reallybadchess/newGame", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/newGame")
      .send({ username: "testerUsername" ,settings: { mode: "playerVsComputer" } })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    gameID = response.body.gameId;
    expect(gameID).toBeDefined();
  });

  //Controlliamo se il gioco è stato creato
  test("should return 200 for post to /api/reallybadchess/getGame/:gameId", async () => {
    const response = await request(app)
      .get("/api/reallybadchess/getGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.gameID).not.toBe(null);
  });

  //Facciamo una mossa casuale all'interno del gioco creato
  test("should return 200 for post to /api/reallybadchess/movePiece/:gameId", async () => {
    const pick = await request(app)
      .get("/api/reallybadchess/getGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(pick.statusCode).toBe(200);
    expect(pick.gameID).not.toBe(null);
    const chess = new Chess(pick.body.game.chess._header.FEN);
    
    //Facciamo una mossa casuale dalla square d2
    const randomMove = chess.moves({verbose: true, square: "d2"})[0];
    const response = await request(app)
      .post("/api/reallybadchess/movePiece/" + gameID)
      .send({
        from: randomMove.from,
        to: randomMove.to,
        promotion: "q",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  //Non può farlo perché non ha turni accumulati
  test("should do the undoMove", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/undoMove/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });
  
});