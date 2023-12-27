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
            } 
            else {
                // Se non ci sono due pulsanti "Esci", la partita non è finita, continua a giocare
                cy.wait(500);
                cy.get('[data-cy=player-turn]').then(($turn) => {
                    if ($turn.text().includes('Bianco')) {
                        performChessMoves('w');
                    } else {
                        performChessMoves('b');
                    }
                });
            }
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

describe('LoginPage', () => {
    it('should log in anonimously successfully', () => {
        cy.visit('/login');
        
        // Facciamo il login
        cy.get('button[type="submit"]').contains('Continua come anonimo').click();

        // Verifica che il login sia avvenuto con successo
        cy.url().should('include', '/play');
    });
    it('should see the leaderboards', () => {
        cy.visit('/login');
        cy.get('button[type="submit"]').contains('Continua come anonimo').click();

        cy.url().should('include', '/play');

        // Clicchiamo sul pulsante "Leaderboard"
        cy.get('button:contains("Leaderboard")').click();

        cy.url().should('include', '/leaderboard');
        // Verifica che ci siano i pulsanti per cambiare la modalità
        cy.get('button:contains("ELO")').click();
        cy.wait(1000);
        cy.get('button:contains("Rank")').click();
        cy.wait(1000);
        cy.get('button:contains("Daily")').click();
        cy.wait(1000);
    });
    it('should do a local play', () => {
        cy.visit('/login');

        cy.get('button[type="submit"]').contains('Continua come anonimo').click();

        cy.url().should('include', '/play');
        cy.get('button:contains("Gioca Really Bad Chess")').click();
        cy.url().should('include', '/play');

        // Scegliamo la modalità "Player vs Player"
        cy.get('[aria-labelledby="mode-label"]').click();
        cy.contains('Player vs Player (locale)').click();
        // Verifica che la modalità sia stata selezionata correttamente
        
        // Scegliamo la durata della partita
        cy.get('[aria-labelledby="duration-label"]').click();
        cy.contains('1 minute').click();

        // Scegliamo il nome dei giocatori
        cy.get('[labelId="player1"]').type('BiancoUser');
        cy.get('[labelId="player2"]').type('NeroUser');

        // Scegliamo un svantaggio per l'avversario
        cy.get('.MuiSlider-root').click({ force: true, position: 'left'});

        cy.get('button:contains("Start Game")').click();

        // Verifica che la partita sia iniziata      
        cy.url().should('include', '/play/reallybadchess/').then(() => {
            // Facciamo qualche mossa
            performChessMoves('w');
        });
    });
});
