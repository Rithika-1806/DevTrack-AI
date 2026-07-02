// api/userApi.js
// All user profile related API calls.

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchProfile = async (token) => {
  const response = await axios.get(
    `${API_URL}/users/profile`,
    authHeader(token)
  );
  return response.data;
};

export const updateProfile = async (token, data) => {
  const response = await axios.put(
    `${API_URL}/users/profile`,
    data,
    authHeader(token)
  );
  return response.data;
};

export const updatePassword = async (token, data) => {
  const response = await axios.put(
    `${API_URL}/users/password`,
    data,
    authHeader(token)
  );
  return response.data;
};