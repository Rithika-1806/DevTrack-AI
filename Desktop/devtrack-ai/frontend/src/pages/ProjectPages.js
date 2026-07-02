import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, createProject, deleteProject } from '../api/projectApi';
import { toast } from 'react-toastify';

// ==================== CREATE PROJECT MODAL ====================
const CreateProjectModal = ({ onSubmit, onClose, loading }) => {
  const [form, setForm] = useState({
    title: '', description: '',
    priority: 'Medium', status: 'Planning', deadline: ''
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title) { toast.error('Title is required'); return; }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
            📁 Create New Project
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              fontSize: '18px', cursor: 'pointer', color: '#bbb'
            }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: '#555', marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Project Title *
            </label>
            <input
              name="title" className="inp"
              placeholder="e.g. Resume Analyzer"
              value={form.title} onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: '#555', marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Description
            </label>
            <textarea
              name="description" className="inp"
              placeholder="What is this project about?"
              rows="3"
              value={form.description} onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px', marginBottom: '14px'
          }}>
            <div>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                color: '#555', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                Priority
              </label>
              <select
                name="priority" className="sel"
                value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                color: '#555', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                Status
              </label>
              <select
                name="status" className="sel"
                value={form.status} onChange={handleChange}>
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: '#555', marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              Deadline
            </label>
            <input
              type="date" name="deadline" className="inp"
              value={form.deadline} onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn-green"
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>
              {loading ? 'Creating...' : '+ Create Project'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ==================== MAIN PAGE ====================
const ProjectPages = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating]   = useState(false);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects(token);
      setProjects(data.projects || []);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (form) => {
    setCreating(true);
    try {
      const data = await createProject(token, form);
      setProjects([data.project, ...projects]);
      setShowModal(false);
      toast.success('Project created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(token, id);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const statusColor = s =>
    s === 'Completed'  ? '#2e7d52' :
    s === 'In Progress'? '#6b8af7' :
    s === 'On Hold'    ? '#f59e0b' : '#bbb';

  const priorityBadge = p =>
    p === 'High'   ? 'badge-red' :
    p === 'Medium' ? 'badge-orange' : 'badge-green';

  if (loading) return <Spinner message="Loading projects..." />;

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
            Projects 📁
          </h1>
          <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
            {projects.length} projects total
          </p>
        </div>
        <button
          className="btn-green"
          onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '60px 20px', textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📁</div>
          <h3 style={{
            fontSize: '15px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '6px'
          }}>
            No projects yet
          </h3>
          <p style={{ color: '#9a9a8e', fontSize: '13px', marginBottom: '20px' }}>
            Create your first project to get started
          </p>
          <button
            className="btn-green"
            onClick={() => setShowModal(true)}>
            + Create Project
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '14px'
        }}>
          {projects.map(project => (
            <div
              key={project._id}
              className="card"
              style={{ padding: '20px' }}>

              {/* Top — badges */}
              <div style={{
                display: 'flex', gap: '6px',
                marginBottom: '12px'
              }}>
                <span className={`badge ${priorityBadge(project.priority)}`}>
                  {project.priority}
                </span>
                <span className="badge badge-gray">
                  {project.status}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '14px', fontWeight: 800,
                color: '#1a1a1a', marginBottom: '6px'
              }}>
                {project.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '12px', color: '#9a9a8e',
                marginBottom: '14px', lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {project.description || 'No description added'}
              </p>

              {/* Progress */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <span style={{ fontSize: '11px', color: '#9a9a8e' }}>
                    Progress
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    color: '#2e7d52'
                  }}>
                    {project.progress || 0}%
                  </span>
                </div>
                <div className="prog">
                  <div
                    className="prog-bar"
                    style={{
                      width: `${project.progress || 0}%`,
                      background: statusColor(project.status)
                    }}
                  />
                </div>
              </div>

              {/* Task counts */}
              <div style={{
                display: 'flex', gap: '14px',
                marginBottom: '14px'
              }}>
                <span style={{ fontSize: '12px', color: '#9a9a8e' }}>
                  📝 {project.totalTasks || 0} tasks
                </span>
                <span style={{ fontSize: '12px', color: '#2e7d52' }}>
                  ✅ {project.completedTasks || 0} done
                </span>
              </div>

              {/* Deadline */}
              {project.deadline && (
                <p style={{
                  fontSize: '11.5px', color: '#9a9a8e',
                  marginBottom: '14px'
                }}>
                  📅 {new Date(project.deadline).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              )}

              {/* Divider */}
              <div style={{
                height: '1px', background: '#f0f0ea',
                marginBottom: '12px'
              }} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-red"
                  style={{ fontSize: '11.5px', padding: '7px 14px' }}
                  onClick={() => handleDelete(project._id)}>
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onSubmit={handleCreate}
          onClose={() => setShowModal(false)}
          loading={creating}
        />
      )}

    </Layout>
  );
};

export default ProjectPages;