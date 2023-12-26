import React, { useState} from 'react';
import { useNavigate} from 'react-router-dom';
import ChessGameStyles from '../ChessGameStyles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Box,Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { faker } from '@faker-js/faker';

import Cookies from 'js-cookie';
import useTokenChecker from '../../../utils/useTokenChecker';
import CircularProgress from '@mui/material/CircularProgress';

const RandomWordsGenerator = (usernameToHashForSeed) => {
  // Hash dell'username (https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript)
  let hash = 0,
    i, chr;
  for (i = 0; i < usernameToHashForSeed.length; i++) {
    chr = usernameToHashForSeed.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // conversione a integer di 32 bit
  }

  faker.seed(hash * 100);

  const words = [];
  words.push(faker.word.adverb());
  words.push(faker.word.adjective());
  words.push(faker.word.noun());

  // Capitalize first letter
  words.forEach((word, index) => {
    words[index] = word.charAt(0).toUpperCase() + word.slice(1);
  });

  return words.join(' ');
};

function LobbyOnline() {
  const navigate = useNavigate();

  const { loginStatus, isTokenLoading} = useTokenChecker();
  const [games, setGames] = useState([]);

  React.useEffect(() => {
    if (!isTokenLoading) {
      if (!loginStatus) {
        navigate("/login");
      } else {
        fetch('/api/reallybadchess/getEmptyGames/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            return response.json();  // Parse the response as JSON and return the promise
          })
          .then(data => {
            console.log('Data from server:', data)
            if (data.success) {
              setGames(data.games);
            } else {
              console.log(data.message);
            }
          })
          .catch(error => {
            console.error('Fetch error:', error);
          });
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


  const handleJoinGame = (gameId) => {
    fetch(`/api/reallybadchess/joinGame/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        return response.json();  // Parse the response as JSON and return the promise
      })
      .then(data => {
        console.log('Data from server:', data)
        if (data.success) {
          navigate(`/play/reallybadchess/${gameId}`);
        } else {
          console.log(data.message);
        }
      });
  };


  return (
    <Box sx={ChessGameStyles.everythingContainer}>
      <Paper elevation={3} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '20px',
        p: 3,
        m: 2,
        maxWidth: '600px',
        width: '100%',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h5">Join a game or create a new one!</Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game Name</TableCell>
              <TableCell>White Player</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Cancella data corrente
                    setGames([]);

                    fetch('/api/reallybadchess/getEmptyGames/', {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                      },
                    })
                      .then(response => {
                        if (!response.ok) {
                          throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        console.log('Response Status:', response.status);
                        console.log('Response Headers:', response.headers);
                        return response.json();  // Parse the response as JSON and return the promise
                      })
                      .then(data => {
                        console.log('Data from server:', data)
                        if (data.success) {
                          setGames(data.games);
                        } else {
                          console.log(data.message);
                        }
                      })
                      .catch(error => {
                        console.error('Fetch error:', error);
                      });
                  }}
                >
                  <Refresh />
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {games.length == 0 ?
              <TableRow>
                <TableCell colSpan={4} sx={{textAlign: "center"}}>Nessuna partita disponibile, crea la tua</TableCell>
              </TableRow>
              :
              games.map((game) => (
                <TableRow key={game.gameId}>
                  <TableCell>{RandomWordsGenerator(game.player1.username)}</TableCell>
                  <TableCell>{game.player1.username}</TableCell>
                  <TableCell>{game.gameSettings.duration}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleJoinGame(game.gameId)}
                    >
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Button variant="contained"
          color="primary"
          sx={{ mt: 2 }} // Add margin-top for better spacing
          onClick={()=> navigate('/play/reallybadchess')}>Go Back</Button>
      </Paper>
    </Box>
  );
}


export default LobbyOnline;