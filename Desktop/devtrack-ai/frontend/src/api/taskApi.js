// api/taskApi.js
// All task related API calls.

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// ==================== GET ALL USER TASKS ====================
export const fetchAllTasks = async (token) => {
  const response = await axios.get(`${API_URL}/tasks`, authHeader(token));
  return response.data;
};

// ==================== GET TASKS BY PROJECT ====================
export const fetchTasksByProject = async (token, projectId) => {
  const response = await axios.get(
    `${API_URL}/tasks/project/${projectId}`,
    authHeader(token)
  );
  return response.data;
};

// ==================== CREATE TASK ====================
export const createTask = async (token, taskData) => {
  const response = await axios.post(
    `${API_URL}/tasks`,
    taskData,
    authHeader(token)
  );
  return response.data;
};

// ==================== UPDATE TASK ====================
export const updateTask = async (token, taskId, taskData) => {
  const response = await axios.put(
    `${API_URL}/tasks/${taskId}`,
    taskData,
    authHeader(token)
  );
  return response.data;
};

// ==================== DELETE TASK ====================
export const deleteTask = async (token, taskId) => {
  const response = await axios.delete(
    `${API_URL}/tasks/${taskId}`,
    authHeader(token)
  );
  return response.data;
};