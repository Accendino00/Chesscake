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
// Per impostare "process.env" usando il file ".env"
const config = require('./config');
const path = require("path");



/* SETUP SERVER */

const app = express();
const PORT = config.PORT || 3000;





/* MIDDLEWARE */




/* ROUTES */


app.get("/prova", function (req, res) {
  res.send("Ciao");
});

app.use(express.json()) // for parsing application/json

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(err);
      return res.status(400).send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

// Setup per mandare le richieste di "/" a "routes/webpages" package
app.use("/", express.static(config.FRONTEND_DIST_PATH));
//app.use("/ciao", require(config.ROUTESERVIZI + "\\webpages"));

app.use("/register", require(config.ROUTESERVIZI + "\\registration"))


/* SERVER START */

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
