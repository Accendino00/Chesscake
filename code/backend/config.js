/*
    Configurazione del server e dei dati utili.
*/

let configData = {
    // Dati per il server
    PORT : 8000,
    DATABASE_URL : "mongodb+srv://ccadmin:0s6py9RJ1kCSztPW@cluster0.yu7ghd9.mongodb.net/?retryWrites=true&w=majority",
    SECRET_KEY: "hC8iXaTkahRBqRfd0ExpEFLavwwlxGFH2Rz6WD15ZY71jUevqsprOcLXVYKTr8K", // Per JWT
    
    // Directory usate
    FRONTEND_DIST_PATH : __dirname + "/../frontend/dist/",
    ROUTESERVIZI : __dirname + "/routes",
    
    // Dati per gli account
    DEFAULT_ELO_RBC: 400,
    STARTING_RANK_RBC: 10,
    DEFAULT_ELO_KRI: 400,
}


module.exports = configData;