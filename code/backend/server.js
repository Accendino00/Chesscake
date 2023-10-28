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

// Setup per mandare le richieste di "/" a "routes/webpages" package
app.use("/", express.static(config.FRONTEND_DIST_PATH));
//app.use("/ciao", require(config.ROUTESERVIZI + "\\webpages"));


/* SERVER START */

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
