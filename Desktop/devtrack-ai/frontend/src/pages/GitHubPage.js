import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { fetchGitHubData } from '../api/githubApi';
import { toast } from 'react-toastify';

const languageColors = {
  JavaScript: '#f7df1e', Python: '#3572A5',
  Java: '#b07219', TypeScript: '#2b7489',
  HTML: '#e34c26', CSS: '#563d7c',
  'C++': '#f34b7d', C: '#555555',
  Ruby: '#701516', Go: '#00ADD8',
  Default: '#9a9a8e'
};

const GitHubPage = () => {
  const { token, user } = useAuth();
  const [username, setUsername] = useState(user?.githubUsername || '');
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!username.trim()) { toast.error('Enter a username'); return; }
    setLoading(true);
    try {
      const res = await fetchGitHubData(token, username.trim());
      setData(res.data);
      toast.success('GitHub data loaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch');
    } finally { setLoading(false); }
  };

  const statItems = data ? [
    { label: 'Public Repos', value: data.profile.publicRepos, icon: '📁', color: 'blue' },
    { label: 'Followers',    value: data.profile.followers,   icon: '👥', color: 'green' },
    { label: 'Following',    value: data.profile.following,   icon: '➡️', color: 'orange' },
    { label: 'Total Stars',  value: data.contributionStats.totalStars, icon: '⭐', color: 'orange' },
    { label: 'Total Forks',  value: data.contributionStats.totalForks, icon: '🍴', color: 'purple' },
    { label: 'Languages',    value: Object.keys(data.languageStats).length, icon: '💻', color: 'blue' },
  ] : [];

  return (
    <Layout>

      {/* Header */}
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{
          fontSize: '20px', fontWeight: 800,
          color: '#1a1a1a', marginBottom: '3px'
        }}>
          GitHub Integration 🐙
        </h1>
        <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
          Connect your GitHub to see your repositories and stats
        </p>
      </div>

      {/* Search Card */}
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <form onSubmit={handleFetch} style={{
          display: 'flex', gap: '10px', alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block', fontSize: '11px',
              fontWeight: 700, color: '#555',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              GitHub Username
            </label>
            <input
              className="inp"
              placeholder="e.g. Rithika-1806"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-green"
            disabled={loading}
            style={{ padding: '10px 20px', flexShrink: 0 }}>
            {loading ? 'Loading...' : '🔍 Fetch Data'}
          </button>
        </form>
      </div>

      {/* GitHub Data */}
      {data && (
        <>
          {/* Profile + Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: '14px', marginBottom: '14px'
          }}>

            {/* Profile Card */}
            <div className="card" style={{
              padding: '24px', textAlign: 'center'
            }}>
              <img
                src={data.profile.avatar}
                alt="avatar"
                style={{
                  width: '72px', height: '72px',
                  borderRadius: '50%', marginBottom: '12px',
                  border: '3px solid #eef6f1'
                }}
              />
              <h3 style={{
                fontSize: '14px', fontWeight: 800,
                color: '#1a1a1a', marginBottom: '3px'
              }}>
                {data.profile.name || data.profile.username}
              </h3>
              <p style={{
                fontSize: '12px', color: '#9a9a8e',
                marginBottom: '4px'
              }}>
                @{data.profile.username}
              </p>
              {data.profile.bio && (
                <p style={{
                  fontSize: '12px', color: '#555',
                  marginBottom: '8px', lineHeight: 1.5
                }}>
                  {data.profile.bio}
                </p>
              )}
              {data.profile.location && (
                <p style={{
                  fontSize: '12px', color: '#9a9a8e',
                  marginBottom: '14px'
                }}>
                  📍 {data.profile.location}
                </p>
              )}
              
                <a href={data.profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-green"
                style={{
                  display: 'block', textAlign: 'center',
                  textDecoration: 'none', fontSize: '12px',
                  padding: '8px'
                }}>
                View on GitHub
              </a>
              <p style={{
                fontSize: '11px', color: '#bbb',
                marginTop: '10px'
              }}>
                Joined {new Date(data.profile.joinedAt)
                  .toLocaleDateString('en-US', {
                    month: 'long', year: 'numeric'
                  })}
              </p>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              {statItems.map(s => (
                <div key={s.label} className="card" style={{
                  padding: '16px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                    {s.icon}
                  </div>
                  <div style={{
                    fontSize: '22px', fontWeight: 900,
                    color: '#1a1a1a', marginBottom: '2px'
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9a9a8e' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages + Most Starred */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px', marginBottom: '14px'
          }}>

            {/* Language Stats */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: '13.5px', fontWeight: 800,
                color: '#1a1a1a', marginBottom: '14px'
              }}>
                💻 Top Languages
              </h3>
              {Object.entries(data.languageStats).map(([lang, count]) => {
                const total = Object.values(data.languageStats)
                  .reduce((a, b) => a + b, 0);
                const pct = Math.round((count / total) * 100);
                const color = languageColors[lang] || languageColors.Default;
                return (
                  <div key={lang} style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '7px'
                      }}>
                        <div style={{
                          width: '9px', height: '9px',
                          borderRadius: '50%',
                          background: color
                        }} />
                        <span style={{
                          fontSize: '12.5px', fontWeight: 600,
                          color: '#1a1a1a'
                        }}>
                          {lang}
                        </span>
                      </div>
                      <span style={{ fontSize: '11.5px', color: '#9a9a8e' }}>
                        {count} repos ({pct}%)
                      </span>
                    </div>
                    <div className="prog">
                      <div className="prog-bar" style={{
                        width: `${pct}%`, background: color
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Most Starred */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: '13.5px', fontWeight: 800,
                color: '#1a1a1a', marginBottom: '14px'
              }}>
                ⭐ Most Starred Repo
              </h3>
              {data.contributionStats.mostStarred ? (
                <div style={{
                  background: '#eef6f1',
                  border: '1.5px solid #c8e6d4',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <h4 style={{
                    fontSize: '13.5px', fontWeight: 800,
                    color: '#2e7d52', marginBottom: '6px'
                  }}>
                    {data.contributionStats.mostStarred.name}
                  </h4>
                  <p style={{
                    fontSize: '12px', color: '#555',
                    marginBottom: '10px', lineHeight: 1.5
                  }}>
                    {data.contributionStats.mostStarred.description
                      || 'No description'}
                  </p>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span style={{ fontSize: '12px', color: '#9a9a8e' }}>
                      ⭐ {data.contributionStats.mostStarred.stargazers_count}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9a9a8e' }}>
                      🍴 {data.contributionStats.mostStarred.forks_count}
                    </span>
                    {data.contributionStats.mostStarred.language && (
                      <span style={{ fontSize: '12px', color: '#9a9a8e' }}>
                        💻 {data.contributionStats.mostStarred.language}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#9a9a8e', fontSize: '13px' }}>
                  No repositories found
                </p>
              )}
            </div>
          </div>

          {/* Recent Repos */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '13.5px', fontWeight: 800,
              color: '#1a1a1a', marginBottom: '16px'
            }}>
              📂 Recent Repositories ({data.totalRepos} total)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '10px'
            }}>
              {data.repos.map(repo => (
                <div key={repo.id} style={{
                  background: '#f8f8f4',
                  border: '1px solid #e4e4dc',
                  borderRadius: '10px',
                  padding: '14px',
                  transition: 'all 0.2s'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px'
                  }}>
                    
                      <a href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '13px', fontWeight: 700,
                        color: '#2e7d52',
                        textDecoration: 'none'
                      }}>
                      {repo.name}
                    </a>
                    <span style={{
                      fontSize: '11px', color: '#9a9a8e'
                    }}>
                      ⭐ {repo.stars}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '11.5px', color: '#9a9a8e',
                    marginBottom: '8px', lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {repo.description || 'No description'}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    {repo.language && (
                      <span style={{
                        display: 'flex', alignItems: 'center',
                        gap: '5px', fontSize: '11.5px',
                        color: '#9a9a8e'
                      }}>
                        <span style={{
                          width: '8px', height: '8px',
                          borderRadius: '50%',
                          background: languageColors[repo.language]
                            || languageColors.Default
                        }} />
                        {repo.language}
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: '#bbb' }}>
                      🍴 {repo.forks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </Layout>
  );
};

export default GitHubPage;