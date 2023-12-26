import React from 'react';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function CreateGameComponent({duration, mode}) {
  const path = (mode == 'kriegspiel' ? 'kriegspiel' : 'reallybadchess'); 
  const navigate = useNavigate();
  const handleCreateGame = () => {
    fetch(`/api/${path}/newGame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify({
        settings: {
          mode: mode,
          duration: duration,
        },
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      return response.json();
    })
    .then(data => {
      console.log('Data from server:', data);
      if (data.success) {
        navigate(`/play/${path}/${data.gameId}`);
      } else {
        console.log(data.message);
      }
    });
  };
  return (
    <Button
    variant="contained"
    color="primary"
    onClick={() => handleCreateGame()}
    sx={{ mt: 2 }} // Add margin-top for better spacing
    >
    Create Game
  </Button>
  );
}

export default CreateGameComponent;