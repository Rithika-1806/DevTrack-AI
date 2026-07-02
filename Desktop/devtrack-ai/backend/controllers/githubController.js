// controllers/githubController.js
// Handles GitHub data requests.
// Calls githubService and formats the response
// before sending it to the frontend.

const User = require('../models/userModel');
const {
  getUserProfile,
  getUserRepos,
  getLanguageStats,
  getContributionStats
} = require('../services/githubService');

// ==================== GET GITHUB DATA ====================
// @route  GET /api/github/:username
// @access Private

const getGitHubData = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username is required'
      });
    }

    // Fetch profile and repos simultaneously
    const [profile, repos] = await Promise.all([
      getUserProfile(username),
      getUserRepos(username)
    ]);

    // Calculate stats from repos
    const languageStats = await getLanguageStats(repos);
    const contributionStats = getContributionStats(repos);

    // Get recent 6 repos for display
    const recentRepos = repos.slice(0, 6).map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      updatedAt: repo.updated_at
    }));

    // Save github username to user profile
    await User.findByIdAndUpdate(req.user.id, {
      githubUsername: username
    });

    res.status(200).json({
      success: true,
      data: {
        profile: {
          username: profile.login,
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatar_url,
          location: profile.location,
          followers: profile.followers,
          following: profile.following,
          publicRepos: profile.public_repos,
          profileUrl: profile.html_url,
          joinedAt: profile.created_at
        },
        repos: recentRepos,
        totalRepos: repos.length,
        languageStats,
        contributionStats
      }
    });

  } catch (error) {
    // Handle GitHub's specific error responses
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'GitHub user not found. Check the username.'
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'GitHub API rate limit exceeded. Try again later.'
      });
    }

    console.error('GitHub Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GitHub data'
    });
  }
};

module.exports = { getGitHubData };