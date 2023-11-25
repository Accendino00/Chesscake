import React, { useState } from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Slider, TextField, Paper, CircularProgress, Grid } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import Cookies from 'js-cookie';


/**
 * Questo componente permette di selezionare la modalità di gioco di
 * really bad chess, quindi giocare in locale, contro il computer, contro
 * un altro giocatore online o contro il computer in una sfida giornaliera.
 * 
 * Inoltre, permette di selezionare la durata della partita e il livello
 * 
 * @returns Interfaccia per la selezione della modalità di gioco
 */
const ModeSelection = () => {
    // Cose utili
    const navigate = useNavigate();

    const location = useLocation();
    const isChildRoute = /^\/play\/reallybadchess\/.+/.test(location.pathname);

    const [loading, setLoading] = useState(false); // Loading state

    /**
     * Le modalità di gioco possono essere:
     * - practiceVsComputer:    giocare contro il computer in modalità practice (si può selezionare il rank)
     * - playerVsComputer:      giocatore contro computer
     * - playerVsPlayer:        giocatore contro giocatore
     * - playerVsPlayerOnline:  giocatore contro giocatore online
     * - dailyChallenge:        sfida giornaliera contro il computer
     */
    const [mode, setMode] = useState('practiceVsComputer');

    // Dati della partita
    const [duration, setDuration] = useState(5); // durata in minuti
    const [rank, setRank] = useState(50);

    // Per le partite in locale, è possibile scegliere il nome dei giocatori
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');

    // Handler del form
    const handleModeChange = (event) => {
        setMode(event.target.value);
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const handleSliderChange = (event, newValue) => {
        setRank(newValue); // Update rank state when slider changes
    };

    // Handler del bottone "Start Game"
    const handleStartGame = () => {
        // Imposto il loading a true fino a quando non finisco la richiesta
        setLoading(true);

        // Dovrei navigare al tipo di gioco selezionato

        // se giochiamo playerVsPlayer, allora devo passare i dati al componente "ChessGameLocal" 
        // e navigare a "/play/reallybadchess/local"
        if (mode === 'playerVsPlayer') {
            // Se player 1 e player 2 non sono stati impostati, allora imposto i loro nomi di default

            const gameData = JSON.stringify({
                player1: player1 === '' ? 'Player 1' : player1,
                player2: player2 === '' ? 'Player 2' : player2,
                rank: rank,
                duration: duration
            });
            navigate(`/play/reallybadchess/local?data=${encodeURIComponent(gameData)}`);
        }

        // Se giochiamo in tutte le altre modalità, si tratta di una partita online
        // e quindi devo navigare a "/play/reallybadchess/:gameId"
        else {
            // Il GameID mi viene ritornato dalla richiesta di fetch che faccio al server
            // per creare una nuova partita. La richiesta la faccio ad /api/reallybadchess/newGame
            // e il server mi ritorna il GameID e una chiave nel caso io non abbia un token con il
            // quale ho eseguito la richiesta messa in Authorization Bearer
            const gameData = {
                settings: {
                    mode: mode,
                    duration: duration,
                }
            };

            if (mode === 'practiceVsComputer') {
                gameData.settings.rank = rank;
            }


            let token = Cookies.get('token')

            let headers = {};

            if (token) {
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('token') || ''
                }
            } else {
                headers = {
                    'Content-Type': 'application/json',
                }
            }

            fetch('/api/reallybadchess/newGame', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(gameData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Assumendo che 'data' contenga un campo 'gameId'
                    navigate(`/play/reallybadchess/${data.gameId}`);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

        setLoading(false);
    };

    return (
        <>
            {isChildRoute ?
                // Se siamo in una sottopagina, mostriamo il contenuto della sottopagina, ovvero la partita
                <Outlet />

                :

                // Interfaccia per la selezione della modalità di gioco
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Paper elevation={3} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        borderRadius: '20px',
                        p: 3,
                        m: 2,
                        maxWidth: '500px',
                        width: '100%',
                        backdropFilter: 'blur(10px)'
                    }}
                    >
                        <Typography variant="h2" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
                            REALLY <span style={{ fontSize: "20px" }}>bad</span> CHESS
                        </Typography>
                        <Box m={2} width={1 / 2}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="mode-label" style={{ color: 'darkblack' }}>Mode</InputLabel>
                                <Select labelId="mode-label" value={mode} onChange={handleModeChange} label="Mode">
                                    <MenuItem value={'practiceVsComputer'}>Freeplay</MenuItem>
                                    <MenuItem value={'playerVsComputer'}>Player vs Computer</MenuItem>
                                    <MenuItem value={'playerVsPlayer'}>Player vs Player</MenuItem>
                                    <MenuItem value={'playerVsPlayerOnline'}>Player vs Player (online)</MenuItem>
                                    <MenuItem value={'dailyChallenge'}>Daily Challenge</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {
                            mode === 'playerVsPlayer' &&
                            <>
                                <Box m={2} width={1 / 2}>
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel id="duration-label" style={{ color: 'darkblack' }}>Duration</InputLabel>
                                        <Select labelId="duration-label" label="Duration" value={duration} onChange={handleDurationChange}>
                                            <MenuItem value={0.25}>15 seconds</MenuItem>
                                            <MenuItem value={1}>1 minute</MenuItem>
                                            <MenuItem value={5}>5 minutes</MenuItem>
                                            <MenuItem value={10}>10 minutes</MenuItem>
                                            <MenuItem value={15}>15 minutes</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <form>
                                    <Typography variant="h8" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
                                        Player names
                                    </Typography>
                                    <TextField
                                        label="Player 1"
                                        value={player1}
                                        onChange={e => setPlayer1(e.target.value)}
                                    />
                                    <TextField
                                        label="Player 2"
                                        value={player2}
                                        onChange={e => setPlayer2(e.target.value)}
                                    />
                                </form>
                            </>
                        }

                        {/* Slider per il rank */}
                        {mode === 'practiceVsComputer' &&
                            <>
                                <Typography variant="h8" component="div" gutterBottom align="center" style={{ color: 'black', fontFamily: 'Arial', margin: '20px 0' }}>
                                    Rank slider
                                </Typography>

                                <Slider
                                    defaultValue={50}
                                    getAriaValueText={value => `Rank ${value}`}
                                    aria-labelledby="rank-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={0}
                                    max={100}
                                    onChange={handleSliderChange}
                                />
                            </>
                        }
                        <Box m={2}>
                            {loading ? (
                                <Grid item>
                                    <CircularProgress />
                                </Grid>
                            ) :
                                <Button variant="contained" color="primary" onClick={handleStartGame} style={{ color: 'darkblack' }}>
                                    Start Game
                                </Button>
                            }
                        </Box>
                    </Paper>
                </Box>
            }
        </>
    );
};

export default ModeSelection;