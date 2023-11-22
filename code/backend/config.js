/*
    Configurazione del server e dei dati utili.
*/

const configData = {
    PORT: 8000,
    DATABASE_URL: "mongodb+srv://<username>:<password>@cluster0.yu7ghd9.mongodb.net/?retryWrites=true&w=majority",
    FRONTEND_DIST_PATH: __dirname + "/../frontend/dist/",
    ROUTESERVIZI: __dirname + "/routes",
    SECRET_KEY: "hC8iXaTkahRBqRfd0ExpEFLavwwlxGFH2Rz6WD15ZY71jUevqsprOcLXVYKTr8K"
}

module.exports = configData;