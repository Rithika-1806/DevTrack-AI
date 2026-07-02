import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updateProfile, updatePassword } from '../api/userApi';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [updating, setUpdating]       = useState(false);
  const [changingPw, setChangingPw]   = useState(false);
  const [activeTab, setActiveTab]     = useState('edit');

  const [profileForm, setProfileForm] = useState({
    name: '', githubUsername: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProfile(token);
        setProfileData(data);
        setProfileForm({
          name: data.user.name || '',
          githubUsername: data.user.githubUsername || ''
        });
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name cannot be empty'); return;
    }
    setUpdating(true);
    try {
      const data = await updateProfile(token, profileForm);
      setProfileData(prev => ({ ...prev, user: data.user }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setUpdating(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Fill in all fields'); return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (newPassword.length < 6) {
      toast.error('Min 6 characters'); return;
    }
    setChangingPw(true);
    try {
      await updatePassword(token, { currentPassword, newPassword });
      toast.success('Password changed!');
      setPasswordForm({
        currentPassword: '', newPassword: '', confirmNewPassword: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setChangingPw(false); }
  };

  if (loading) return <Spinner message="Loading profile..." />;

  const { user: u, stats } = profileData;

  const initials = u.name.split(' ')
    .map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const githubUrl = `https://github.com/${u.githubUsername}`;

  return (
    <Layout>

      {/* Header */}
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{
          fontSize: '20px', fontWeight: 800,
          color: '#1a1a1a', marginBottom: '3px'
        }}>
          Profile 👤
        </h1>
        <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
          Manage your account and preferences
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '16px'
      }}>

        {/* Left — Profile Summary */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '12px'
        }}>

          {/* Avatar Card */}
          <div className="card" style={{
            padding: '24px', textAlign: 'center'
          }}>
            <div style={{
              width: '72px', height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2e7d52, #6abf8a)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              color: '#fff', fontSize: '24px',
              fontWeight: 800, margin: '0 auto 14px'
            }}>
              {initials}
            </div>
            <h3 style={{
              fontSize: '15px', fontWeight: 800,
              color: '#1a1a1a', marginBottom: '4px'
            }}>
              {u.name}
            </h3>
            <p style={{
              fontSize: '12.5px', color: '#9a9a8e',
              marginBottom: '10px'
            }}>
              {u.email}
            </p>
            {u.githubUsername && (
              
               <a href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-green"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  fontSize: '12px',
                  padding: '8px',
                  marginBottom: '10px'
                }}>
                🐙 @{u.githubUsername}
              </a>
            )}
            <p style={{
              fontSize: '11px', color: '#bbb', margin: 0
            }}>
              Member since {new Date(u.createdAt).toLocaleDateString('en-US', {
                month: 'long', year: 'numeric'
              })}
            </p>
          </div>

          {/* Achievements */}
          <div className="card" style={{ padding: '18px' }}>
            <h3 style={{
              fontSize: '13px', fontWeight: 800,
              color: '#1a1a1a', marginBottom: '12px'
            }}>
              🏆 Achievements
            </h3>
            <div style={{
              background: '#fff8ed',
              border: '1.5px solid #fed7aa',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div>
                <p style={{
                  fontWeight: 800, color: '#d97706',
                  fontSize: '16px', margin: '0 0 1px'
                }}>
                  🔥 {u.currentStreak}
                </p>
                <p style={{
                  fontSize: '11px', color: '#9a9a8e', margin: 0
                }}>
                  Day Streak
                </p>
              </div>
              <div style={{ fontSize: '1.8rem' }}>🔥</div>
            </div>
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>
                  Productivity Score
                </span>
                <span style={{
                  fontSize: '12px', fontWeight: 800, color: '#2e7d52'
                }}>
                  {u.productivityScore}/100
                </span>
              </div>
              <div className="prog">
                <div className="prog-bar" style={{
                  width: `${u.productivityScore}%`,
                  background: '#2e7d52'
                }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card" style={{ padding: '18px' }}>
            <h3 style={{
              fontSize: '13px', fontWeight: 800,
              color: '#1a1a1a', marginBottom: '12px'
            }}>
              📊 Your Stats
            </h3>
            {[
              { label: 'Total Projects',    value: stats.totalProjects },
              { label: 'Completed Projects', value: stats.completedProjects },
              { label: 'Total Tasks',       value: stats.totalTasks },
              { label: 'Completed Tasks',   value: stats.completedTasks },
              { label: 'Completion Rate',   value: `${stats.completionRate}%` },
            ].map((s, i) => (
              <div key={s.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 0',
                borderBottom: i < 4 ? '1px solid #f0f0ea' : 'none'
              }}>
                <span style={{ fontSize: '12.5px', color: '#9a9a8e' }}>
                  {s.label}
                </span>
                <span style={{
                  fontSize: '13px', fontWeight: 700,
                  color: '#1a1a1a'
                }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Right — Edit Forms */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '0',
            borderBottom: '1px solid #e4e4dc',
            padding: '0 20px'
          }}>
            {[
              { id: 'edit',     label: '👤 Edit Profile' },
              { id: 'password', label: '🔒 Change Password' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 16px',
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab.id
                    ? '2px solid #2e7d52' : '2px solid transparent',
                  color: activeTab === tab.id ? '#2e7d52' : '#9a9a8e',
                  fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', marginBottom: '-1px',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s'
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>

            {/* Edit Profile */}
            {activeTab === 'edit' && (
              <form onSubmit={handleProfileUpdate}>
                <h3 style={{
                  fontSize: '15px', fontWeight: 800,
                  color: '#1a1a1a', marginBottom: '20px'
                }}>
                  Update Your Information
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '11px',
                    fontWeight: 700, color: '#555',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Full Name
                  </label>
                  <input
                    className="inp"
                    placeholder="Your full name"
                    value={profileForm.name}
                    onChange={e => setProfileForm({
                      ...profileForm, name: e.target.value
                    })}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '11px',
                    fontWeight: 700, color: '#555',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Email Address
                  </label>
                  <input
                    className="inp"
                    value={u.email}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p style={{
                    fontSize: '11px', color: '#bbb',
                    margin: '4px 0 0'
                  }}>
                    Email cannot be changed
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', fontSize: '11px',
                    fontWeight: 700, color: '#555',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    GitHub Username
                  </label>
                  <div style={{
                    display: 'flex',
                    border: '1px solid #e4e4dc',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <span style={{
                      background: '#f8f8f4',
                      padding: '10px 12px',
                      fontSize: '13px', color: '#9a9a8e',
                      borderRight: '1px solid #e4e4dc',
                      flexShrink: 0
                    }}>
                      github.com/
                    </span>
                    <input
                      style={{
                        flex: 1, border: 'none',
                        padding: '10px 12px',
                        fontSize: '13px',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none',
                        background: '#f8f8f4',
                        color: '#1a1a1a'
                      }}
                      placeholder="your-username"
                      value={profileForm.githubUsername}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        githubUsername: e.target.value
                      })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-green"
                  disabled={updating}
                  style={{ padding: '11px 28px' }}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Change Password */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordUpdate}>
                <h3 style={{
                  fontSize: '15px', fontWeight: 800,
                  color: '#1a1a1a', marginBottom: '20px'
                }}>
                  Change Your Password
                </h3>

                {[
                  { label: 'Current Password',  key: 'currentPassword',  ph: 'Enter current password' },
                  { label: 'New Password',       key: 'newPassword',      ph: 'Min 6 characters' },
                  { label: 'Confirm Password',   key: 'confirmNewPassword', ph: 'Re-enter new password' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block', fontSize: '11px',
                      fontWeight: 700, color: '#555',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {f.label}
                    </label>
                    <input
                      type="password"
                      className="inp"
                      placeholder={f.ph}
                      value={passwordForm[f.key]}
                      onChange={e => setPasswordForm({
                        ...passwordForm, [f.key]: e.target.value
                      })}
                    />
                  </div>
                ))}

                <div style={{
                  background: '#eef6f1',
                  border: '1px solid #c8e6d4',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '20px'
                }}>
                  <p style={{
                    fontSize: '12px', color: '#555', margin: 0
                  }}>
                    ✅ Min 6 characters &nbsp;•&nbsp; ✅ Must match confirmation
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-green"
                  disabled={changingPw}
                  style={{ padding: '11px 28px' }}>
                  {changingPw ? 'Updating...' : '🔒 Change Password'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default ProfilePage;