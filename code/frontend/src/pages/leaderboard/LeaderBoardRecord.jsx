import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import "./LeaderBoardRecord.css";
import { useNavigate } from 'react-router-dom';

function LeaderBoardRecord({ username, value, rank }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/play/account/${username}`);
    }

    function uniqueColorUsername(username) {
        // Convert the string to a hash
        function hashString(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        // Convert hash to a color
        function hashToColor(hash) {
            const hue = Math.abs(hash % 360); // Use modulo to get value in [0, 360)
            const saturation = 50; // Set saturation to 50%
            const lightness = 70; // Set lightness to 70% for a light color
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }

        return hashToColor(hashString(username));
    }


    return (
        <Box className="recordBox" onClick={handleClick}>
            <Box style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
            }}>
                <Typography variant="h6" component="h6" style={{
                    minWidth: "30px",
                    paddingRight: "15px",
                    textAlign: "right",
                }}>
                    {rank}.
                </Typography>
                <Avatar sx={{ bgcolor: uniqueColorUsername(username), width: "30px", height: "30px", fontSize: "0.5em" }}>{"" + username[0] + username[1] + username[2]}</Avatar>
                <Typography variant="h6" component="h6" style={{
                    width: '300px',
                    paddingLeft: "30px",
                    textAlign: "left",
                }}>
                    {username}
                </Typography>
            </Box>
            <Typography variant="h6" component="h6" style={{
                width: '60px',
                paddingRight: "15px",
                textAlign: "right",
            }}>
                {value}
            </Typography>
        </Box>
    );
}

export default LeaderBoardRecord;