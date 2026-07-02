// api/githubApi.js
// Calls our backend GitHub endpoint.
// We go through OUR backend, not GitHub directly,
// because we need to verify the user is logged in.

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchGitHubData = async (token, username) => {
  const response = await axios.get(
    `${API_URL}/github/${username}`,
    authHeader(token)
  );
  return response.data;
};