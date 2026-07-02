// api/aiApi.js
// All AI related API calls to our backend.

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchProductivityAdvice = async (token) => {
  const response = await axios.get(
    `${API_URL}/ai/productivity`,
    authHeader(token)
  );
  return response.data;
};

export const fetchProjectHealth = async (token) => {
  const response = await axios.get(
    `${API_URL}/ai/project-health`,
    authHeader(token)
  );
  return response.data;
};

export const fetchWeeklySummary = async (token) => {
  const response = await axios.get(
    `${API_URL}/ai/weekly-summary`,
    authHeader(token)
  );
  return response.data;
};

export const fetchTaskSuggestions = async (token, projectId) => {
  const response = await axios.post(
    `${API_URL}/ai/task-suggestions`,
    { projectId },
    authHeader(token)
  );
  return response.data;
};

export const fetchSkillSuggestions = async (token, languages, projectTitles) => {
  const response = await axios.post(
    `${API_URL}/ai/skills`,
    { languages, projectTitles },
    authHeader(token)
  );
  return response.data;
};