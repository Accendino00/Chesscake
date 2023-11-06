import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import createTheme from '@mui/material/styles/createTheme';	
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Link from '@mui/material/Link';
import styled from '@mui/material/styles/styled';
import Stack from '@mui/material/Stack';
import { ColorAnonimoButton } from '../login/loginUIUtils';
import { ColorLoginButton } from '../login/loginUIUtils';
import { ColorUsernameTextField } from '../login/loginUIUtils';
import { ColorPasswordTextField } from '../login/loginUIUtils';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import { ColorRegisterButton } from './registerPopupUtils';
import CloseIcon from '@mui/icons-material/Close';


export default function RegisterPopup(props) {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (props.trigger) ? (
        // Grid generale per la pagina di login
        <Container
            maxWidth = 'false'
            sx={{
                position: 'fixed',
                display: 'flex',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            
            <Paper elevation = {10} sx={{position: 'relative', margin: '20px auto', padding:5, borderRadius:'12px'}}>
                    <IconButton sx={{position: 'absolute', top:0, right:0, padding:'8px', zIndex: 1001}} className="close-btn" onClick={() => props.setTrigger(false)}> <CloseIcon /> </IconButton>
                    {props.children}
                    <Grid container direction="column" spacing={6} alignItems="center" justifyContent="center">
                        {/*titolo*/}
                        <Grid item>
                            <Typography variant="h4" component="div" gutterBottom>
                                Benvenuto in ChessCake, Registrati
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ColorUsernameTextField helperText="Imposta il tuo username" sx={{ width: '36ch', height: '9ch' }} label="Username"  variant="filled" 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}/>
                        </Grid>
                        {/*password*/}
                        <Grid item>
                            <ColorPasswordTextField
                                helperText="Imposta la tua password"
                                required
                                sx={{ width: '36ch', height: '9ch' }}
                                label="Password"
                                variant="filled"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                            </InputAdornment>
                                    ),
                                }}
                                />
                        </Grid>
                        {/*conferma password*/}
                        <Grid item>
                            <ColorPasswordTextField
                                helperText="Conferma la tua password"
                                required
                                sx={{ width: '36ch', height: '9ch' }}
                                label="Conferma Password"
                                variant="filled"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                                />
                        </Grid>
                        {/*submit*/} 
                        <Grid item>
                            <ColorRegisterButton variant="contained" fullWidth>
                                Registrati
                            </ColorRegisterButton>
                            </Grid>
                        
                    </Grid>     
                </Paper>
            </Container>
    ) : "";
}

