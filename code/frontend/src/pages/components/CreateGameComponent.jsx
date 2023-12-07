import { Box, Tab, Typography } from '@mui/material';
import { Paper } from '@mui/material';
import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';


// TODO nome della lobby

function CreateGameComponent({duration}) {
    
    const [message, setMessage] = React.useState('');

    const navigate = useNavigate();
    const handleCreateGame = () => {
        fetch('/api/reallybadchess/newGame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          },
          body: JSON.stringify({
            settings: {
              mode: "playerVsPlayerOnline",
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
            return response.json();  // Parse the response as JSON and return the promise
          })
          .then(data => {
            console.log('Data from server:', data)
            if (data.success) {
              navigate(`/play/reallybadchess/${data.gameId}`);
            } else {
              setMessage(data.message);
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