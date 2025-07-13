import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import SkillAgent from '../utils/aiAgent';
import { openaiChat } from '../utils/openaiAgent';

const AIChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agent, setAgent] = useState(null);
  const [showSkillAssessment, setShowSkillAssessment] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize AI agent when component mounts
  useEffect(() => {
    if (user && !agent) {
      const newAgent = new SkillAgent();
      newAgent.setUserContext(user);
      setAgent(newAgent);

      // Add welcome message
      setMessages([{
        id: 'welcome',
        type: 'bot',
        content: `Hi ${user.name}! I'm your AI career mentor. I can help you with:\n\n• Creating personalized learning roadmaps\n• Providing career guidance and advice\n• Assessing your skills and knowledge\n• Tracking your progress\n\nWhat would you like to work on today?`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [user, agent]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use OpenAI for chat
      const response = await openaiChat(inputMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: response.timestamp
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, OpenAI encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!agent) return;

    setIsLoading(true);
    try {
      const roadmap = await agent.generateRoadmap();

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `Here's your personalized learning roadmap for ${user.track}:\n\n${roadmap.roadmap.map((item, index) =>
          `${index + 1}. **${item.title}**\n   ${item.description}\n   ⏱️ ${item.estimatedTime}\n   📚 ${item.resources.join(', ')}\n`
        ).join('\n')}`,
        timestamp: new Date().toISOString(),
        roadmap: roadmap
      }]);
    } catch (error) {
      console.error('Roadmap generation error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: 'Sorry, I couldn\'t generate a roadmap right now. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: 'welcome',
      type: 'bot',
      content: `Hi ${user.name}! I'm your AI career mentor. How can I help you today?`,
      timestamp: new Date().toISOString()
    }]);
    if (agent) {
      agent.clearHistory();
    }
  };

  const handleTestAPI = async () => {
    setIsLoading(true);
    try {
      const response = await openaiChat('Say "Hello from OpenAI!"');
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: response.content ? `✅ OpenAI API test passed! Response: ${response.content}` : `❌ OpenAI API test failed: ${response.content}`,
        timestamp: new Date().toISOString()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: '❌ OpenAI API test failed.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message) => {
    const isBot = message.type === 'bot';

    return (
      <Box
        key={message.id}
        display="flex"
        justifyContent={isBot ? 'flex-start' : 'flex-end'}
        mb={2}
        gap={1}
      >
        {isBot && (
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <BotIcon fontSize="small" />
          </Avatar>
        )}

        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isBot ? 'grey.50' : 'primary.main',
            color: isBot ? 'text.primary' : 'white',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              '& strong': {
                fontWeight: 600
              }
            }}
          >
            {message.content}
          </Typography>

          {message.action === 'start_assessment' && (
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => setShowSkillAssessment(true)}
            >
              Start Assessment
            </Button>
          )}

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.7,
              fontSize: '0.7rem'
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Paper>

        {!isBot && (
          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
            <UserIcon fontSize="small" />
          </Avatar>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <BotIcon color="primary" />
            <Typography variant="h6">AI Career Mentor</Typography>
            <Chip label="GPT-4" size="small" color="primary" variant="outlined" />
          </Stack>
          <IconButton onClick={handleClearChat} size="small">
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map(renderMessage)}

        {isLoading && (
          <Box display="flex" justifyContent="flex-start" mb={2} gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <BotIcon fontSize="small" />
            </Avatar>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Quick Actions */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} mb={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleGenerateRoadmap}
            disabled={isLoading}
          >
            Generate Roadmap
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setInputMessage("What are the current trends in my field?");
            }}
            disabled={isLoading}
          >
            Career Trends
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setInputMessage("How can I improve my skills?");
            }}
            disabled={isLoading}
          >
            Skill Advice
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleTestAPI}
            disabled={isLoading}
            color="secondary"
          >
            Test API
          </Button>
        </Stack>
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Ask me anything about your career, skills, or learning path..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'grey.300'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Skill Assessment Modal */}
      {showSkillAssessment && currentAssessment && (
        <SkillAssessment
          assessment={currentAssessment}
          onClose={() => {
            setShowSkillAssessment(false);
            setCurrentAssessment(null);
          }}
          onComplete={(results) => {
            setShowSkillAssessment(false);
            setCurrentAssessment(null);
            // Handle assessment results
            setMessages(prev => [...prev, {
              id: Date.now(),
              type: 'bot',
              content: `Assessment completed! You scored ${results.score}% in ${currentAssessment.skill}. ${results.score >= 70 ? 'Great job!' : 'Keep practicing!'}`,
              timestamp: new Date().toISOString()
            }]);
          }}
        />
      )}
    </Box>
  );
};

// Skill Assessment Component
const SkillAssessment = ({ assessment, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

  const handleComplete = useCallback(() => {
    const correctAnswers = answers.filter((answer, index) =>
      answer === assessment.questions[index].correct
    ).length;

    const score = Math.round((correctAnswers / assessment.questions.length) * 100);

    onComplete({
      score,
      totalQuestions: assessment.questions.length,
      correctAnswers,
      answers
    });
  }, [answers, assessment, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleComplete]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = assessment.questions[currentQuestion];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              {assessment.skill} Assessment
            </Typography>
            <Chip
              label={`Time: ${formatTime(timeLeft)}`}
              color={timeLeft < 300 ? 'error' : 'primary'}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" mb={2}>
              Question {currentQuestion + 1} of {assessment.questions.length}
            </Typography>
            <Typography variant="body1" mb={3}>
              {question.question}
            </Typography>

            <Stack spacing={1}>
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  fullWidth
                  onClick={() => handleAnswer(index)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    p: 2,
                    borderRadius: 2
                  }}
                >
                  {option}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Typography variant="body2" color="text.secondary">
              {currentQuestion + 1} / {assessment.questions.length}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AIChat; 