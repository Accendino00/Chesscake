/*
    Configurazione del server e dei dati utili.
*/

configData = {
    PORT : 3001,
    DATABASE_URL : "mongodb://localhost:27017/mydatabase",
    FRONTEND_DIST_PATH : __dirname + "\\..\\frontend\\dist\\",
    ROUTESERVIZI : __dirname + "\\routes"
}


module.exports = configData;