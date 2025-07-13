import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const GitHubLogin = ({ onLoginSuccess }) => {
  // GitHub OAuth credentials
  const GITHUB_CLIENT_ID = 'Ov23liT9ntlaQmsYib4J';
  const GITHUB_CLIENT_SECRET = '6472d47c05d93af07d196f2cfcf277bb8e090a56';

  // Generate a random state for security
  const generateState = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleGitHubLogin = () => {
    const state = generateState();
    const redirectUri = `${window.location.origin}/auth/callback`;

    // Store state in localStorage for verification
    localStorage.setItem('github_oauth_state', state);

    // Construct GitHub OAuth URL
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;

    // Redirect to GitHub
    window.location.href = githubAuthUrl;
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Or continue with
      </Typography>
      <Button
        variant="outlined"
        startIcon={<GitHubIcon />}
        onClick={handleGitHubLogin}
        fullWidth
        sx={{
          borderColor: '#333',
          color: '#333',
          '&:hover': {
            borderColor: '#000',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        Continue with GitHub
      </Button>
    </Box>
  );
};

export default GitHubLogin; 