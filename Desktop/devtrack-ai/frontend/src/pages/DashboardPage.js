import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { fetchProjects } from '../api/projectApi';
import { fetchAllTasks } from '../api/taskApi';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip
);

const DashboardPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects]   = useState([]);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0, completedTasks: 0,
    pendingTasks: 0, inProgressTasks: 0
  });
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pd, td] = await Promise.all([
          fetchProjects(token), fetchAllTasks(token)
        ]);
        setProjects(pd.projects || []);
        setTaskStats(td.stats || {});
        setTasks(td.tasks || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <Spinner message="Loading dashboard..." />;

  const totalProjects    = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const completionRate   = taskStats.totalTasks > 0
    ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100) : 0;

  // Chart data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };

  const score = user?.productivityScore || 0;
  const trendData = [
    Math.max(0, score - 25), Math.max(0, score - 18),
    Math.max(0, score - 12), Math.max(0, score - 8),
    Math.max(0, score - 4),  Math.max(0, score - 1), score
  ];

  const chartData = {
    labels: getLast7Days(),
    datasets: [{
      label: 'Score',
      data: trendData,
      borderColor: '#2e7d52',
      backgroundColor: 'rgba(46,125,82,0.08)',
      borderWidth: 2.5,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#2e7d52',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#bbb', font: { size: 11 } },
        grid:  { color: '#f0f0ea' }
      },
      y: {
        beginAtZero: true, max: 100,
        ticks: {
          color: '#bbb', font: { size: 11 },
          callback: v => v + '%'
        },
        grid: { color: '#f0f0ea' }
      }
    }
  };

  // Recent tasks — pending ones first
  const recentTasks = tasks
    .filter(t => t.status !== 'Completed')
    .slice(0, 4);

  // Recent activity — last 4 tasks created
  const recentActivity = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <Layout>
      {/* Greeting */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '22px'
      }}>
        <div>
          <h1 style={{
            fontSize: '20px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '3px'
          }}>
            Good afternoon, {user?.name?.split(' ')[0]} 🌿
          </h1>
          <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
            Let's make today productive and meaningful.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '8px', background: '#fff',
          border: '1px solid #e4e4dc',
          borderRadius: '10px', padding: '9px 14px',
          fontSize: '12.5px', color: '#bbb'
        }}>
          🔍 Search projects, tasks…
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <StatCard
          title="Current Streak"
          value={`${user?.currentStreak || 0} days`}
          icon="🔥"
          color="orange"
          subtitle="Keep it up! 🔥"
          progress={Math.min((user?.currentStreak || 0) * 7, 100)}
        />
        <StatCard
          title="Tasks Done"
          value={taskStats.completedTasks}
          icon="✅"
          color="green"
          subtitle={`${completionRate}% of goal`}
          progress={completionRate}
        />
        <StatCard
          title="Projects"
          value={totalProjects}
          icon="📁"
          color="blue"
          subtitle={`${completedProjects} completed`}
          progress={totalProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100) : 0}
        />
        <StatCard
          title="AI Score"
          value={`${score}/100`}
          icon="🤖"
          color="purple"
          subtitle="Go to AI Insights"
          progress={score}
        />
      </div>

      {/* Middle Row — Chart + Todo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '12px',
        marginBottom: '12px'
      }}>

        {/* Line Chart */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <div>
              <h3 style={{
                fontSize: '14px', fontWeight: 800,
                color: '#1a1a1a', margin: '0 0 2px'
              }}>
                Productivity Progress
              </h3>
              <p style={{ fontSize: '11.5px', color: '#bbb', margin: 0 }}>
                This Week
              </p>
            </div>
            <span style={{
              fontSize: '11px', color: '#2e7d52',
              fontWeight: 700,
              background: '#eef6f1',
              padding: '4px 10px',
              borderRadius: '99px'
            }}>
              ↑ {score}% score
            </span>
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Quick Todo */}
        <div className="card" style={{ padding: '18px' }}>
          <h3 style={{
            fontSize: '13.5px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '4px'
          }}>
            Today's Tasks
          </h3>
          <p style={{
            fontSize: '11px', color: '#bbb',
            marginBottom: '14px'
          }}>
            {recentTasks.length} pending tasks
          </p>

          {recentTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#bbb' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
              <p style={{ fontSize: '12px', margin: 0 }}>All tasks done!</p>
            </div>
          ) : (
            recentTasks.map((task, i) => (
              <div key={task._id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 0',
                borderBottom: i < recentTasks.length - 1
                  ? '1px solid #f0f0ea' : 'none'
              }}>
                <div style={{
                  width: '16px', height: '16px',
                  borderRadius: '4px',
                  border: '1.5px solid #ddd',
                  flexShrink: 0, marginTop: '1px'
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '12.5px', fontWeight: 600,
                    color: '#1a1a1a', margin: '0 0 2px'
                  }}>
                    {task.title}
                  </p>
                  <p style={{
                    fontSize: '11px', color: '#bbb', margin: 0
                  }}>
                    {task.project?.title || 'No project'}
                  </p>
                </div>
                <span className={`badge badge-${
                  task.priority === 'High' ? 'red' :
                  task.priority === 'Medium' ? 'orange' : 'green'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))
          )}

          <button
            className="btn-ghost"
            onClick={() => navigate('/tasks')}
            style={{
              width: '100%', marginTop: '12px',
              fontSize: '12px', padding: '8px'
            }}>
            View All Tasks →
          </button>
        </div>
      </div>

      {/* Bottom Row — Projects + Activity + Focus */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        marginBottom: '12px'
      }}>

        {/* Recent Projects */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <h3 style={{
              fontSize: '13.5px', fontWeight: 800,
              color: '#1a1a1a', margin: 0
            }}>
              Recent Projects
            </h3>
            <button
              onClick={() => navigate('/projects')}
              style={{
                background: 'none', border: 'none',
                color: '#2e7d52', fontSize: '11.5px',
                fontWeight: 700, cursor: 'pointer'
              }}>
              View all
            </button>
          </div>

          {projects.slice(0, 3).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#bbb' }}>
              <p style={{ fontSize: '12px', margin: '0 0 8px' }}>No projects yet</p>
              <button
                className="btn-green"
                style={{ fontSize: '11px', padding: '7px 14px' }}
                onClick={() => navigate('/projects')}>
                + Create
              </button>
            </div>
          ) : (
            projects.slice(0, 3).map((p, i) => (
              <div key={p._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom: i < 2 ? '1px solid #f0f0ea' : 'none'
              }}>
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%', flexShrink: 0,
                  background:
                    p.status === 'Completed' ? '#2e7d52' :
                    p.status === 'In Progress' ? '#6b8af7' :
                    p.status === 'On Hold' ? '#f59e0b' : '#bbb'
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '12.5px', fontWeight: 600,
                    color: '#1a1a1a', margin: '0 0 4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {p.title}
                  </p>
                  <div className="prog">
                    <div className="prog-bar" style={{
                      width: `${p.progress || 0}%`,
                      background: '#2e7d52'
                    }} />
                  </div>
                </div>
                <span style={{
                  fontSize: '11px', color: '#9a9a8e',
                  fontWeight: 600, flexShrink: 0
                }}>
                  {p.progress || 0}%
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <h3 style={{
              fontSize: '13.5px', fontWeight: 800,
              color: '#1a1a1a', margin: 0
            }}>
              Recent Activity
            </h3>
            <span style={{
              fontSize: '11.5px', color: '#2e7d52',
              fontWeight: 700
            }}>
              View all
            </span>
          </div>

          {recentActivity.length === 0 ? (
            <p style={{
              textAlign: 'center', color: '#bbb',
              fontSize: '12px', padding: '16px 0'
            }}>
              No activity yet
            </p>
          ) : (
            recentActivity.map((task, i) => (
              <div key={task._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 0',
                borderBottom: i < recentActivity.length - 1
                  ? '1px solid #f0f0ea' : 'none'
              }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: '8px',
                  background: '#f4f4ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px', flexShrink: 0
                }}>
                  {task.status === 'Completed' ? '✅' :
                   task.status === 'In Progress' ? '🔄' : '📝'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '12px', fontWeight: 600,
                    color: '#1a1a1a', margin: '0 0 1px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {task.title}
                  </p>
                  <p style={{
                    fontSize: '10.5px', color: '#bbb', margin: 0
                  }}>
                    {timeAgo(task.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Today's Focus */}
        <div className="card" style={{
          padding: '18px',
          background: '#eef6f1',
          border: '1.5px solid #c8e6d4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌿</div>
          <h3 style={{
            fontSize: '13px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '8px'
          }}>
            Today's Focus
          </h3>
          <p style={{
            fontSize: '12px', color: '#555',
            fontStyle: 'italic', lineHeight: 1.6,
            margin: '0 0 14px'
          }}>
            "Focus on being productive instead of busy."
          </p>
          <div style={{
            background: '#fff', borderRadius: '10px',
            padding: '10px 12px', width: '100%'
          }}>
            <p style={{
              fontSize: '11px', color: '#2e7d52',
              fontWeight: 700, margin: '0 0 2px'
            }}>
              🔥 {user?.currentStreak || 0} Day Streak
            </p>
            <p style={{ fontSize: '10.5px', color: '#9a9a8e', margin: 0 }}>
              Keep it going!
            </p>
          </div>
        </div>

      </div>

      {/* AI Suggestion Bar */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '34px', height: '34px',
          background: '#eef6f1',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px', flexShrink: 0
        }}>
          ✨
        </div>
        <div style={{ flex: 1 }}>
          <span style={{
            fontWeight: 700, color: '#1a1a1a',
            fontSize: '13px'
          }}>
            AI Suggestion
          </span>
          <span style={{ color: '#555', fontSize: '12.5px' }}>
            {' '}— You are most productive in the morning.
            Consider a 90-minute deep work session between 8–10 AM.
          </span>
        </div>
        <button
          className="btn-green"
          style={{ fontSize: '12px', padding: '8px 16px', flexShrink: 0 }}
          onClick={() => navigate('/ai-insights')}>
          View Insights
        </button>
      </div>

    </Layout>
  );
};

export default DashboardPage;