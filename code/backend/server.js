/*
  @author:
    Petru
    Davide
    Giuseppe
    Saad
    Alex
    Rafid

  @description:
    Questo file è il punto di partenza del nostro server.
    Qui vengono importati i moduli necessari e viene
    impostato il server.

  @version: 1.0.0
*/


/* IMPORT VARI */

const express = require('express');
const config = require('./config'); // Per impostare "process.env" usando il file ".env"



/* SETUP SERVER */

const app = express();
const PORT = config.PORT || 8000;





/* MIDDLEWARE */

// Middleware per autenticare JWT
const { authenticateJWT } = require('./middleware/authorization'); 


/* ROUTES */

app.get("/prova", function (req, res) {
  res.send("Ciao");
});

app.use(express.json()) // Per parsing di application/json

// Per gestire gli errori in modo personalizzato, per esempio se il body non è JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(err);
      return res.status(400).send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

// Setup per mandare le richieste di "/" a "routes/webpages" package
app.use("/", require(config.ROUTESERVIZI + "\\webpages"));

app.use("/api", require(config.ROUTESERVIZI + "\\registration"))
app.use("/api", require(config.ROUTESERVIZI + "\\login"))
app.get("/protected", authenticateJWT, (req, res) => {
  res.send("Sei entrato in una route protetta");
});

/* SERVER START */

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
