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
        
        // Submit the login form
        cy.get('button[type="submit"]').contains('Continua come anonimo').click();

        // Assert that the login was successful
        cy.url().should('include', '/play');
    });
    it('should see the leaderboards', () => {
        cy.visit('/login');
        // Submit the login form
        cy.get('button[type="submit"]').contains('Continua come anonimo').click();

        // Assert that the login was successful
        cy.url().should('include', '/play');
        cy.get('button:contains("Leaderboard")').click();

        cy.url().should('include', '/leaderboard');
        // Click the ELO button
        cy.get('button:contains("ELO")').click();
        cy.wait(1000);
        // Click the RANK button
        cy.get('button:contains("Rank")').click();
        cy.wait(1000);
        // Click the Daily button
        cy.get('button:contains("Daily")').click();
        cy.wait(1000);
    });
    it('should do a local play', () => {
        cy.visit('/login');

        // Submit the login form
        cy.get('button[type="submit"]').contains('Continua come anonimo').click();

        // Assert that the login was successful
        cy.url().should('include', '/play');
        cy.get('button:contains("Gioca Really Bad Chess")').click();
        cy.url().should('include', '/play');

        // Choose "PlayerVsPlayer Locale" from the dropdown menu
        cy.get('[aria-labelledby="mode-label"]').click();

        // Select an option (e.g., "Player vs Player")
        cy.contains('Player vs Player (locale)').click();
        // Verifica che la modalità sia stata selezionata correttamente
        
        // Select '1 minute' from the Duration selector
        cy.get('[aria-labelledby="duration-label"]').click();
        cy.contains('1 minute').click();

        // Enter player names
        cy.get('[labelId="player1"]').type('BiancoUser');
        cy.get('[labelId="player2"]').type('NeroUser');

        // Click on the leftmost end of the slider
        cy.get('.MuiSlider-root').click({ force: true, position: 'left'});

        cy.get('button:contains("Start Game")').click();

        // Assert that the game has started      
        cy.url().should('include', '/play/reallybadchess/').then(() => {
            // Perform some chess moves
            performChessMoves('w');
        });
    });
});
