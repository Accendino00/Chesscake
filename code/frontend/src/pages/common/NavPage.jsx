import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar.jsx';
import useTokenChecker from '../../utils/useTokenChecker.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function NavPage() {
    const { loginStatus, isLoading } = useTokenChecker();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Navbar loginStatus={loginStatus} />
            <Outlet />
        </>
    );
}

export default NavPage;