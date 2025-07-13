import React from 'react';
import { Box, Typography, Stack, Card, CardContent, Chip } from '@mui/material';

const badgeMock = [
  { name: 'HTML Pro', meta: 'Completed HTML/CSS/JS', claimed: true },
  { name: 'Portfolio Builder', meta: 'Built a personal site', claimed: false },
];

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('skillagent_user') || '{}');
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4">{user.name || 'Learner'}'s Public Profile</Typography>
      <Typography variant="subtitle1" mb={2}>{user.interests?.join(', ')}</Typography>
      <Typography variant="body1" mb={2}><b>Career Goal:</b> {user.goal}</Typography>
      <Typography variant="body2" mb={3}><b>Track:</b> {user.track}</Typography>
      <Typography variant="h6" mb={1}>Badges</Typography>
      <Stack direction="row" spacing={2} mb={3}>
        {badgeMock.filter(b => b.claimed).map((badge, i) => (
          <Card key={i} sx={{ minWidth: 120 }}>
            <CardContent>
              <Typography variant="subtitle2">{badge.name}</Typography>
              <Typography variant="caption">{badge.meta}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Typography variant="h6" mb={1}>Skill Roadmap</Typography>
      <Stack direction="row" spacing={1}>
        {(user.skills || []).map((skill, i) => (
          <Chip key={i} label={skill} color="primary" />
        ))}
      </Stack>
      <Box mt={4}>
        <Typography variant="body2" color="text.secondary">GitHub activity and more coming soon...</Typography>
      </Box>
    </Box>
  );
}
