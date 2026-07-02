import React from 'react';
import Sidebar from './Sidebar';

// Layout no longer needs a Navbar — sidebar handles everything
const Layout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#eeeee6'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;