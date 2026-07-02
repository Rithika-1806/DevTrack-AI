// services/githubService.js
// This file handles ALL communication with the GitHub REST API.
//
// Why a separate services folder?
// Controllers should only handle request/response logic.
// Actual external API calls belong in services.
// This separation means if GitHub changes their API,
// we only update this one file — not every controller.
//
// GitHub REST API is FREE for public data.
// No API key needed for basic usage.
// Rate limit: 60 requests/hour without auth,
//             5000 requests/hour with a GitHub token.

const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

// Common headers for GitHub API requests
// Adding Accept header ensures we get the latest API version
const githubHeaders = {
  'Accept': 'application/vnd.github.v3+json',
  // If you have a GitHub token, add it here for higher rate limits:
  // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
};

// ==================== GET USER PROFILE ====================
// Fetches basic GitHub profile info
// Example: https://api.github.com/users/Rithika-1806

const getUserProfile = async (username) => {
  const response = await axios.get(
    `${GITHUB_API}/users/${username}`,
    { headers: githubHeaders }
  );
  return response.data;
};

// ==================== GET USER REPOSITORIES ====================
// Fetches all public repositories of a user
// Sorted by last updated, max 100 repos

const getUserRepos = async (username) => {
  const response = await axios.get(
    `${GITHUB_API}/users/${username}/repos`,
    {
      headers: githubHeaders,
      params: {
        sort: 'updated',   // Sort by recently updated
        per_page: 100      // Get up to 100 repos
      }
    }
  );
  return response.data;
};

// ==================== GET LANGUAGE STATS ====================
// GitHub gives us languages per repo like:
// { "JavaScript": 12400, "CSS": 3200 }
// We sum up across all repos to get total language usage

const getLanguageStats = async (repos) => {
  // Filter repos that have a language
  const reposWithLanguage = repos.filter(repo => repo.language);

  // Count how many repos use each language
  const languageCount = {};

  reposWithLanguage.forEach(repo => {
    const lang = repo.language;
    languageCount[lang] = (languageCount[lang] || 0) + 1;
  });

  // Sort by most used and return top 6
  const sorted = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return Object.fromEntries(sorted);
};

// ==================== GET CONTRIBUTION STATS ====================
// Calculates stats from repos:
// total stars, total forks, most starred repo

const getContributionStats = (repos) => {
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count, 0
  );
  const totalForks = repos.reduce(
    (sum, repo) => sum + repo.forks_count, 0
  );

  // Find the most starred repo
  const mostStarred = repos.reduce(
    (max, repo) => repo.stargazers_count > (max?.stargazers_count || 0)
      ? repo : max,
    null
  );

  return { totalStars, totalForks, mostStarred };
};

module.exports = {
  getUserProfile,
  getUserRepos,
  getLanguageStats,
  getContributionStats
};