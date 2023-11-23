/*
    Configurazione del server e dei dati utili.
*/

let configData = {
    PORT : 8000,
    DATABASE_URL : "mongodb+srv://ccadmin:0s6py9RJ1kCSztPW@cluster0.yu7ghd9.mongodb.net/?retryWrites=true&w=majority",
    FRONTEND_DIST_PATH : __dirname + "/../frontend/dist/",
    ROUTESERVIZI : __dirname + "/routes",
    SECRET_KEY: "hC8iXaTkahRBqRfd0ExpEFLavwwlxGFH2Rz6WD15ZY71jUevqsprOcLXVYKTr8K"
}


module.exports = configData;