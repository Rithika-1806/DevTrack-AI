import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllTasks, createTask,
  updateTask, deleteTask
} from '../api/taskApi';
import { fetchProjects } from '../api/projectApi';
import { toast } from 'react-toastify';

const TasksPage = () => {
  const { token } = useAuth();
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTask, setNewTask]   = useState({
    title: '', description: '',
    priority: 'Medium', projectId: '',
    estimatedHours: '', deadline: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [td, pd] = await Promise.all([
        fetchAllTasks(token), fetchProjects(token)
      ]);
      setTasks(td.tasks || []);
      setProjects(pd.projects || []);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.projectId) {
      toast.error('Title and project are required'); return;
    }
    setCreating(true);
    try {
      const data = await createTask(token, newTask);
      setTasks([data.task, ...tasks]);
      setShowForm(false);
      setNewTask({
        title: '', description: '',
        priority: 'Medium', projectId: '',
        estimatedHours: '', deadline: ''
      });
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally { setCreating(false); }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const data = await updateTask(token, task._id, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? data.task : t));
      toast.success(`Task marked ${newStatus}`);
    } catch { toast.error('Failed to update task'); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const data = await updateTask(token, taskId, { status });
      setTasks(tasks.map(t => t._id === taskId ? data.task : t));
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(token, id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'All'
    ? tasks : tasks.filter(t => t.status === filter);

  const priorityBadge = p =>
    p === 'High'   ? 'badge-red' :
    p === 'Medium' ? 'badge-orange' : 'badge-green';

  if (loading) return <Spinner message="Loading tasks..." />;

  const counts = {
    All: tasks.length,
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length
  };

  return (
    <Layout>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '22px'
      }}>
        <div>
          <h1 style={{
            fontSize: '20px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '3px'
          }}>
            Tasks ✅
          </h1>
          <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
            {tasks.length} tasks total
          </p>
        </div>
        <button
          className="btn-green"
          onClick={() => setShowForm(!showForm)}>
          + New Task
        </button>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className="card" style={{
          padding: '20px', marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '14px', fontWeight: 800,
            color: '#1a1a1a', marginBottom: '16px'
          }}>
            Create New Task
          </h3>
          <form onSubmit={handleCreate}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px', marginBottom: '12px'
            }}>
              <div>
                <label style={{
                  display: 'block', fontSize: '11px',
                  fontWeight: 700, color: '#555',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Task Title *
                </label>
                <input
                  className="inp"
                  placeholder="e.g. Build Login Page"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: '11px',
                  fontWeight: 700, color: '#555',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Project *
                </label>
                <select
                  className="sel"
                  value={newTask.projectId}
                  onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}>
                  <option value="">Select project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: '11px',
                  fontWeight: 700, color: '#555',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Priority
                </label>
                <select
                  className="sel"
                  value={newTask.priority}
                  onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: '11px',
                  fontWeight: 700, color: '#555',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Deadline
                </label>
                <input
                  type="date" className="inp"
                  value={newTask.deadline}
                  onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block', fontSize: '11px',
                fontWeight: 700, color: '#555',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Description
              </label>
              <textarea
                className="inp"
                placeholder="Task description (optional)"
                rows="2"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="btn-green"
                disabled={creating}>
                {creating ? 'Creating...' : '+ Create Task'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '6px',
        marginBottom: '16px'
      }}>
        {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 14px',
              borderRadius: '99px',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: filter === f ? '#2e7d52' : '#fff',
              color: filter === f ? '#fff' : '#9a9a8e',
              boxShadow: filter === f
                ? '0 2px 8px rgba(46,125,82,0.25)'
                : '0 1px 3px rgba(0,0,0,0.06)'
            }}>
            {f}
            <span style={{
              marginLeft: '6px',
              background: filter === f
                ? 'rgba(255,255,255,0.2)'
                : '#f0f0ea',
              color: filter === f ? '#fff' : '#9a9a8e',
              borderRadius: '99px',
              padding: '1px 7px',
              fontSize: '11px'
            }}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '60px 20px', textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
          <h3 style={{
            fontSize: '15px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '6px'
          }}>
            No tasks found
          </h3>
          <p style={{
            color: '#9a9a8e', fontSize: '13px',
            marginBottom: '20px'
          }}>
            {filter === 'All'
              ? 'Create your first task to get started'
              : `No ${filter} tasks`}
          </p>
          {filter === 'All' && (
            <button
              className="btn-green"
              onClick={() => setShowForm(true)}>
              + Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {filtered.map((task, i) => (
            <div
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                borderBottom: i < filtered.length - 1
                  ? '1px solid #f0f0ea' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf7'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

              {/* Checkbox */}
              <div
                onClick={() => handleStatusToggle(task)}
                style={{
                  width: '18px', height: '18px',
                  borderRadius: '5px',
                  border: task.status === 'Completed'
                    ? '2px solid #2e7d52'
                    : '2px solid #ddd',
                  background: task.status === 'Completed'
                    ? '#2e7d52' : 'transparent',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.2s'
                }}>
                {task.status === 'Completed' && (
                  <span style={{ color: '#fff', fontSize: '11px' }}>✓</span>
                )}
              </div>

              {/* Task info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '13.5px', fontWeight: 600,
                  color: task.status === 'Completed' ? '#bbb' : '#1a1a1a',
                  textDecoration: task.status === 'Completed'
                    ? 'line-through' : 'none',
                  margin: '0 0 3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {task.title}
                </p>
                <div style={{
                  display: 'flex', gap: '10px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '11.5px', color: '#9a9a8e'
                  }}>
                    📁 {task.project?.title || 'No project'}
                  </span>
                  {task.deadline && (
                    <span style={{
                      fontSize: '11.5px', color: '#9a9a8e'
                    }}>
                      📅 {new Date(task.deadline)
                        .toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short'
                        })}
                    </span>
                  )}
                  {task.estimatedHours > 0 && (
                    <span style={{
                      fontSize: '11.5px', color: '#9a9a8e'
                    }}>
                      ⏱ {task.estimatedHours}h
                    </span>
                  )}
                </div>
              </div>

              {/* Priority badge */}
              <span className={`badge ${priorityBadge(task.priority)}`}>
                {task.priority}
              </span>

              {/* Status dropdown */}
              <select
                className="sel"
                style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
                value={task.status}
                onChange={e => handleStatusChange(task._id, e.target.value)}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => handleDelete(task._id)}
                style={{
                  background: 'none', border: 'none',
                  color: '#ddd', fontSize: '16px',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'color 0.2s',
                  padding: '2px 4px'
                }}
                onMouseEnter={e => e.target.style.color = '#ef4444'}
                onMouseLeave={e => e.target.style.color = '#ddd'}>
                ✕
              </button>

            </div>
          ))}
        </div>
      )}

    </Layout>
  );
};

export default TasksPage;