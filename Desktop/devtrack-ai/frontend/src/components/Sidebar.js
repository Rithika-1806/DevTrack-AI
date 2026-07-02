import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { path: '/dashboard',   label: 'Home',        icon: '🏠' },
    { path: '/projects',    label: 'Projects',    icon: '📁' },
    { path: '/tasks',       label: 'Tasks',       icon: '✅' },
    { path: '/ai-insights', label: 'AI Assistant',icon: '🤖' },
    { path: '/github',      label: 'GitHub',      icon: '🐙' },
    { path: '/profile',     label: 'Profile',     icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  // Generate initials from name
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'R';

  return (
    <div style={{
      width: '200px',
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #e4e4dc',
      display: 'flex',
      flexDirection: 'column',
      padding: '18px 12px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>

      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: '0 6px 18px',
        borderBottom: '1px solid #ebebE3',
        marginBottom: '12px'
      }}>
        <div style={{
          width: '30px', height: '30px',
          background: '#2e7d52',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          color: '#fff', fontSize: '11px',
          fontWeight: 800
        }}>
          &lt;/&gt;
        </div>
        <span style={{
          fontWeight: 800, fontSize: '13.5px',
          color: '#1a1a1a'
        }}>
          DevTrack AI
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1 }}>
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' active' : '')
            }>
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="btn-ghost"
        style={{
          width: '100%',
          marginBottom: '12px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          fontSize: '12.5px'
        }}>
        🚪 Logout
      </button>

      {/* User Info at Bottom */}
      <div style={{
        borderTop: '1px solid #ebebE3',
        paddingTop: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        paddingLeft: '6px'
      }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2e7d52, #6abf8a)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          color: '#fff', fontSize: '12px',
          fontWeight: 700, flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            fontSize: '12px', fontWeight: 700,
            color: '#1a1a1a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '10px', color: '#bbb' }}>
            🔥 {user?.currentStreak || 0} day streak
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;