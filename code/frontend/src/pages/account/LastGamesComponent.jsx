import React from 'react';
import { Box, Skeleton, Avatar, Typography, Divider } from '@mui/material';
import styles from './AccountPageStyles';

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

    let token = Cookies.get('token')

    React.useEffect(() => {
        if (username) {
            fetch('/api/account/getLastGames?number=10/' + username, {
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
            fetch('/api/account/getLastGames?number=10', {
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

    if (isLoading || !accountFound) { // Da togliere il !accountFound, lasciare come condizione solo "isLoading"
        // Placeholder
        return (<Box sx={styles.BoxGeneralUltimePartite}>
            {/* Parte del titolo dove dico che si tratta di "Ultime partite" */}
            <Box sx={styles.BoxTitle}>
                <Typography variant="h4" sx={styles.Title}>
                    Ultime partite
                </Typography>
            </Box>
            <Skeleton variant="rounded" width={700} height={30} />
            <Divider />
            <Skeleton variant="rounded" width={700} height={30} />
            <Divider />
            <Skeleton variant="rounded" width={700} height={30} />
            <Divider />
            <Skeleton variant="rounded" width={700} height={30} />
            <Divider />
            <Skeleton variant="rounded" width={700} height={30} />
            <Divider />
            <Skeleton variant="rounded" width={700} height={30} />
        </Box>
        );
    };

    if (!accountFound) {
        return <></>
    }

    
    // Real profile info:
    return (
        <Box sx={styles.BoxGeneralUltimePartite}>
        </Box>
    );



}

export default LastGamesComponent;