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

describe('RegisterComponent', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.contains('Registrati').click();
    });
  
    it('should display error message when passwords do not match', () => {
        //Inseriamo i dati con password di conferma errata
        cy.get('[labelId="usernameRegisterField"]').eq(1).should('exist').type('testuser');
        cy.get('[labelId="passwordRegisterField"]').eq(1).should('exist').type('password123');
        cy.get('[labelId="confirmPasswordRegisterField"]').should('exist').type('password456');
        cy.contains('Register').click();
  
        cy.get('.MuiAlert-message').should('contain', 'Le password non corrispondono');
    });
  
    it('should display error message when registration fails', () => {
        //Inseriamo i dati con username già esistente
        cy.get('[labelId="usernameRegisterField"]').eq(1).should('exist').type('testUser');
        cy.get('[labelId="passwordRegisterField"]').eq(1).should('exist').type('testPassword');
        cy.get('[labelId="confirmPasswordRegisterField"]').type('testPassword');
        cy.contains('Register').click();
        cy.get('.MuiAlert-message').should('contain', "L'utente esiste già o le credenziali contengono caratteri non validi");
    });
  
    it('should display success message when registration is successful', () => {
        //Inseriamo i dati con username non esistente
        cy.get('[labelId="usernameRegisterField"]').eq(1).should('exist').type('testUserNew');
        cy.get('[labelId="passwordRegisterField"]').eq(1).should('exist').type('testPassword');
        cy.get('[labelId="confirmPasswordRegisterField"]').type('testPassword');
      cy.contains('Register').click();
  
      cy.get('.MuiAlert-message').should('contain', 'Registrazione ha avuto successo');
    });
  });

describe('LoginPage', () => {
    it('should log in anonymously successfully', () => {
        cy.visit('/login');
        cy.get('input[name="username"]').first().type('testUserNew');
        cy.get('input[name="password"]').first().type('testPassword');
        cy.get('button[type="submit"]').contains('Login').click();

        cy.url().should('include', '/play');
        cy.get('button:contains("Gioca Really Bad Chess")').click();
        cy.url().should('include', '/play');

        // Sceglie la modalità di gioco PvPLocale
        cy.get('[aria-labelledby="mode-label"]').click();
        cy.contains('Player vs Player (locale)').click();
        // Verifica che la modalità sia stata selezionata correttamente
        
        // Seleziona una partita di 1 minuto
        cy.get('[aria-labelledby="duration-label"]').click();
        cy.contains('1 minute').click();

        // Inseriamo i nomi dei giocatori
        cy.get('[labelId="player1"]').type('BiancoUser');
        cy.get('[labelId="player2"]').type('NeroUser');

        // Scegliamo un svantaggio per l'avversario
        cy.get('.MuiSlider-root').click({ force: true, position: 'left'});

        //Iniziamo il gioco
        cy.get('button:contains("Start Game")').click();
        
        cy.url().should('include', '/play/reallybadchess/').then(() => {
            // Facciamo le mosse
            performChessMoves('w');
        });
    });
});
