import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';
import { generateRoadmap } from '../utils/roadmapGenerator';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ResourceDashboard from '../components/ResourceDashboard';
import resourceScraper from '../utils/resourceScraper';
import { scrapeCareerInsights } from '../utils/resourceScraper';

const badgeMock = [
  { name: 'HTML Pro', meta: 'Completed HTML/CSS/JS', claimed: true },
  { name: 'Portfolio Builder', meta: 'Built a personal site', claimed: false },
];

const skillOptions = [
  'JavaScript', 'React', 'Python', 'Node.js', 'SQL', 'HTML', 'CSS', 'Git',
  'Machine Learning', 'Data Science', 'DevOps', 'Cybersecurity', 'UI/UX Design'
];

function AnimatedProgress({ value }) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    let raf;
    if (progress < value) {
      const animate = () => {
        setProgress(prev => {
          if (prev < value) {
            raf = requestAnimationFrame(animate);
            return Math.min(prev + 2, value);
          }
          return prev;
        });
      };
      animate();
    } else if (progress > value) {
      setProgress(value);
    }
    return () => raf && cancelAnimationFrame(raf);
  }, [value, progress]);
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} size={60} thickness={5} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('skillagent_user') || '{}');
  const [completed, setCompleted] = React.useState(() => {
    return JSON.parse(localStorage.getItem('skillagent_completed') || '[]');
  });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [enhancedUser, setEnhancedUser] = useState(user);
  const [roadmap, setRoadmap] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [careerInsights, setCareerInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    async function fetchRoadmapWithResources() {
      setLoadingRoadmap(true);
      const baseRoadmap = generateRoadmap(enhancedUser);
      // For each step, fetch dynamic resources (tutorials/courses)
      const roadmapWithResources = await Promise.all(
        baseRoadmap.map(async (step) => {
          // Extract meaningful topic from step name
          const stepWords = step.step.toLowerCase().split(/[,\s&]+/).filter(word =>
            word.length > 2 && !['learn', 'build', 'explore', 'intro', 'advanced', 'basics', 'fundamentals'].includes(word)
          );

          // Use the most relevant word as topic, or the full step name
          const topic = stepWords[0] || step.step.split(' ')[1] || step.step;
          let resources = [];

          try {
            const res = await resourceScraper.getComprehensiveResources(topic);
            // Use tutorials and courses as resources
            resources = [
              ...(res.resources.tutorials || []),
              ...(res.resources.courses || [])
            ];
            console.log(`Fetched ${resources.length} resources for topic: ${topic}`, resources);
          } catch (e) {
            console.error(`Error fetching resources for ${topic}:`, e);
            resources = [];
          }

          return { ...step, resources };
        })
      );
      setRoadmap(roadmapWithResources);
      setLoadingRoadmap(false);
    }
    fetchRoadmapWithResources();
  }, [enhancedUser]);

  useEffect(() => {
    async function fetchInsights() {
      setLoadingInsights(true);
      const insights = await scrapeCareerInsights(enhancedUser.track || 'Web Development');
      setCareerInsights(insights);
      setLoadingInsights(false);
    }
    fetchInsights();
  }, [enhancedUser.track]);

  const handleMarkDone = (step) => {
    const updated = [...completed, step];
    setCompleted(updated);
    localStorage.setItem('skillagent_completed', JSON.stringify(updated));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setEnhancedUser(updatedProfile);
    localStorage.setItem('skillagent_user', JSON.stringify(updatedProfile));
    setProfileDialogOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4, px: 2 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" mb={1}>Hi, {enhancedUser.name || 'Learner'}!</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <AnimatedProgress value={roadmap.length ? Math.round((completed.length / roadmap.length) * 100) : 0} />
          <Box>
            <Typography variant="subtitle1">
              Progress: {roadmap.length ? Math.round((completed.length / roadmap.length) * 100) : 0}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {enhancedUser.track || 'General'} Track • {enhancedUser.experience || 'Beginner'} Level
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setProfileDialogOpen(true)}
          >
            Update Profile
          </Button>
        </Box>
      </Box>

      {/* Main Content Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Learning Roadmap" icon={<SchoolIcon />} />
          <Tab label="Resources & Opportunities" icon={<TrendingUpIcon />} />
          <Tab label="Career Insights" icon={<WorkIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Learning Roadmap Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Your Learning Roadmap</Typography>
                </Box>
                {loadingRoadmap ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {roadmap.map((item, i) => {
                      const isDone = completed.includes(item.step);
                      return (
                        <Card key={i} sx={{ opacity: isDone ? 0.6 : 1 }}>
                          <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Chip label={item.type} color={item.type === 'Project' ? 'secondary' : 'primary'} />
                              <Typography flex={1}>{item.step}</Typography>
                              {isDone && <Chip label="Completed" color="success" />}
                            </Stack>
                            {item.resources && item.resources.length > 0 && (
                              <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {item.resources.map((res, idx) => (
                                  <Button
                                    key={idx}
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    href={res.url || res.link || res.resourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      borderRadius: 3,
                                      fontWeight: 500,
                                      px: 2,
                                      py: 0.5,
                                      fontSize: '0.85rem',
                                      mb: 1,
                                      mr: 1,
                                      whiteSpace: 'nowrap',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      transition: 'background 0.2s, color 0.2s',
                                      '&:hover': {
                                        background: '#e3f2fd',
                                        color: '#1976d2',
                                      },
                                    }}
                                  >
                                    {res.title || res.label || res.name || `${res.platform || 'Resource'} ${idx + 1}`}
                                  </Button>
                                ))}
                              </Box>
                            )}
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                              {!isDone ? (
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleMarkDone(item.step)}
                                  sx={{
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    px: 3,
                                    boxShadow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    bgcolor: '#111',
                                    color: '#fff',
                                    transition: 'background 0.2s',
                                    '&:hover': {
                                      bgcolor: '#222',
                                      color: '#fff',
                                    },
                                  }}
                                  startIcon={<DoneOutlineIcon />}
                                >
                                  Mark as Done
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                  disabled
                                  sx={{
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    px: 3,
                                    opacity: 0.7,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                  startIcon={<CheckCircleIcon />}
                                >
                                  Completed
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" mb={2}>Your Badges</Typography>
                <Stack direction="column" spacing={2}>
                  {badgeMock.map((badge, i) => (
                    <Card key={i} sx={{ opacity: badge.claimed ? 1 : 0.5 }}>
                      <CardContent>
                        <Typography variant="subtitle2">{badge.name}</Typography>
                        <Typography variant="caption">{badge.meta}</Typography>
                        <Button size="small" variant="contained" color="success" sx={{ mt: 1 }} disabled={badge.claimed}>
                          {badge.claimed ? 'Claimed' : 'Claim Badge'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Resources & Opportunities Tab */}
        {activeTab === 1 && (
          <Box>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Select a Topic to Explore Resources
              </Typography>
              <Autocomplete
                options={skillOptions}
                value={selectedTopic}
                onChange={(event, newValue) => handleTopicSelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a skill or technology"
                    variant="outlined"
                    sx={{ maxWidth: 400 }}
                  />
                )}
              />
            </Box>
            {selectedTopic && (
              <ResourceDashboard
                userProfile={enhancedUser}
                selectedTopic={selectedTopic}
              />
            )}
          </Box>
        )}

        {/* Career Insights Tab */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" mb={3}>Career Insights & Market Trends</Typography>
                {loadingInsights ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : careerInsights ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      <b>Average Salary:</b> {careerInsights.averageSalary}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <b>Top Skills:</b> {careerInsights.topSkills.join(', ')}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <b>Trending Roles:</b>
                    </Typography>
                    <ul>
                      {careerInsights.trendingRoles.map((role, idx) => (
                        <li key={idx}>
                          {role.title} — {role.avgSalary} (Openings: {role.openings})
                        </li>
                      ))}
                    </ul>
                    <Typography variant="subtitle1" gutterBottom>
                      <b>Top Companies Hiring:</b> {careerInsights.topCompanies.join(', ')}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <b>Market Trend:</b> {careerInsights.jobMarketTrend}
                    </Typography>
                  </Box>
                ) : (
                  <Alert severity="info">
                    Career insights feature coming soon! This will include salary data, job market trends, and career progression paths.
                  </Alert>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" mb={2}>Quick Actions</Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setActiveTab(1)}
                    startIcon={<TrendingUpIcon />}
                  >
                    Explore Resources
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setProfileDialogOpen(true)}
                    startIcon={<SchoolIcon />}
                  >
                    Update Profile
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Profile Update Dialog */}
      <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Update Your Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={enhancedUser.name || ''}
                onChange={(e) => setEnhancedUser({ ...enhancedUser, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={enhancedUser.experience || 'beginner'}
                  onChange={(e) => setEnhancedUser({ ...enhancedUser, experience: e.target.value })}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Career Track</InputLabel>
                <Select
                  value={enhancedUser.track || 'General'}
                  onChange={(e) => setEnhancedUser({ ...enhancedUser, track: e.target.value })}
                >
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="AI/ML">AI/ML</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                  <MenuItem value="Mobile Development">Mobile Development</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                  <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Role"
                value={enhancedUser.currentRole || ''}
                onChange={(e) => setEnhancedUser({ ...enhancedUser, currentRole: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Role"
                value={enhancedUser.targetRole || ''}
                onChange={(e) => setEnhancedUser({ ...enhancedUser, targetRole: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time Commitment"
                value={enhancedUser.timeCommitment || ''}
                onChange={(e) => setEnhancedUser({ ...enhancedUser, timeCommitment: e.target.value })}
                placeholder="e.g., 10-15 hours/week"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={skillOptions}
                value={enhancedUser.skills || []}
                onChange={(event, newValue) => setEnhancedUser({ ...enhancedUser, skills: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Current Skills"
                    placeholder="Select your skills"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Career Goal"
                value={enhancedUser.goal || ''}
                onChange={(e) => setEnhancedUser({ ...enhancedUser, goal: e.target.value })}
                placeholder="Describe your career goals and what you want to achieve"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleUpdateProfile(enhancedUser)} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
