import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/Navbar.jsx';
import useTokenChecker from '../../utils/useTokenChecker.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import HomePage from './Homepage.jsx';
import NavPagesBackground from './NavPagesBackground.jsx';

function NavPage() {
    const { loginStatus, isTokenLoading } = useTokenChecker();

    const location = useLocation();
    const isChildRoute = /^\/play\/.+/.test(location.pathname);


    if (isTokenLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <NavPagesBackground />
            <Navbar loginStatus={loginStatus} />
            {isChildRoute ? <Outlet /> : <HomePage />} 
        </>
    );
}

export default NavPage;