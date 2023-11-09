/*
    Configurazione del server e dei dati utili.
*/

configData = {
    PORT : 8000,
    DATABASE_URL : "mongodb://localhost:27017/mydatabase",
    FRONTEND_DIST_PATH : __dirname + "\\..\\frontend\\dist\\",
    ROUTESERVIZI : __dirname + "\\routes",
    SECRET_KEY: "hC8iXaTkahRBqRfd0ExpEFLavwwlxGFH2Rz6WD15ZY71jUevqsprOcLXVYKTr8K"
}


module.exports = configData;