// api/projectApi.js
// All project related API calls.
// We pass the token in every request header
// because all project routes are protected.

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to create auth header
// Instead of writing this object repeatedly,
// we create it once and reuse it everywhere
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// ==================== GET ALL PROJECTS ====================
export const fetchProjects = async (token) => {
  const response = await axios.get(`${API_URL}/projects`, authHeader(token));
  return response.data;
};

// ==================== GET SINGLE PROJECT ====================
export const fetchProject = async (token, projectId) => {
  const response = await axios.get(
    `${API_URL}/projects/${projectId}`,
    authHeader(token)
  );
  return response.data;
};

// ==================== CREATE PROJECT ====================
export const createProject = async (token, projectData) => {
  const response = await axios.post(
    `${API_URL}/projects`,
    projectData,
    authHeader(token)
  );
  return response.data;
};

// ==================== UPDATE PROJECT ====================
export const updateProject = async (token, projectId, projectData) => {
  const response = await axios.put(
    `${API_URL}/projects/${projectId}`,
    projectData,
    authHeader(token)
  );
  return response.data;
};

// ==================== DELETE PROJECT ====================
export const deleteProject = async (token, projectId) => {
  const response = await axios.delete(
    `${API_URL}/projects/${projectId}`,
    authHeader(token)
  );
  return response.data;
};