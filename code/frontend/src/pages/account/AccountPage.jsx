import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useTokenChecker from '../../utils/useTokenChecker.jsx';
import ProfileComponent from './ProfileComponent.jsx';
import LastGamesComponent from './LastGamesComponent.jsx';

function AccountPage() {
    const { loginStatus, isTokenLoading, username } = useTokenChecker();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isTokenLoading) {
            if (!loginStatus) {
                navigate("/login");
            }
        }
    }, [loginStatus, isTokenLoading]);

    if (isTokenLoading || loginStatus === undefined) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

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
            <ProfileComponent />
            <LastGamesComponent />
        </Box>
    );
}

export default AccountPage;