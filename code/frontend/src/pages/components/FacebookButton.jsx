import React, { useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import Button from '@mui/material/Button';
import { Facebook } from '@mui/icons-material/';

const FacebookButton = ({ sharedText }) => {
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
            redirectUri: window.location.href,
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

  const FacebookButton = ({ applicationId, responseFacebook }) => {
    useEffect(() => {
      // Load the Facebook SDK asynchronously
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: applicationId,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v12.0', // Replace with the desired version
        });
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }, [applicationId]);

    const handleLoginClick = () => {
      window.FB.login(
        function (response) {
          if (response.authResponse) {
            // Call your callback function with the response
            responseFacebook(response);
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        },
        { scope: 'email' } // Add any additional permissions you need
      );
    };

    return (
      <Button variant="contained" color="primary" onClick={handleLoginClick}>
      <Facebook/>
      Condividi
      </Button>
    );
  };

  return <FacebookButton applicationId={applicationId} responseFacebook={responseFacebook} />;
};

export default FacebookButton;
