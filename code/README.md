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
npm install --force
npm install vite --force
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

# Come mandare in produzione

Per mandare in produzione il server di ChessCake, è necessario seguire il seguente procedimento:

### 1. Compilazione

Bisogna assicurarsi che vi siano tutti i moduli e bisogna compilare sia il frontend che il backend. Eseguire quindi questi comandi:

```bash
cd frontend
npm install --force
npm install vite --force
npm run build
cd ..
cd backend
npm install
cd ..
```

### 2. Carincamento in produzione (solo da linux)

Aggiornare lo script `distributionscript.sh` con il proprio nome utente.

Basterà eseguire lo script `distributionscript.sh` presente nella cartella `code` per caricare il server in produzione. Eseguire quindi questi comandi:

```bash
# Assicurarsi di essere nella cartella code

# Dare i permessi di esecuzione allo script
chmod +x distributionscript.sh
./distributionscript.sh
```

Durante lo script, vi saranno diversi prompt per inserire la password.

Inoltre **nella parte di gocker bisognerà scrivere il comando `restart site222341` e poi uscire con `exit`**.

## Lo script "quickgocker.sh"

Questo script server semplicemente ad accedere velocemente a gocker. Da qui si può per esempio far ripartire il server con il comando `restart site222341`.