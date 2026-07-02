import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  fetchProductivityAdvice, fetchProjectHealth,
  fetchWeeklySummary, fetchTaskSuggestions
} from '../api/aiApi';
import { fetchProjects } from '../api/projectApi';
import { toast } from 'react-toastify';

// ===== LOADING STATE =====
const LoadingCard = ({ message }) => (
  <div style={{
    background: '#fff', borderRadius: '12px',
    padding: '48px', textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  }}>
    <div style={{
      width: '36px', height: '36px',
      border: '3px solid #e4e4dc',
      borderTop: '3px solid #2e7d52',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      margin: '0 auto 14px'
    }} />
    <p style={{ color: '#9a9a8e', fontSize: '13px', margin: '0 0 4px' }}>
      {message}
    </p>
    <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>
      AI is thinking… this may take a few seconds
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ===== GENERATE BUTTON =====
const GenerateBtn = ({ onClick, label, icon }) => (
  <div style={{
    background: '#fff', borderRadius: '16px',
    padding: '48px', textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
    <h3 style={{
      fontSize: '15px', fontWeight: 800,
      color: '#1a1a1a', marginBottom: '6px'
    }}>
      {label}
    </h3>
    <p style={{
      color: '#9a9a8e', fontSize: '13px',
      marginBottom: '20px'
    }}>
      Click below to generate AI-powered insights
    </p>
    <button className="btn-green" onClick={onClick}>
      ✨ Generate
    </button>
  </div>
);

// ===== PRODUCTIVITY TAB =====
const ProductivityTab = ({ token }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetchProductivityAdvice(token);
      setData(res);
    } catch { toast.error('Failed to generate. Try again.'); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingCard message="Analyzing your productivity..." />;
  if (!data) return (
    <GenerateBtn onClick={generate} label="Productivity Analysis" icon="📊" />
  );

  const { advice } = data;
  const scoreColor =
    advice.overallScore >= 70 ? '#2e7d52' :
    advice.overallScore >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Score Card */}
      <div style={{
        background: '#eef6f1',
        border: '1.5px solid #c8e6d4',
        borderRadius: '16px',
        padding: '28px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '4rem', fontWeight: 900,
          color: scoreColor, lineHeight: 1,
          marginBottom: '4px'
        }}>
          {advice.overallScore}
        </div>
        <div style={{ color: '#9a9a8e', fontSize: '12px', marginBottom: '8px' }}>
          out of 100
        </div>
        <span className="badge badge-green" style={{ fontSize: '13px' }}>
          {advice.scoreLabel}
        </span>
        <p style={{
          color: '#555', fontSize: '13px',
          margin: '14px 0 0', lineHeight: 1.6
        }}>
          {advice.summary}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

        {/* Strengths */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{
            fontSize: '13.5px', fontWeight: 800,
            color: '#2e7d52', marginBottom: '12px'
          }}>
            ✅ Strengths
          </h3>
          {advice.strengths?.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: '8px',
              marginBottom: '8px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#2e7d52',
                flexShrink: 0, marginTop: '5px'
              }} />
              <p style={{
                fontSize: '12.5px', color: '#333',
                margin: 0, lineHeight: 1.5
              }}>
                {s}
              </p>
            </div>
          ))}
        </div>

        {/* Improvements */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{
            fontSize: '13.5px', fontWeight: 800,
            color: '#d97706', marginBottom: '12px'
          }}>
            ⚠️ Improve
          </h3>
          {advice.improvements?.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '8px',
              marginBottom: '8px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#f59e0b',
                flexShrink: 0, marginTop: '5px'
              }} />
              <p style={{
                fontSize: '12.5px', color: '#333',
                margin: 0, lineHeight: 1.5
              }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '13.5px', fontWeight: 800,
          color: '#1a1a1a', marginBottom: '12px'
        }}>
          💡 Actionable Tips
        </h3>
        {advice.tips?.map((tip, i) => (
          <div key={i} style={{
            display: 'flex', gap: '12px',
            marginBottom: '10px',
            background: '#f8f8f4',
            borderRadius: '8px',
            padding: '10px 12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '22px', height: '22px',
              borderRadius: '6px',
              background: '#2e7d52',
              color: '#fff', fontSize: '11px',
              fontWeight: 700,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              {i + 1}
            </div>
            <p style={{
              fontSize: '12.5px', color: '#333',
              margin: 0, lineHeight: 1.5
            }}>
              {tip}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly Goal */}
      <div style={{
        background: '#eef6f1',
        border: '1.5px solid #c8e6d4',
        borderRadius: '12px', padding: '16px'
      }}>
        <h3 style={{
          fontSize: '13px', fontWeight: 800,
          color: '#2e7d52', marginBottom: '6px'
        }}>
          🎯 This Week's Goal
        </h3>
        <p style={{
          fontSize: '13px', color: '#555', margin: 0
        }}>
          {advice.weeklyGoal}
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button className="btn-ghost"
          style={{ fontSize: '12px' }}
          onClick={generate}>
          🔄 Regenerate
        </button>
      </div>
    </div>
  );
};

// ===== PROJECT HEALTH TAB =====
const ProjectHealthTab = ({ token }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetchProjectHealth(token);
      setData(res);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate');
    } finally { setLoading(false); }
  };

  if (loading) return <LoadingCard message="Analyzing project health..." />;
  if (!data) return (
    <GenerateBtn onClick={generate} label="Project Health Analysis" icon="🏥" />
  );

  const { health } = data;
  const healthColor = h =>
    h === 'Good' ? '#2e7d52' :
    h === 'Warning' ? '#f59e0b' : '#ef4444';
  const healthBadge = h =>
    h === 'Good' ? 'badge-green' :
    h === 'Warning' ? 'badge-orange' : 'badge-red';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <div style={{
        background: '#eef6f1',
        border: '1.5px solid #c8e6d4',
        borderRadius: '12px', padding: '16px'
      }}>
        <h3 style={{
          fontSize: '13px', fontWeight: 800,
          color: '#2e7d52', marginBottom: '6px'
        }}>
          🔍 Overall Insight
        </h3>
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
          {health.overallInsight}
        </p>
      </div>

      <div style={{
        background: '#fff8ed',
        border: '1.5px solid #fed7aa',
        borderRadius: '12px', padding: '16px'
      }}>
        <h3 style={{
          fontSize: '13px', fontWeight: 800,
          color: '#d97706', marginBottom: '6px'
        }}>
          ⚡ Needs Attention
        </h3>
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
          {health.priorityProject}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '12px'
      }}>
        {health.projectHealths?.map((p, i) => (
          <div key={i} className="card" style={{
            padding: '18px',
            borderLeft: `4px solid ${healthColor(p.health)}`
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '10px'
            }}>
              <h4 style={{
                fontSize: '13.5px', fontWeight: 800,
                color: '#1a1a1a', margin: 0
              }}>
                {p.title}
              </h4>
              <span className={`badge ${healthBadge(p.health)}`}>
                {p.health}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <span style={{ fontSize: '11px', color: '#9a9a8e' }}>
                  Health Score
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: healthColor(p.health)
                }}>
                  {p.healthScore}%
                </span>
              </div>
              <div className="prog">
                <div className="prog-bar" style={{
                  width: `${p.healthScore}%`,
                  background: healthColor(p.health)
                }} />
              </div>
            </div>
            <p style={{
              fontSize: '12px', color: '#555',
              marginBottom: '8px', lineHeight: 1.5
            }}>
              {p.analysis}
            </p>
            <div style={{
              background: '#f8f8f4', borderRadius: '7px',
              padding: '8px 10px'
            }}>
              <p style={{
                fontSize: '11.5px', color: '#555', margin: 0
              }}>
                💡 {p.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'right' }}>
        <button className="btn-ghost"
          style={{ fontSize: '12px' }}
          onClick={generate}>
          🔄 Regenerate
        </button>
      </div>
    </div>
  );
};

// ===== WEEKLY SUMMARY TAB =====
const WeeklySummaryTab = ({ token }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetchWeeklySummary(token);
      setData(res);
    } catch { toast.error('Failed to generate'); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingCard message="Generating your weekly summary..." />;
  if (!data) return (
    <GenerateBtn onClick={generate} label="Weekly Summary" icon="📋" />
  );

  const { summary } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <div style={{
        background: '#eef6f1',
        border: '1.5px solid #c8e6d4',
        borderRadius: '16px', padding: '24px'
      }}>
        <h2 style={{
          fontSize: '16px', fontWeight: 800,
          color: '#2e7d52', marginBottom: '6px'
        }}>
          {summary.greeting}
        </h2>
        <p style={{
          fontSize: '13px', color: '#555',
          margin: 0, lineHeight: 1.6
        }}>
          {summary.summary}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{
            fontSize: '13px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '8px'
          }}>
            🏆 Week Highlight
          </h3>
          <p style={{
            fontSize: '13px', color: '#555',
            margin: 0, lineHeight: 1.5
          }}>
            {summary.weekHighlight}
          </p>
        </div>
        <div className="card" style={{
          padding: '20px', textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '13px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '10px'
          }}>
            Productivity Rating
          </h3>
          <div style={{ fontSize: '1.8rem' }}>
            {summary.productivityRating}
          </div>
        </div>
      </div>

      <div style={{
        background: '#fff8ed',
        border: '1.5px solid #fed7aa',
        borderRadius: '12px', padding: '16px'
      }}>
        <h3 style={{
          fontSize: '13px', fontWeight: 800,
          color: '#d97706', marginBottom: '6px'
        }}>
          🎯 Next Week Focus
        </h3>
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
          {summary.nextWeekFocus}
        </p>
      </div>

      <div className="card" style={{
        padding: '20px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💬</div>
        <p style={{
          fontStyle: 'italic', color: '#555',
          fontSize: '13.5px', fontWeight: 500,
          margin: 0, lineHeight: 1.6
        }}>
          "{summary.motivationalQuote}"
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button className="btn-ghost"
          style={{ fontSize: '12px' }}
          onClick={generate}>
          🔄 Regenerate
        </button>
      </div>
    </div>
  );
};

// ===== TASK SUGGESTIONS TAB =====
const TaskSuggestionsTab = ({ token }) => {
  const [projects, setProjects]         = useState([]);
  const [selectedProject, setSelected] = useState('');
  const [data, setData]                 = useState(null);
  const [loading, setLoading]           = useState(false);
  const [loadingProjects, setLP]        = useState(true);

  React.useEffect(() => {
    fetchProjects(token)
      .then(r => setProjects(r.projects || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLP(false));
  }, [token]);

  const generate = async () => {
    if (!selectedProject) { toast.error('Select a project'); return; }
    setLoading(true);
    try {
      const res = await fetchTaskSuggestions(token, selectedProject);
      setData(res);
    } catch { toast.error('Failed to generate suggestions'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '13.5px', fontWeight: 800,
          color: '#1a1a1a', marginBottom: '12px'
        }}>
          🎯 Select a Project
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="sel"
            value={selectedProject}
            onChange={e => { setSelected(e.target.value); setData(null); }}
            disabled={loadingProjects}>
            <option value="">
              {loadingProjects ? 'Loading...' : 'Select project'}
            </option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.title}</option>
            ))}
          </select>
          <button
            className="btn-green"
            onClick={generate}
            disabled={!selectedProject || loading}
            style={{ flexShrink: 0 }}>
            {loading ? 'Generating...' : '✨ Suggest Tasks'}
          </button>
        </div>
      </div>

      {loading && <LoadingCard message="Generating task suggestions..." />}

      {data && (
        <div>
          <h3 style={{
            fontSize: '14px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '12px'
          }}>
            💡 Suggested Tasks for "{data.projectTitle}"
          </h3>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            {data.suggestions?.suggestions?.map((s, i) => (
              <div key={i} className="card" style={{ padding: '16px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '6px'
                }}>
                  <h4 style={{
                    fontSize: '13.5px', fontWeight: 800,
                    color: '#1a1a1a', margin: 0
                  }}>
                    {i + 1}. {s.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className={`badge badge-${
                      s.priority === 'High'   ? 'red' :
                      s.priority === 'Medium' ? 'orange' : 'green'
                    }`}>
                      {s.priority}
                    </span>
                    <span className="badge badge-blue">
                      ⏱ {s.estimatedHours}h
                    </span>
                  </div>
                </div>
                <p style={{
                  fontSize: '12.5px', color: '#555',
                  margin: 0, lineHeight: 1.5
                }}>
                  {s.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MAIN PAGE =====
const AIInsightsPage = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('productivity');

  const tabs = [
    { id: 'productivity', label: '📊 Productivity' },
    { id: 'health',       label: '🏥 Project Health' },
    { id: 'summary',      label: '📋 Weekly Summary' },
    { id: 'tasks',        label: '💡 Task Suggestions' },
  ];

  return (
    <Layout>

      {/* Header */}
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{
          fontSize: '20px', fontWeight: 800,
          color: '#1a1a1a', marginBottom: '3px'
        }}>
          AI Insights ✨
        </h1>
        <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
          Powered by Groq AI — personalized insights for your developer journey
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '6px',
        marginBottom: '18px',
        borderBottom: '1px solid #e4e4dc',
        paddingBottom: '0'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id
                ? '2px solid #2e7d52' : '2px solid transparent',
              color: activeTab === tab.id ? '#2e7d52' : '#9a9a8e',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              marginBottom: '-1px',
              fontFamily: 'Inter, sans-serif'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'productivity' && <ProductivityTab token={token} />}
      {activeTab === 'health'       && <ProjectHealthTab token={token} />}
      {activeTab === 'summary'      && <WeeklySummaryTab token={token} />}
      {activeTab === 'tasks'        && <TaskSuggestionsTab token={token} />}

    </Layout>
  );
};

export default AIInsightsPage;