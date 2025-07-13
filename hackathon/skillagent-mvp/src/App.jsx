import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import GitHubCallback from './components/GitHubCallback';

function App() {
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillagent_user') || '{}');
    } catch {
      return {};
    }
  });

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>SkillAgent</Typography>
          {user.name && (
            <Box>
              <Button color="inherit" href="/dashboard">Dashboard</Button>
              <Button color="inherit" href="/profile">Profile</Button>
              <Button color="inherit" onClick={() => {
                localStorage.removeItem('skillagent_user');
                localStorage.removeItem('skillagent_completed');
                setUser({});
                window.location.href = '/';
              }}>Logout</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={user.name ? <Navigate to="/dashboard" replace /> : <Onboarding onComplete={setUser} />} />
          <Route path="/dashboard" element={user.name ? <Dashboard user={user} /> : <Navigate to="/" replace />} />
          <Route path="/profile" element={user.name ? <Profile user={user} /> : <Navigate to="/" replace />} />
          <Route path="/auth/callback" element={<GitHubCallback onLoginSuccess={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
