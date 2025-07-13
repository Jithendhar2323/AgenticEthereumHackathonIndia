import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Chip, Stack, Divider } from '@mui/material';
import GitHubLogin from '../components/GitHubLogin';

const careerTracks = [
  'Web Development',
  'AI/ML',
  'Blockchain',
  'Data Science',
  'Mobile Apps',
];

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [track, setTrack] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name,
      interests: interests.split(',').map((x) => x.trim()),
      skills: skills.split(',').map((x) => x.trim()),
      goal,
      track,
    };
    localStorage.setItem('skillagent_user', JSON.stringify(user));
    if (onComplete) onComplete(user);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6} p={3} boxShadow={2} borderRadius={2}>
      <Typography variant="h5" mb={2}>Welcome to SkillAgent!</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" fullWidth required value={name} onChange={e => setName(e.target.value)} margin="normal" />
        <TextField label="Interests (comma separated)" fullWidth value={interests} onChange={e => setInterests(e.target.value)} margin="normal" />
        <TextField label="Current Skills (comma separated)" fullWidth value={skills} onChange={e => setSkills(e.target.value)} margin="normal" />
        <TextField label="Career Goal" fullWidth value={goal} onChange={e => setGoal(e.target.value)} margin="normal" />
        <Typography mt={2} mb={1}>Choose a Career Track:</Typography>
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" justifyContent="center" alignItems="center" sx={{ rowGap: 2 }}>
          {careerTracks.map((t) => (
            <Chip
              key={t}
              label={t}
              clickable
              onClick={() => setTrack(t)}
              sx={{
                mb: 1,
                mr: 1,
                minWidth: 140,
                bgcolor: track === t ? '#111' : '#fff',
                color: track === t ? '#fff' : '#111',
                border: '1.5px solid #111',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: track === t ? 2 : 0,
                transition: 'all 0.2s',
                textAlign: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: track === t ? '#222' : '#f5f5f5',
                },
              }}
              variant={track === t ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!name || !track}
          sx={{
            mt: 2,
            bgcolor: '#111',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 3,
            boxShadow: 2,
            py: 1.2,
            '&:hover': {
              bgcolor: '#222',
              color: '#fff',
            },
          }}
        >
          Start My Journey
        </Button>
      </form>
      
      <Divider sx={{ my: 3 }} />
      
      <GitHubLogin onLoginSuccess={onComplete} />
    </Box>
  );
}
