import '@4tw/cypress-drag-drop'

function performChessMoves(color) {
    cy.get(`[data-square="${generateStartSquare(color)}"] > div`).click({ force: true });
    cy.get(`[data-square="${generateMoveSquare()}"] > div`).click({ force: true }).then(() => {
      // Controlla la presenza di due pulsanti "Esci"
        cy.get('button:contains("Esci")').then(($buttons) => {
            if ($buttons.length === 2) {
                // Se ci sono due pulsanti "Esci", la partita è finita
                cy.log('La partita è finita.');
                cy.get('button:contains("Esci")').eq(1).click(); // Clicca sul secondo pulsante "Esci"
            } else {
                // Se non ci sono due pulsanti "Esci", la partita non è finita, continua a giocare
                cy.wait(500);
                performChessMoves(color);
            };
        });
    });
}

//Genera le caselle di partenza per il bianco o nero
function generateStartSquare(color) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranksWhite = ['1', '2'];
    const ranksBlack = ['7', '8'];
  
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const randomRankWhite = ranksWhite[Math.floor(Math.random() * 2)];
    const randomRankBlack = ranksBlack[Math.floor(Math.random() * 2)];
    
    if (color === 'w') {
        return randomFile + randomRankWhite;
        }
    return randomFile + randomRankBlack;
}

//Genera le caselle di arrivo per il bianco o nero
function generateMoveSquare() {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [3, 4, 5, 6];
  
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
  
    return randomFile + randomRank;
}

describe('Simulazione di due utenti', () => {
    it('Utente 2 - Login e Inizio Partita', () => {
        // Login per l'Utente 2
        cy.visit('/login');
        cy.get('[labelId="usernameRegisterField"]').should('exist').type('testUserNew');
        cy.get('[labelId="passwordRegisterField"]').should('exist').type('testPassword');
        cy.get('button[type="submit"]').contains('Login').click();

        cy.url().should('include', '/play');
        cy.get('button:contains("Gioca Really Bad Chess")').click();
        cy.url().should('include', '/play');

        // Scegliamo PvPOnline
        cy.get('[aria-labelledby="mode-label"]').click();

        // Entriamo nella lobby
        cy.contains('Player vs Player (online)').click();
        cy.get('button:contains("Lobbies")').click();

        //Partiamo e aspettiamo che entri il primo test
        cy.wait(7000);
        cy.get('button:contains("Join")').first().click();
        cy.url().should('include', '/play/reallybadchess/').then(() => {
            // Giochiamo
            performChessMoves('w');
        });
    });
  });
  