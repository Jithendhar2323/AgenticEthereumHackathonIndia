import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai = null;
if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
}

// Demo responses for when API is rate-limited
const demoResponses = {
  "how can i improve my skills": "Great question! Here are some effective ways to improve your skills:\n\n1. **Set Clear Goals**: Define specific, measurable objectives\n2. **Practice Regularly**: Consistent practice beats occasional cramming\n3. **Learn from Others**: Find mentors, join communities, watch tutorials\n4. **Track Progress**: Use tools like this dashboard to monitor your growth\n5. **Get Feedback**: Ask for constructive criticism and act on it\n6. **Stay Updated**: Follow industry trends and new technologies\n\nWhat specific skill are you looking to improve?",

  "what should i learn next": "Based on current trends, here are some valuable skills to consider:\n\n**Tech Skills:**\n- AI/ML fundamentals\n- Data analysis\n- Cloud computing (AWS/Azure/GCP)\n- Cybersecurity basics\n\n**Soft Skills:**\n- Communication\n- Project management\n- Critical thinking\n- Adaptability\n\n**Industry-Specific:**\n- Digital marketing\n- UX/UI design\n- Blockchain basics\n- Sustainability practices\n\nWhat's your current background? I can give more targeted recommendations!",

  "help me create a learning plan": "I'll help you create a personalized learning plan! Here's a structured approach:\n\n**Step 1: Assessment**\n- Identify your current skill level\n- List your strengths and weaknesses\n- Define your career goals\n\n**Step 2: Prioritization**\n- Choose 2-3 skills to focus on\n- Rank them by importance and urgency\n- Set realistic timelines\n\n**Step 3: Resources**\n- Find quality courses and materials\n- Identify practice opportunities\n- Set up accountability systems\n\n**Step 4: Execution**\n- Create a daily/weekly schedule\n- Track your progress\n- Adjust as needed\n\nWould you like me to help you assess your current skills first?",

  "default": "I'm here to help you with your skill development journey! I can assist with:\n\n• Creating personalized learning plans\n• Recommending relevant skills to learn\n• Providing study strategies and tips\n• Tracking your progress\n• Answering questions about specific topics\n\nWhat would you like to work on today?"
};

export async function openaiChat(userMessage) {
  if (!openai) {
    return {
      type: 'error',
      content: 'OpenAI API key not set. Please set VITE_OPENAI_API_KEY in your .env.local file.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI career mentor and skill development assistant. You help users improve their skills, create learning plans, and provide personalized career guidance. Be encouraging, practical, and specific in your advice."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;

    return {
      type: 'message',
      content: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Check if it's a rate limit error - use demo mode
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate'))) {
      const lowerMessage = userMessage.toLowerCase();
      let demoResponse = demoResponses.default;

      // Find a matching demo response
      for (const [key, response] of Object.entries(demoResponses)) {
        if (lowerMessage.includes(key)) {
          demoResponse = response;
          break;
        }
      }

      return {
        type: 'message',
        content: demoResponse + "\n\n*Note: This is a demo response due to API rate limits. Your real AI responses will be more personalized when the API is available.*",
        timestamp: new Date().toISOString()
      };
    }

    return {
      type: 'error',
      content: 'OpenAI API error: ' + error.message,
      timestamp: new Date().toISOString()
    };
  }
} 