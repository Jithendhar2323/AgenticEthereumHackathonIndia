import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

const GitHubCallback = ({ onLoginSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('github_oauth_state');

      // Verify state parameter
      if (state !== storedState) {
        setError('Invalid state parameter. Please try again.');
        setLoading(false);
        return;
      }

      if (!code) {
        setError('No authorization code received from GitHub.');
        setLoading(false);
        return;
      }

      try {
        // Exchange code for access token via backend proxy
        const tokenResponse = await fetch('http://localhost:4000/api/github-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        const accessToken = tokenData.access_token;

        // Get user information
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        const userData = await userResponse.json();

        if (userResponse.ok) {
          // Create user object
          const user = {
            name: userData.name || userData.login,
            email: userData.email,
            githubUsername: userData.login,
            avatar: userData.avatar_url,
            githubId: userData.id,
            interests: [],
            skills: [],
            goal: '',
            track: '',
          };

          // Store user data
          localStorage.setItem('skillagent_user', JSON.stringify(user));
          localStorage.removeItem('github_oauth_state');

          // Call success callback
          if (onLoginSuccess) {
            onLoginSuccess(user);
          }

          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          throw new Error('Failed to fetch user data from GitHub');
        }
      } catch (err) {
        console.error('GitHub OAuth error:', err);
        setError(err.message || 'Failed to authenticate with GitHub');
        setLoading(false);
      }
    };

    handleCallback();
  }, [onLoginSuccess]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" mt={2}>
          Authenticating with GitHub...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        maxWidth={400}
        mx="auto"
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" textAlign="center">
          Please try logging in again or contact support if the problem persists.
        </Typography>
      </Box>
    );
  }

  return null;
};

export default GitHubCallback; 