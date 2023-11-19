// LandingPage.js
import React from 'react';
import useTokenChecker from '../../utils/useTokenChecker.jsx';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function LandingPage() {
    const { loginStatus, isLoading } = useTokenChecker();

    React.useEffect(() => {
      if (!isLoading) {
        if (loginStatus) {
          window.location.pathname = "/play";
        } else {
          window.location.pathname = "/login";
        }
      }
    }, [loginStatus, isLoading]);

    if (isLoading) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
          </Box>
        );
    }

    // Renderizza nulla, perché il redirect viene fatto in useEffect
    return null;
}

export default LandingPage;