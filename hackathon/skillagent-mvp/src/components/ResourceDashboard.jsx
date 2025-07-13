import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Rating,
  Link,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  School,
  Work,
  VideoLibrary,
  Code,
  TrendingUp,
  Star,
  AccessTime,
  LocationOn,
  Business,
  AttachMoney,
  ExpandMore,
  YouTube,
  GitHub,
  LinkedIn,
  Language
} from '@mui/icons-material';
import resourceScraper from '../utils/resourceScraper';

const ResourceDashboard = ({ userProfile, selectedTopic }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTopic) {
      loadResources(selectedTopic);
    }
  }, [selectedTopic]);

  const loadResources = async (topic) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🔄 Loading dynamic resources for: ${topic}`);
      const comprehensiveResources = await resourceScraper.getComprehensiveResources(topic, userProfile?.experience || 'beginner');
      setResources(comprehensiveResources);
      console.log(`✅ Successfully loaded ${Object.keys(comprehensiveResources.resources).length} resource categories`);
    } catch (err) {
      setError('Failed to load resources. Please try again.');
      console.error('Error loading resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          🔍 Searching the web for {selectedTopic} resources...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Fetching tutorials, courses, practice problems, and opportunities
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (resources && !loading) {
    const totalResources = Object.values(resources.resources).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`📊 Loaded ${totalResources} total resources across all categories`);
  }

  if (!resources) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          Select a topic to view learning resources and opportunities
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Learning Resources & Opportunities
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive resources for {selectedTopic} development
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Tutorials" icon={<VideoLibrary />} />
          <Tab label="Courses" icon={<School />} />
          <Tab label="Practice" icon={<Code />} />
          <Tab label="Projects" icon={<GitHub />} />
          <Tab label="Jobs" icon={<Work />} />
          <Tab label="Internships" icon={<Business />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {/* Tutorials Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {resources.resources.tutorials.map((tutorial, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <Chip
                      label={tutorial.skillLevel}
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      color="primary"
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {tutorial.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {tutorial.description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <YouTube color="error" />
                      <Typography variant="body2">{tutorial.channel}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">{tutorial.duration}</Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openLink(tutorial.url)}
                      startIcon={<YouTube />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #FF0000 30%, #FF6B6B 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 0, 0, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #D32F2F 30%, #FF5252 90%)',
                          boxShadow: '0 4px 8px 2px rgba(255, 0, 0, .4)',
                        }
                      }}
                    >
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Courses Tab */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {resources.resources.courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        {course.title}
                      </Typography>
                      <Chip label={course.price} color={course.price === 'Free' ? 'success' : 'primary'} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {course.platform} • {course.instructor}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Rating value={course.rating} readOnly size="small" />
                      <Typography variant="body2">({course.rating})</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.students} students
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">{course.duration}</Typography>
                      <Chip label={course.skillLevel} size="small" variant="outlined" />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openLink(course.url)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        mt: 'auto',
                        background: 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
                        boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565C0 30%, #2196F3 90%)',
                          boxShadow: '0 4px 8px 2px rgba(25, 118, 210, .4)',
                        }
                      }}
                    >
                      View Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Practice Tab */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            {resources.resources.practice.map((practice, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      {practice.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Chip label={practice.platform} color="primary" />
                      <Chip label={practice.difficulty} variant="outlined" />
                      <Typography variant="body2" color="text.secondary">
                        {practice.problems} problems
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openLink(practice.url)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        mt: 'auto',
                        background: 'linear-gradient(45deg, #2E7D32 30%, #66BB6A 90%)',
                        boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1B5E20 30%, #4CAF50 90%)',
                          boxShadow: '0 4px 8px 2px rgba(46, 125, 50, .4)',
                        }
                      }}
                    >
                      Start Practicing
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Projects Tab */}
        {activeTab === 3 && (
          <Grid container spacing={3}>
            {resources.resources.projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {project.description}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {project.technologies.map((tech, techIndex) => (
                        <Chip key={techIndex} label={tech} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Chip label={project.difficulty} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {project.estimatedTime}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openLink(project.githubUrl)}
                      startIcon={<GitHub />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        mt: 'auto',
                        background: 'linear-gradient(45deg, #424242 30%, #757575 90%)',
                        boxShadow: '0 3px 5px 2px rgba(66, 66, 66, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #212121 30%, #616161 90%)',
                          boxShadow: '0 4px 8px 2px rgba(66, 66, 66, .4)',
                        }
                      }}
                    >
                      View Project Ideas
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Jobs Tab */}
        {activeTab === 4 && (
          <Grid container spacing={3}>
            {resources.resources.jobs.map((job, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {job.title}
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                          {job.company}
                        </Typography>
                      </Box>
                      <Chip label={job.salary} color="success" />
                    </Box>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>
                      <Chip label={job.type} size="small" />
                      <Chip label={job.experience} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {job.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Posted {job.posted}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => openLink(job.url)}
                        startIcon={<Work />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          background: 'linear-gradient(45deg, #FF6F00 30%, #FFB74D 90%)',
                          boxShadow: '0 3px 5px 2px rgba(255, 111, 0, .3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #E65100 30%, #FF9800 90%)',
                            boxShadow: '0 4px 8px 2px rgba(255, 111, 0, .4)',
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Internships Tab */}
        {activeTab === 5 && (
          <Grid container spacing={3}>
            {resources.resources.internships.map((internship, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      {internship.title}
                    </Typography>
                    <Typography variant="body1" color="primary" gutterBottom>
                      {internship.company}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">{internship.location}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {internship.duration}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {internship.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {internship.stipend}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Deadline: {internship.deadline}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openLink(internship.url)}
                      startIcon={<Business />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        mt: 'auto',
                        background: 'linear-gradient(45deg, #7B1FA2 30%, #BA68C8 90%)',
                        boxShadow: '0 3px 5px 2px rgba(123, 31, 162, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #4A148C 30%, #9C27B0 90%)',
                          boxShadow: '0 4px 8px 2px rgba(123, 31, 162, .4)',
                        }
                      }}
                    >
                      Apply for Internship
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<TrendingUp />}
              onClick={() => loadResources(selectedTopic)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderWidth: 2,
                minHeight: 48,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }
              }}
            >
              Refresh Resources
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LinkedIn />}
              onClick={() => openLink(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedTopic + ' developer')}`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderWidth: 2,
                borderColor: '#0077B5',
                color: '#0077B5',
                minHeight: 48,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#005885',
                  backgroundColor: '#0077B5',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,119,181,0.3)',
                }
              }}
            >
              Search More Jobs
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Language />}
              onClick={() => openLink(`https://www.geeksforgeeks.org/${selectedTopic.toLowerCase()}/`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderWidth: 2,
                borderColor: '#2F8D46',
                color: '#2F8D46',
                minHeight: 48,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#1B5E20',
                  backgroundColor: '#2F8D46',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(47,141,70,0.3)',
                }
              }}
            >
              View Documentation
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHub />}
              onClick={() => openLink(`https://github.com/topics/${selectedTopic.toLowerCase()}`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderWidth: 2,
                borderColor: '#333',
                color: '#333',
                minHeight: 48,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#000',
                  backgroundColor: '#333',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(51,51,51,0.3)',
                }
              }}
            >
              GitHub Projects
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<School />}
              onClick={() => openLink(`https://www.freecodecamp.org/learn/${selectedTopic.toLowerCase()}/`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderWidth: 2,
                borderColor: '#0A0A23',
                color: '#0A0A23',
                minHeight: 48,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#000',
                  backgroundColor: '#0A0A23',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(10,10,35,0.3)',
                }
              }}
            >
              FreeCodeCamp
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ResourceDashboard; 