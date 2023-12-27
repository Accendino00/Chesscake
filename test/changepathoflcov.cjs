/**
 * In questo file, apro "coverage/lcov.info" e cambio tutte le occorrenze 
 */

const fs = require('fs');
const path = require('path');

const lcovFilePath = path.join(__dirname, 'coverage', 'lcov.info');
const somethingElse = ".";

fs.readFile(lcovFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let updatedData = data.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    updatedData = updatedData.replace(/\.\./g, somethingElse); // Replace ".." with "somethingElse"

    fs.writeFile(lcovFilePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File updated successfully.');
    });
});
