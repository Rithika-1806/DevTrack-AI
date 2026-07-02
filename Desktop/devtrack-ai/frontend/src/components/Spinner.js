import React from 'react';

const Spinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#eeeee6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px'
    }}>
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid #e4e4dc',
        borderTop: '3px solid #2e7d52',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#9a9a8e', fontSize: '13px', margin: 0 }}>
        {message}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Spinner;