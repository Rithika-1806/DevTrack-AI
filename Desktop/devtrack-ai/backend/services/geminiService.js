// services/geminiService.js
// Using Groq API — completely FREE, very fast.
// Groq uses Llama 3 model which is excellent for our needs.

const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ==================== BASE FUNCTION ====================
const generateText = async (prompt) => {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',   // ← Updated model name
    temperature: 0.7
  });
  return completion.choices[0].message.content;
};

// ==================== TASK SUGGESTIONS ====================
const generateTaskSuggestions = async (projectTitle, completedTasks) => {
  const completedList = completedTasks.length > 0
    ? completedTasks.join(', ')
    : 'No tasks completed yet';

  const prompt = `
You are a senior software engineer helping a developer plan their project.

Project: "${projectTitle}"
Completed tasks: ${completedList}

Suggest the next 5 most important tasks.

Return ONLY valid JSON, no extra text, no markdown, no code blocks:
{"suggestions":[{"title":"Task title","reason":"Why important","priority":"High","estimatedHours":3}]}
`;

  const text = await generateText(prompt);
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ==================== PRODUCTIVITY ADVICE ====================
const generateProductivityAdvice = async (stats) => {
  const prompt = `
You are a productivity coach for software developers.

Developer stats:
- Total Projects: ${stats.totalProjects}
- Completed Projects: ${stats.completedProjects}
- Total Tasks: ${stats.totalTasks}
- Completed Tasks: ${stats.completedTasks}
- Pending Tasks: ${stats.pendingTasks}
- In Progress: ${stats.inProgressTasks}
- Current Streak: ${stats.currentStreak} days

Return ONLY valid JSON, no extra text, no markdown, no code blocks:
{"overallScore":85,"scoreLabel":"Good","summary":"Your summary here","strengths":["strength1","strength2"],"improvements":["area1","area2"],"tips":["tip1","tip2","tip3"],"weeklyGoal":"Your goal here"}
`;

  const text = await generateText(prompt);
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ==================== PROJECT HEALTH ====================
const generateProjectHealth = async (projects) => {
  const projectSummary = projects.map(p => ({
    title: p.title,
    status: p.status,
    progress: p.progress || 0,
    totalTasks: p.totalTasks || 0,
    completedTasks: p.completedTasks || 0,
    priority: p.priority
  }));

  const prompt = `
You are a project manager reviewing a developer's projects.

Projects: ${JSON.stringify(projectSummary)}

Return ONLY valid JSON, no extra text, no markdown, no code blocks:
{"projectHealths":[{"title":"Project name","health":"Good","healthScore":85,"analysis":"Brief analysis","recommendation":"Next step"}],"overallInsight":"Overall observation","priorityProject":"Which needs attention and why"}
`;

  const text = await generateText(prompt);
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ==================== WEEKLY SUMMARY ====================
const generateWeeklySummary = async (data) => {
  const prompt = `
Write a weekly productivity report for a software developer.

Stats:
- Projects: ${data.totalProjects}
- Tasks completed: ${data.completedTasks}
- Tasks pending: ${data.pendingTasks}
- Current streak: ${data.currentStreak} days

Return ONLY valid JSON, no extra text, no markdown, no code blocks:
{"greeting":"Opening line","weekHighlight":"Best achievement","summary":"2-3 sentence summary","productivityRating":"4 out of 5 stars","nextWeekFocus":"Focus area","motivationalQuote":"Inspiring quote for developers"}
`;

  const text = await generateText(prompt);
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ==================== SKILL SUGGESTIONS ====================
const generateSkillSuggestions = async (languages, projectTitles) => {
  const prompt = `
You are a senior developer advising a CS student preparing for placements.

Their tech stack:
Languages: ${languages.join(', ') || 'Not specified'}
Projects: ${projectTitles.join(', ') || 'Not specified'}

Return ONLY valid JSON, no extra text, no markdown, no code blocks:
{"currentStrength":"Assessment of skills","skillsToLearn":[{"skill":"Skill name","reason":"Why this helps placements","resources":"Where to learn","timeToLearn":"How long"}],"placementTips":["tip1","tip2","tip3"],"roadmap":"3 month learning plan"}
`;

  const text = await generateText(prompt);
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = {
  generateTaskSuggestions,
  generateProductivityAdvice,
  generateProjectHealth,
  generateWeeklySummary,
  generateSkillSuggestions
};