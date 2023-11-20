# Come eeguire il codice

## Prerequisiti

Sarà necessario avere installato sul proprio computer:
- [Node.js](https://nodejs.org/it/) - Versione 20.0.0 o superiore
- [npm](https://www.npmjs.com/)     - Compatibile con la versione di Node
- [MongoDB](https://www.mongodb.com/try/download/community) (in futuro)

Saranno poi necessarie diverse dipendenze, che verranno istallate (localmente) con i comandi presenti sotto.

## Accendere il server

Per poter accendere il server di ChessCake è necessario seguire il seguente procedimento:

### Frontend

Prima bisogna compilare le pagine di React del frontend. Eseguire quindi questi comandi:

```bash
cd frontend
npm install
npm install vite
npm run build
cd ..
```

### Backend

Poi bisogna accendere il server di Node.js del backend. Eseguire quindi questi comandi:

```bash
cd backend
npm install
npm start
cd ..
```

A questo punto, è possibile accedere al server all'indirizzo [http://localhost:3000](http://localhost:3000).