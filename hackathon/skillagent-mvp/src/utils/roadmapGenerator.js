// Generates a personalized learning roadmap based on user input

// Resource mapping (move this to the top)
const resourceMap = {
  python: [
    { label: 'GeeksforGeeks Python Full Course', url: 'https://www.geeksforgeeks.org/courses/master-python-complete-beginner-to-advanced' },
    { label: 'YouTube: Python for Beginners (Playlist)', url: 'https://www.youtube.com/playlist?list=PLlrxD0HtieHhS8VzuMCfQD4uJ9yne1mE6' }
  ],
  dsa: [
    { label: 'GeeksforGeeks DSA Course', url: 'https://www.geeksforgeeks.org/data-structures/' },
    { label: 'YouTube: DSA Full Playlist', url: 'https://www.youtube.com/playlist?list=PLqleLpAMfxG6U0MyoXKGE4aL0k8WfFvX_' }
  ],
  react: [
    { label: 'GeeksforGeeks React JS Course', url: 'https://www.geeksforgeeks.org/courses/react-js-beginner-to-advance' },
    { label: 'YouTube: React JS Full Course (Playlist)', url: 'https://www.youtube.com/playlist?list=PLfyWdpsiUiPCQzWk1YV0vi-0arAzXm_1B' }
  ],
  html: [
    { label: 'GeeksforGeeks HTML Tutorial', url: 'https://www.geeksforgeeks.org/html-tutorial/' },
    { label: 'YouTube: HTML Full Course', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbkFiqHnNaxpOPhh9tSWMXIF' }
  ],
  css: [
    { label: 'GeeksforGeeks CSS Tutorial', url: 'https://www.geeksforgeeks.org/css-tutorial/' },
    { label: 'YouTube: CSS Full Course', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbmGQoa5iPsv6nL1tL6pF3V2' }
  ],
  javascript: [
    { label: 'GeeksforGeeks JavaScript Tutorial', url: 'https://www.geeksforgeeks.org/javascript/' },
    { label: 'YouTube: JavaScript Full Course', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbkArDMazoARtNz1aMwNWmvC' }
  ],
  solidity: [
    { label: 'GeeksforGeeks Solidity Tutorial', url: 'https://www.geeksforgeeks.org/introduction-to-solidity/' },
    { label: 'YouTube: Solidity Full Course', url: 'https://www.youtube.com/playlist?list=PLbbtODcOYIoE0D7_Xb6rKpL5tXy0xwB5z' }
  ],
  flutter: [
    { label: 'GeeksforGeeks Flutter Tutorial', url: 'https://www.geeksforgeeks.org/flutter-a-complete-guide/' },
    { label: 'YouTube: Flutter Full Course', url: 'https://www.youtube.com/playlist?list=PLlxmoA0rQ-Lw5k_QCqVlYpXnXo4p0b5pz' }
  ],
  'machine learning': [
    { label: 'GeeksforGeeks ML Tutorial', url: 'https://www.geeksforgeeks.org/machine-learning/' },
    { label: 'YouTube: Machine Learning Full Course', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPkl7oRvzyNnyj1HS4wt2K-' }
  ],
  'data science': [
    { label: 'GeeksforGeeks Data Science', url: 'https://www.geeksforgeeks.org/data-science-tutorial/' },
    { label: 'YouTube: Data Science Full Course', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVMdJ5sqbCK2LiM0HhQVWNzm' }
  ],
  'soft ware testing': [
    { label: 'GeeksforGeeks Software Testing', url: 'https://www.geeksforgeeks.org/software-testing/' },
    { label: 'YouTube: Software Testing Full Course', url: 'https://www.youtube.com/playlist?list=PLWPirh4EWFpE4bK5kKQ9Wl5zL3QwLJk1g' }
  ]
};

// Don't add static resources - let Dashboard handle dynamic resource fetching
function addResourcesToTemplateStep(stepObj) {
  return stepObj; // Return step without static resources
}

const templates = {
  'Web Development': [
    { step: 'Learn HTML, CSS, JS', type: 'Course' },
    { step: 'Build a Portfolio Website', type: 'Project' },
    { step: 'Learn React', type: 'Course' },
    { step: 'Contribute to Open Source', type: 'Project' },
  ].map(addResourcesToTemplateStep),
  'AI/ML': [
    { step: 'Python Basics', type: 'Course' },
    { step: 'Intro to Machine Learning', type: 'Course' },
    { step: 'Kaggle Competition', type: 'Project' },
    { step: 'Deep Learning Specialization', type: 'Course' },
  ].map(addResourcesToTemplateStep),
  'Data Science': [
    { step: 'Python & Pandas', type: 'Course' },
    { step: 'Statistics Fundamentals', type: 'Course' },
    { step: 'Data Visualization Project', type: 'Project' },
    { step: 'Machine Learning Basics', type: 'Course' },
  ].map(addResourcesToTemplateStep),
  'Blockchain': [
    { step: 'Solidity Basics', type: 'Course' },
    { step: 'Build an NFT Dapp', type: 'Project' },
    { step: 'Smart Contract Security', type: 'Course' },
    { step: 'Contribute to Web3 Project', type: 'Project' },
  ].map(addResourcesToTemplateStep),
  'Mobile Apps': [
    { step: 'Learn Dart & Flutter', type: 'Course' },
    { step: 'Build a Todo App', type: 'Project' },
    { step: 'Publish to Play Store', type: 'Project' },
    { step: 'Explore React Native', type: 'Course' },
  ].map(addResourcesToTemplateStep),
};

export function generateRoadmap(user) {
  const base = templates[user.track] || [];
  let personalized = [...base];
  // Add advanced skill steps (resources will be fetched dynamically)
  if (user.skills && user.skills.length > 0) {
    user.skills.forEach(skill => {
      const key = skill.trim().toLowerCase();
      if (!base.some(item => item.step.toLowerCase().includes(key))) {
        personalized.unshift({
          step: `Advanced ${skill}`,
          type: 'Course'
        });
      }
    });
  }
  // Add interest-based projects (resources will be fetched dynamically)
  if (user.interests && user.interests.length > 0) {
    user.interests.forEach(interest => {
      const key = interest.trim().toLowerCase();
      personalized.push({
        step: `Explore ${interest} in ${user.track}`,
        type: 'Project'
      });
    });
  }
  return personalized;
}
