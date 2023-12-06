import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton , Typography, Divider, Grid} from '@mui/material';
import { CheckCircle, Error, Computer, Event, SportsKabaddi, Replay} from '@mui/icons-material';
import styles from './AccountPageStyles';
import ReplayComponent from '../replay/Replay.jsx';

import LanguageIcon from '@mui/icons-material/Language';
import { PlayerVsPlayerIcon, PlayerVsComputerIcon, DailyChallengeIcon } from '../../utils/ModeIcons.jsx';


import Cookies from 'js-cookie';

function LastGamesComponent({username}) {

    // Andiamo a fare una fetch dei dati dell'account dell'utente
    // per poterli mostrare nella pagina.
    // Fino a quando la fetch non ritorna i dati, mostriamo uno skeleton.

    const [lastGamesData, setLastGamesData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [accountFound, setAccountFound] = React.useState(false);
    const [replayGameIndex, setReplayGameIndex] = useState(null);

    let token = Cookies.get('token')

    React.useEffect(() => {
        if (username) {
            fetch('/api/account/getLastGames/' + username, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setLastGamesData(data.lastGames);
                    setAccountFound(true);
                }
                setIsLoading(false);
            });
        } else {
            fetch('/api/account/getLastGames/', {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setLastGamesData(data.lastGames);
                        setAccountFound(true);
                    }
                    setIsLoading(false);
                });
        }
    }, []);

    if (replayGameIndex !== null) {
        console.log(lastGamesData[replayGameIndex].matches.board);
        return <ReplayComponent game={lastGamesData[replayGameIndex].matches.moves} />;
    }
        // Placeholder
        return (
            <Box sx={styles.BoxGeneralUltimePartite}>
                <Typography variant="h5" sx={styles.TypographyUltimePartite}>Ultime partite</Typography>
                {lastGamesData && lastGamesData.length > 0 && lastGamesData.map((game, index) => (
                    <div key={index}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={5}>
                            {game.won ? <CheckCircle color="success" /> : <Error color="error" />}
                            <Typography>{game.won ? 'Won' : 'Lost'}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display="flex" justifyContent="flex-end">
                                {game.mode === 'playerVsComputer' ? <Computer /> : game.mode === 'dailyChallenge' ? <Event /> : <SportsKabaddi />}
                                <Typography>{`Partita ${index + 1}:`}</Typography>
                                <IconButton component={Link} to={`/replay/${username}:${index}`}>
                                    <Replay />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                    {index < lastGamesData.length - 1 && <Divider />} 
                    </div>
                ))}
                {lastGamesData <= 0 && <Typography>Non ci sono partite da mostrare</Typography>}
            </Box>
        );
};


export default LastGamesComponent;