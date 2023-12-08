#!/bin/bash

# Username di chi sta caricando il file
SSH_USER="petrumarcel.marincas"


# Definizione dell'host e dell'indirizzo
SSH_HOST_MARULLO="marullo.cs.unibo.it"
SSH_PATH_MARULLO="/home/web/site222341/html/chesscake/code"

# Definizione delle cartelle da cancellare
DIR1="backend"
DIR2="frontend/dist"

# Esecuzione del comando ssh per accedere a marullo.cs.unibo.it
ssh "${SSH_USER}@${SSH_HOST_MARULLO}" << EOF
  # Navigare alla directory specifica
  cd "${SSH_PATH_MARULLO}"

  # Cancellare le directory richieste
  rm -rf "${DIR1}" "${DIR2}"
EOF

echo "Directories deleted successfully on marullo.cs.unibo.it!"

# Definizione delle cartelle da copiare
DIR1="backend"
DIR2="frontend/dist"

# Comando SCP per copiare le cartelle marullo.cs.unibo.it
scp -r "${DIR1}" "${SSH_USER}@${SSH_HOST_MARULLO}:${SSH_PATH_MARULLO}"
scp -r "${DIR2}" "${SSH_USER}@${SSH_HOST_MARULLO}:${SSH_PATH_MARULLO}/frontend"

echo "Directories copied successfully to marullo.cs.unibo.it!"

# Definizione dell'ssh di gocker.cs.unibo.it
SSH_HOST_GOCKER="gocker.cs.unibo.it"

# SSH dentro marullo.cs.unibo.it e poi SSH in gocker.cs.unibo.it da lì
ssh -t "${SSH_USER}@${SSH_HOST_MARULLO}" "ssh -t ${SSH_USER}@${SSH_HOST_GOCKER}"

echo "Site restarted on gocker.cs.unibo.it!"
