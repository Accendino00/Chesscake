import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';

import LeaderBoardRecord from './LeaderBoardRecord.jsx';
import Skeleton from '@mui/material/Skeleton';
import Cookies from 'js-cookie';


function DailyLeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    let token = Cookies.get('token')

    useEffect(() => {
        const fetchLeaderboard = async () => {
            let response, data;
            if (token) {
                response = await fetch('/api/leaderboard/daily', {
                    method: 'GET',
                    headers: { "Authorization": `Bearer ${token}` }
                });
            } else {
                response = await fetch('/api/leaderboard/daily', {
                    method: 'GET'
                });
            }
            data = await response.json();
            setLeaderboardData(data);
            setLoading(false);
        }
        fetchLeaderboard();
    }, []);

    return (
        <Box>
            {
                token ? (
                    <Typography variant="h6" sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "#1976d2",
                        marginTop: "20px",
                        marginBottom: "10px"
                    }}>
                        Classifica Generale
                    </Typography>
                ) : (<Box sx={{height: "15px"}}/>)
            }

            {
                loading ? (<>
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                </>) : (
                    <>
                        {leaderboardData.leaderboard.map((record, index, array) => {
                            return (
                                <React.Fragment key={"score" + (index + 1)}>
                                    <LeaderBoardRecord rank={index + 1} username={record.username} value={record.moves} />
                                    {array.length - 1 !== index && <Divider />}
                                </React.Fragment>
                            );
                        })}
                    </>)
            }

            {/* Se e solo se c'è il token, vado a renderizzare questa parte */}
            {token && (
                <>
                    <Typography variant="h6" style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        color: "#1976d2",
                        marginTop: "20px",
                        marginBottom: "10px",
                    }}>
                        Il tuo profilo
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rounded" width={700} height={35} sx={{ margin: "4px" }} />
                    ) : (
                        <LeaderBoardRecord rank={leaderboardData.userPlace.place} username={leaderboardData.userPlace.username} value={leaderboardData.userPlace.moves} />
                    )}
                </>
            )}
        </Box>
    );


}

export default DailyLeaderBoard;