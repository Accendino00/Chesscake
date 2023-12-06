const request = require("supertest");
const {app} = require("../code/backend/server.js"); // Adjust the path as needed
let {server} = require("../code/backend/server.js"); // Adjust the path as needed
const chessgames = require("../code/backend/utils/chess/chessgames");
let token; // Variable to store the token
const Chess = require("chess.js").Chess;


describe("API Tests for /api/reallybadchess", () => {

// closing the server
  afterAll(async () => {
      await server.close();        
  });

  beforeAll(async () => {
    // Login to get the token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername", password: "test" });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("token");
    token = loginResponse.body.token;
  });

  test("should return 200 for GET request to /api/reallybadchess", async () => {
    const response = await request(app)
      .get("/api/reallybadchess")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

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

  test("should return 200 for post to /api/reallybadchess/getGame/:gameId", async () => {
    const response = await request(app)
      .get("/api/reallybadchess/getGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.gameID).not.toBe(null);
  });

  test("should return 200 for post to /api/reallybadchess/movePiece/:gameId", async () => {
    const pick = await request(app)
      .get("/api/reallybadchess/getGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(pick.statusCode).toBe(200);
    expect(pick.gameID).not.toBe(null);
    const chess = new Chess(pick.body.game.chess._header.FEN); // Get the board from the game
    // Get a random piece
    const randomMove = chess.moves({verbose: true, square: "d2"})[0];
    const response = await request(app)
      .post("/api/reallybadchess/movePiece/" + gameID)
      .send({move: randomMove })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});