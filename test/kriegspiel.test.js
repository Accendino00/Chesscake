const request = require("supertest");
const {app} = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");
const chessgames = require("../code/backend/utils/chess/chessgames");
let token; // Variable to store the token
const Chess = require("chess.js").Chess;


describe("API Tests for /api/kriespiel", () => {

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
  test("should return 200 for post to /api/kriegspiel/newGame", async () => {
    const response = await request(app)
      .post("/api/kriegspiel/newGame")
      .send({ username: "testerUsername" ,settings: { mode: "playerVsComputer" } })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    gameID = response.body.gameId;
    expect(gameID).toBeDefined();
  });

  //Controlliamo se il gioco è stato creato
  test("should return 200 for post to /api/kriegspiel/getGame/:gameId", async () => {
    const response = await request(app)
      .get("/api/kriegspiel/getGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.gameID).not.toBe(null);
  });
});