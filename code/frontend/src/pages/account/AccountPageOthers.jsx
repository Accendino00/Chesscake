import React, {useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ProfileComponent from './ProfileComponent.jsx';
import LastGamesComponent from './LastGamesComponent.jsx';

function AccountPageOthers() {
    const navigate = useNavigate();

    // Controllo se l'username è specificato nei parametri dell'URL, in caso contrario reindirizzo alla pagina /
    const { username } = useParams(); // Extract username from URL

    useEffect(() => {
        if (!username) {
            //navigate('/'); // Redirect to home if no username is provided
        }
    }, [username, navigate]);

    console.log(username);

    // Renderizza nulla, perché il redirect viene fatto in useEffect
    return (
        // Div che contiene tutto lo stile
        <Box style={{
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <ProfileComponent username={username} />
            <LastGamesComponent />
        </Box>
    );
}

export default AccountPageOthers;