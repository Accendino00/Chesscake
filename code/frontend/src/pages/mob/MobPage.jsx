import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import useTokenChecker from "../../utils/useTokenChecker.jsx";


function MobPage() {
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

    // Ritorniamo un messaggio di errore
    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            width: "50vh",
            marginTop: "0px",
            margin: "auto",
            flexDirection: "column",
            alignContent: "space-between",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{
                backgroundColor: "white",
                width: "50vh",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: "20vh",
            }}>
                <Box>
                    <Typography variant="h4" sx={{ color: "black", fontWeight: "bolder" }}>
                        Work in progress
                    </Typography>
                    <Typography sx={{ color: "black", fontWeight: "thin" }}>
                        Ritorna in un secondo momento, ci stiamo ancora lavorando!
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" onClick={() => navigate('/play/')}>
                    Torna all'home page         </Button>
            </Box>
        </Box>
    );
}

export default MobPage;