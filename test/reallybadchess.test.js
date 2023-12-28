const request = require("supertest");
const {app} = require("../code/backend/server.js");
let {server} = require("../code/backend/server.js");
const chessgames = require("../code/backend/utils/chess/chessgames");
let token; // Variable to store the token
let token2; // Variable to store the token
const Chess = require("chess.js").Chess;


describe("API Tests for /api/reallybadchess, in which we play versus the computer", () => {
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

    const login2Response = await request(app)
      .post("/api/login")
      .send({ username: "testerUsername2", password: "test" });

    expect(login2Response.statusCode).toBe(200);
    expect(login2Response.body).toHaveProperty("token");
    // Salviamo il token
    token2 = login2Response.body.token;
  });

  // Controlliamo l'api per reallybadchess
  test("should return 200 for GET request to /api/reallybadchess", async () => {
    const response = await request(app)
      .get("/api/reallybadchess")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("should return stockfish path", async () => {
    const response = await request(app)
      .get("/api/reallybadchess/stockfish.js");
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
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
describe("Two players play online, one of them makes an undo, and the other one surrend", () => {
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

  const login2Response = await request(app)
    .post("/api/login")
    .send({ username: "testerUsername2", password: "test" });

  expect(login2Response.statusCode).toBe(200);
  expect(login2Response.body).toHaveProperty("token");
  // Salviamo il token
  token2 = login2Response.body.token;
});
  let gameID = null;

  test("should return 200 for post to /api/reallybadchess/newGame", async () => {
  const response = await request(app)
    .post("/api/reallybadchess/newGame")
    .send({ username: "testerUsername" ,settings: { mode: "playerVsPlayerOnline" } })
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  gameID = response.body.gameId;
  expect(gameID).toBeDefined();
  });

  test("should return 200 for post to /api/reallybadchess/joinGame/:gameId", async () => {
    const emptyGame = await request(app)
      .get("/api/reallybadchess/getEmptyGames")
      .set("Authorization", `Bearer ${token2}`);
    
    expect(emptyGame.statusCode).toBe(200);
    expect(emptyGame.body.success).toBe(true);
    expect(emptyGame.body.games).toBeDefined();

    const response = await request(app)
      .post("/api/reallybadchess/joinGame/" + gameID)
      .set("Authorization", `Bearer ${token2}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
  

  for(let i = 0; i < 4; i++) {
  test("should make 2 moves each" , async () => {
    const pick = await request(app)
    .get("/api/reallybadchess/getGame/" + gameID)
    .set("Authorization", `Bearer ${i % 2 === 0 ? token2 : token}`);

    expect(pick.statusCode).toBe(200);
    expect(pick.gameID).not.toBe(null);
    const chess = new Chess(pick.body.game.chess._header.FEN);
    let turn = pick.body.game.chess._turn;
    let sidePlayerTestRunner = pick.body.game.player1.username == "testRunner" ? pick.body.game.player1.side : pick.body.game.player2.side;
    let choiseToken = turn == sidePlayerTestRunner ? token2 : token;
    //Facciamo una mossa casuale dalla square d2
    const randomMove = chess.moves({verbose: true})[0];
    const response = await request(app)
      .post("/api/reallybadchess/movePiece/" + gameID)
      .send({
        from: randomMove.from,
        to: randomMove.to,
        promotion: "q",
      })
      .set("Authorization", `Bearer ${choiseToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    });
  }
  test("should do the undoMove", async () => {
    const pick = await request(app)
    .get("/api/reallybadchess/getGame/" + gameID)
    .set("Authorization", `Bearer ${token}`);

    expect(pick.statusCode).toBe(200);
    expect(pick.gameID).not.toBe(null);
    const chess = new Chess(pick.body.game.chess._header.FEN);
    let turn = pick.body.game.chess._turn;
    let sidePlayerTestRunner = pick.body.game.player1.username == "testRunner" ? pick.body.game.player1.side : pick.body.game.player2.side;
    let choiseToken = turn == sidePlayerTestRunner ? token2 : token;

    const response = await request(app)
      .post("/api/reallybadchess/undoMove/" + gameID)
      .set("Authorization", `Bearer ${choiseToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("should do the surrender", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/surrender/" + gameID)
      .set("Authorization", `Bearer ${token2}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("should save the match", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/saveGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("Two players play online, one of them makes an undo, and the other one surrend", () => {
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

  test("should make moves" , async () => {
    const pick = await request(app)
    .get("/api/reallybadchess/getGame/" + gameID)
    .set("Authorization", `Bearer ${token}`);

    expect(pick.statusCode).toBe(200);
    expect(pick.gameID).not.toBe(null);
    const chess = new Chess(pick.body.game.chess._header.FEN);
    
    //Facciamo una mossa casuale dalla square d2
    const randomMove = chess.moves({verbose: true})[0];
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
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      // Aspetta 3 secondi
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Prendi il gioco
      const pick2 = await request(app)
        .get("/api/reallybadchess/getGame/" + gameID)
        .set("Authorization", `Bearer ${token}`);

      expect(pick2.statusCode).toBe(200);
      expect(pick2.body.game.chess._turn).toBe("w"); // Controlla se è di nuovo il tuo turno
  },10000);

  

  test("should do the surrender", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/surrender/" + gameID)
      .set("Authorization", `Bearer ${token2}`);
  });
});

describe("API Tests for /api/reallybadchess, in which we play versus the computer in a DailyChallenge", () => {
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

  test("should return stockfish path", async () => {
    const response = await request(app)
      .get("/api/reallybadchess/stockfish.js");
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
  });

  //Creaimo un nuovo gioco e salviamo l'id
  let gameID = null;
  test("should return 200 for post to /api/reallybadchess/newGame", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/newGame")
      .send({ username: "testerUsername" ,settings: { mode: "dailyChallenge" } })
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
    const randomMove = chess.moves({verbose: true})[0];
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

  test("should save the match", async () => {
    const response = await request(app)
      .post("/api/reallybadchess/saveGame/" + gameID)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

});  
