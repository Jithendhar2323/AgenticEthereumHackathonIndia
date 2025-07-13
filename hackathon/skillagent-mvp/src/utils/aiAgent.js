import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

// Initialize OpenAI client with better error handling
let llm;
try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.log('API Key available:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key starts with sk-:', apiKey ? apiKey.startsWith('sk-') : false);

  if (apiKey && apiKey.startsWith('sk-') && apiKey.length > 50) {
    console.log('Initializing OpenAI client with real API key');
    llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      dangerouslyAllowBrowser: true, // Required for browser usage
    });
  } else {
    console.log('No valid API key found, using mock responses');
    console.log('API Key value:', apiKey);
    llm = null;
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  llm = null;
}

// Mock responses for when API is not available
const MOCK_RESPONSES = {
  greeting: "Hi! I'm your AI career mentor. I can help you with personalized learning roadmaps, career advice, and skill assessments. What would you like to work on today?",
  roadmap: "Here's a personalized learning roadmap for you:\n\n1. **Foundation Skills** - Master the basics\n2. **Practical Projects** - Build real applications\n3. **Advanced Concepts** - Deep dive into complex topics\n4. **Industry Preparation** - Get ready for the job market",
  skill_advice: "To improve your skills, I recommend:\n• Practice regularly with hands-on projects\n• Join coding communities and forums\n• Follow industry leaders and stay updated\n• Build a portfolio of your work",
  career_trends: "Current trends in tech include:\n• AI/ML integration in all fields\n• Cloud computing and DevOps\n• Cybersecurity and data privacy\n• Remote work and collaboration tools",
  error: "I'm having trouble connecting to my AI services right now. Please try again in a moment, or you can still use the roadmap and assessment features!"
};

// Enhanced system prompt template for comprehensive analysis
const SYSTEM_PROMPT_TEMPLATE = PromptTemplate.fromTemplate(`
You are SkillAgent, an advanced AI career mentor and learning path advisor. Your role is to:

1. **Comprehensive Student Analysis**: Deeply analyze user's interests, current skills, career goals, and chosen track
2. **Personalized Roadmap Generation**: Create detailed, structured learning paths with specific milestones and timelines
3. **Resource Recommendations**: Suggest specific courses, tutorials, projects, and learning materials
4. **Career Guidance**: Provide industry insights, job market analysis, and career progression advice
5. **Skill Gap Analysis**: Identify missing skills and suggest targeted learning paths
6. **Project Recommendations**: Suggest relevant projects to build portfolio and practical experience

**Your Personality:**
- Encouraging and supportive, but realistic and data-driven
- Focused on practical, actionable steps with clear timelines
- Adapts communication style to user's experience level
- Provides specific, implementable recommendations

**Response Format:**
- Keep responses conversational and engaging
- When suggesting learning paths, structure them clearly with timelines
- Include specific resource recommendations when relevant
- Ask clarifying questions when needed
- Provide actionable next steps

**Available Career Tracks:** 
- Web Development (Frontend, Backend, Full-Stack)
- AI/ML (Machine Learning, Deep Learning, Data Science)
- Blockchain (Smart Contracts, DeFi, Web3)
- Data Science (Analytics, Visualization, Big Data)
- Mobile Development (iOS, Android, Cross-platform)
- DevOps (Cloud, CI/CD, Infrastructure)
- Cybersecurity (Network Security, Ethical Hacking)
- UI/UX Design (User Research, Prototyping, Design Systems)

**Key Principles:**
- Start with fundamentals before advanced topics
- Balance theory with practical projects
- Consider market demand and career progression
- Encourage continuous learning and skill building
- Focus on building a strong portfolio
- Include industry-relevant projects

**User Context:**
Name: {userName}
Interests: {interests}
Current Skills: {skills}
Career Goal: {goal}
Chosen Track: {track}
Experience Level: {experience}
Current Role: {currentRole}
Target Role: {targetRole}
Time Commitment: {timeCommitment}

**Conversation History:**
{conversationHistory}

**Current User Message:**
{userMessage}

Please provide a comprehensive, personalized response that includes:
1. Analysis of their current situation
2. Specific recommendations for their goals
3. Timeline and milestones
4. Resource suggestions
5. Next actionable steps
`);

// Enhanced roadmap generation prompt
const ROADMAP_PROMPT_TEMPLATE = PromptTemplate.fromTemplate(`
Create a comprehensive, personalized learning roadmap for a student with the following profile:

**Student Profile:**
Name: {name}
Interests: {interests}
Current Skills: {skills}
Career Goal: {goal}
Chosen Track: {track}
Experience Level: {experience}
Current Role: {currentRole}
Target Role: {targetRole}
Time Commitment: {timeCommitment}

**Requirements:**
Please create a detailed, step-by-step learning path that includes:

1. **Phase 1: Foundation (2-4 months)**
   - Essential skills to master first
   - Specific courses and resources
   - Mini-projects to practice
   - Timeline and milestones

2. **Phase 2: Intermediate (3-6 months)**
   - Advanced concepts and frameworks
   - Real-world projects
   - Industry best practices
   - Portfolio building

3. **Phase 3: Advanced (4-8 months)**
   - Specialized topics
   - Complex projects
   - Open source contributions
   - Industry preparation

4. **Phase 4: Career Preparation (2-4 months)**
   - Interview preparation
   - Resume building
   - Networking strategies
   - Job search tactics

**For each phase, include:**
- Specific skills to learn
- Recommended resources (courses, books, tutorials)
- Project ideas with difficulty levels
- Estimated time commitment
- Success criteria
- Prerequisites

**Resource Types to Recommend:**
- Online courses (Coursera, Udemy, edX)
- YouTube channels and playlists
- Documentation and tutorials
- Practice platforms (LeetCode, HackerRank)
- Project-based learning sites
- Industry blogs and newsletters

Make it practical, actionable, and tailored to their specific goals and time constraints.
`);

// Skill assessment questions database
const SKILL_ASSESSMENT_QUESTIONS = {
  'javascript': [
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: [
        "They are identical",
        "== checks value and type, === checks only value",
        "=== checks value and type, == checks only value",
        "== is deprecated, === is the modern way"
      ],
      correct: 2,
      explanation: "=== (strict equality) checks both value and type, while == (loose equality) performs type coercion before comparison."
    },
    {
      question: "What will console.log(typeof null) output?",
      options: ["null", "undefined", "object", "number"],
      correct: 2,
      explanation: "This is a known JavaScript quirk - typeof null returns 'object' due to a bug in the original implementation."
    },
    {
      question: "What is closure in JavaScript?",
      options: [
        "A way to close browser tabs",
        "A function that has access to variables in its outer scope",
        "A method to close database connections",
        "A way to end loops"
      ],
      correct: 1,
      explanation: "A closure is a function that retains access to variables from its outer scope even after the outer function has returned."
    }
  ],
  'react': [
    {
      question: "What is the purpose of the 'key' prop in React lists?",
      options: [
        "To make items clickable",
        "To help React identify which items have changed",
        "To style list items",
        "To add animations"
      ],
      correct: 1,
      explanation: "The key prop helps React efficiently update the DOM by identifying which items have changed, been added, or been removed."
    },
    {
      question: "What is the difference between state and props in React?",
      options: [
        "There is no difference",
        "Props are internal, state is external",
        "State is internal and mutable, props are external and immutable",
        "Props are for styling, state is for data"
      ],
      correct: 2,
      explanation: "State is internal component data that can change, while props are external data passed down from parent components and are immutable."
    },
    {
      question: "What hook would you use to perform side effects in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1,
      explanation: "useEffect is the hook used to perform side effects like data fetching, subscriptions, or manually changing the DOM."
    }
  ],
  'python': [
    {
      question: "What is the difference between a list and a tuple in Python?",
      options: [
        "Lists are faster than tuples",
        "Tuples are mutable, lists are immutable",
        "Lists are mutable, tuples are immutable",
        "There is no difference"
      ],
      correct: 2,
      explanation: "Lists are mutable (can be changed after creation), while tuples are immutable (cannot be changed after creation)."
    },
    {
      question: "What does the 'self' parameter represent in Python class methods?",
      options: [
        "The class itself",
        "The instance of the class",
        "A reserved keyword",
        "The parent class"
      ],
      correct: 1,
      explanation: "self represents the instance of the class and is used to access instance variables and methods."
    },
    {
      question: "What is a decorator in Python?",
      options: [
        "A way to style code",
        "A function that modifies another function",
        "A type of comment",
        "A way to import modules"
      ],
      correct: 1,
      explanation: "A decorator is a function that takes another function as input and extends its behavior without explicitly modifying it."
    }
  ]
};

class SkillAgent {
  constructor() {
    this.conversationHistory = [];
    this.userContext = null;
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "conversation_history"
    });

    // Initialize memory for conversation history
    if (llm) {
      console.log('LLM initialized successfully');
    }
  }

  // Initialize user context with enhanced fields
  setUserContext(user) {
    this.userContext = {
      name: user.name || 'User',
      interests: user.interests || [],
      skills: user.skills || [],
      goal: user.goal || 'Career growth',
      track: user.track || 'General',
      experience: user.experience || 'beginner',
      currentRole: user.currentRole || 'Student',
      targetRole: user.targetRole || 'Software Developer',
      timeCommitment: user.timeCommitment || '10-15 hours/week'
    };
  }

  // Enhanced main conversation method with comprehensive analysis
  async chat(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push(new HumanMessage(userMessage));

      // Check if user is claiming skill proficiency
      const skillClaim = this.detectSkillClaim(userMessage);
      if (skillClaim) {
        return this.handleSkillClaim(skillClaim);
      }

      // If no API available, use mock responses
      if (!llm) {
        console.log('Using mock response - no LLM available');
        return this.getMockResponse(userMessage);
      }

      // Create enhanced prompt with comprehensive context
      const formattedHistory = this.conversationHistory
        .slice(-8) // Keep last 8 messages for better context
        .map(msg => `${msg._getType()}: ${msg.content}`)
        .join('\n');

      const promptInput = {
        userName: this.userContext?.name || 'User',
        interests: this.userContext?.interests?.join(', ') || 'Not specified',
        skills: this.userContext?.skills?.join(', ') || 'Not specified',
        goal: this.userContext?.goal || 'Career growth',
        track: this.userContext?.track || 'General',
        experience: this.userContext?.experience || 'beginner',
        currentRole: this.userContext?.currentRole || 'Student',
        targetRole: this.userContext?.targetRole || 'Software Developer',
        timeCommitment: this.userContext?.timeCommitment || '10-15 hours/week',
        conversationHistory: formattedHistory,
        userMessage: userMessage
      };

      // Create LangChain chain
      const chain = RunnableSequence.from([
        SYSTEM_PROMPT_TEMPLATE,
        llm,
        new StringOutputParser()
      ]);

      // Get AI response
      console.log('Calling OpenAI API with enhanced LangChain...');
      const response = await chain.invoke(promptInput);
      console.log('OpenAI response received:', response.substring(0, 100) + '...');

      // Add AI response to history
      this.conversationHistory.push(new AIMessage(response));

      // Update memory
      await this.memory.saveContext(
        { input: userMessage },
        { output: response }
      );

      return {
        type: 'message',
        content: response,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AI Agent Error:', error);
      return this.getMockResponse(userMessage);
    }
  }

  // Get mock response based on user message
  getMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('roadmap') || lowerMessage.includes('path') || lowerMessage.includes('plan')) {
      return {
        type: 'message',
        content: MOCK_RESPONSES.roadmap,
        timestamp: new Date().toISOString()
      };
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('improve') || lowerMessage.includes('learn')) {
      return {
        type: 'message',
        content: MOCK_RESPONSES.skill_advice,
        timestamp: new Date().toISOString()
      };
    }

    if (lowerMessage.includes('trend') || lowerMessage.includes('market') || lowerMessage.includes('industry')) {
      return {
        type: 'message',
        content: MOCK_RESPONSES.career_trends,
        timestamp: new Date().toISOString()
      };
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        type: 'message',
        content: MOCK_RESPONSES.greeting,
        timestamp: new Date().toISOString()
      };
    }

    return {
      type: 'message',
      content: MOCK_RESPONSES.error,
      timestamp: new Date().toISOString()
    };
  }

  // Detect if user is claiming skill proficiency
  detectSkillClaim(message) {
    const lowerMessage = message.toLowerCase();
    const skillPatterns = {
      'javascript': ['javascript', 'js', 'ecmascript'],
      'react': ['react', 'reactjs', 'react.js'],
      'python': ['python', 'py'],
      'node': ['node', 'nodejs', 'node.js'],
      'sql': ['sql', 'database', 'mysql', 'postgresql'],
      'html': ['html', 'html5'],
      'css': ['css', 'css3', 'styling'],
      'git': ['git', 'github', 'version control']
    };

    for (const [skill, patterns] of Object.entries(skillPatterns)) {
      for (const pattern of patterns) {
        if (lowerMessage.includes(pattern)) {
          // Check for percentage claims
          const percentageMatch = lowerMessage.match(/(\d+)%/);
          if (percentageMatch) {
            const percentage = parseInt(percentageMatch[1]);
            if (percentage > 30) {
              return { skill, percentage, message };
            }
          }
        }
      }
    }
    return null;
  }

  // Handle skill claims by redirecting to assessment
  handleSkillClaim(claim) {
    const questions = SKILL_ASSESSMENT_QUESTIONS[claim.skill.toLowerCase()];

    if (questions) {
      return {
        type: 'skill_assessment',
        content: `I see you mentioned ${claim.skill} at ${claim.percentage}% proficiency. Let's verify your knowledge with a quick assessment!`,
        skill: claim.skill,
        questions: questions,
        timestamp: new Date().toISOString()
      };
    }

    return {
      type: 'message',
      content: `Great that you're confident in ${claim.skill}! I'd love to help you further develop this skill. What specific aspect of ${claim.skill} would you like to work on?`,
      timestamp: new Date().toISOString()
    };
  }

  // Generate comprehensive personalized roadmap using LangChain
  async generateRoadmap() {
    if (!llm || !this.userContext) {
      return {
        type: 'message',
        content: MOCK_RESPONSES.roadmap,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const chain = RunnableSequence.from([
        ROADMAP_PROMPT_TEMPLATE,
        llm,
        new StringOutputParser()
      ]);

      const response = await chain.invoke({
        name: this.userContext.name,
        interests: this.userContext.interests.join(', '),
        skills: this.userContext.skills.join(', '),
        goal: this.userContext.goal,
        track: this.userContext.track,
        experience: this.userContext.experience,
        currentRole: this.userContext.currentRole,
        targetRole: this.userContext.targetRole,
        timeCommitment: this.userContext.timeCommitment
      });

      return {
        type: 'roadmap',
        content: response,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Roadmap generation error:', error);
      return {
        type: 'message',
        content: MOCK_RESPONSES.roadmap,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Analyze student profile and provide comprehensive recommendations
  async analyzeStudentProfile() {
    if (!llm || !this.userContext) {
      return {
        type: 'message',
        content: "I'd be happy to analyze your profile and provide personalized recommendations!",
        timestamp: new Date().toISOString()
      };
    }

    try {
      const analysisPrompt = PromptTemplate.fromTemplate(`
        Analyze this student's profile and provide comprehensive recommendations:

        **Student Profile:**
        Name: {name}
        Interests: {interests}
        Current Skills: {skills}
        Career Goal: {goal}
        Chosen Track: {track}
        Experience Level: {experience}
        Current Role: {currentRole}
        Target Role: {targetRole}
        Time Commitment: {timeCommitment}

        **Please provide:**
        1. **Skill Gap Analysis**: What skills are missing for their target role?
        2. **Learning Priorities**: What should they focus on first?
        3. **Resource Recommendations**: Specific courses, tutorials, and projects
        4. **Timeline**: Realistic timeline for achieving their goals
        5. **Portfolio Strategy**: How to build a strong portfolio
        6. **Career Path**: Step-by-step progression to their target role
        7. **Industry Insights**: Current market trends and opportunities

        Make it practical, actionable, and tailored to their specific situation.
      `);

      const chain = RunnableSequence.from([
        analysisPrompt,
        llm,
        new StringOutputParser()
      ]);

      const response = await chain.invoke({
        name: this.userContext.name,
        interests: this.userContext.interests.join(', '),
        skills: this.userContext.skills.join(', '),
        goal: this.userContext.goal,
        track: this.userContext.track,
        experience: this.userContext.experience,
        currentRole: this.userContext.currentRole,
        targetRole: this.userContext.targetRole,
        timeCommitment: this.userContext.timeCommitment
      });

      return {
        type: 'analysis',
        content: response,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Profile analysis error:', error);
      return {
        type: 'message',
        content: "I'm having trouble analyzing your profile right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
    this.memory.clear();
  }

  // Get memory state
  async getMemoryState() {
    if (this.memory) {
      return await this.memory.loadMemoryVariables({});
    }
    return {};
  }
}

// Create and export singleton instance
const skillAgent = new SkillAgent();
export default skillAgent; 