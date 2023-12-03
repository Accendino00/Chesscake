import React from 'react';
import FacebookLogin from 'react-facebook-login';
import Button from '@mui/material/Button';


const ShareButton = ({ sharedText }) => {
  
const applicationId = '731484812225728';

const secretApplicationId = '1eab2a1da45b5cae539f37ed6436dccd';
  const responseFacebook = async (response) => {
    try {
      console.log('Facebook login response:', response);
      if (response.accessToken) {
        // Send the authorization code to the server to obtain the access token
        const loginResponse = await fetch('/facebook/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appId: applicationId,
            appSecret: secretApplicationId,
            code: response.code,
            redirectUri : window.location.href,
          }),
        });

        const loginResult = await loginResponse.json();

        if (loginResult.success) {
          // Successfully obtained the access token, now share on Facebook
          await handleShare(loginResult.accessToken);
        } else {
          console.error('Error during Facebook login:', loginResult.error);
        }
      } else {
        console.log('Facebook login failed');
      }
    } catch (error) {
      console.error('Error during Facebook login:', error);
    }
  };

  const handleShare = async (accessToken) => {
    try {
      const shareResponse = await fetch('/facebook/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          href: 'http://localhost:8000/login',
          quote: sharedText,
        }),
      });

      const shareResult = await shareResponse.json();

      if (shareResult.success) {
        console.log('Successfully shared on Facebook');
      } else {
        console.error('Error sharing on Facebook:', shareResult.error);
      }
    } catch (error) {
      console.error('Error sharing on Facebook:', error);
    }
  };

  return (
    <FacebookLogin
      appId={applicationId}
      appSecret={secretApplicationId}
      redirectUri = {window.location.href}
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      render={(renderProps) => (
        <Button variant="contained" color="primary" onClick={renderProps.onClick}>
          Share on Facebook
        </Button>
      )}
    />
  );
};

export default ShareButton;