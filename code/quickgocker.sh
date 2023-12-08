#!/bin/bash

# Definizione dell'user
SSH_USER="petrumarcel.marincas"

# Definizione degli host
SSH_HOST_MARULLO="marullo.cs.unibo.it"
SSH_HOST_GOCKER="gocker.cs.unibo.it"

# SSH dentro marullo.cs.unibo.it e poi SSH in gocker.cs.unibo.it da lì
ssh -t "${SSH_USER}@${SSH_HOST_MARULLO}" "ssh -t ${SSH_USER}@${SSH_HOST_GOCKER}"

echo "Site restarted on gocker.cs.unibo.it!"
