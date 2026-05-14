import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FEATURES } from '../config/features';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">🔬</div>
          <h2>AI Lab Simulation</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          {FEATURES.map((f) => (
            <button
              key={f.key}
              className={`sidebar-nav-item ${location.pathname === `/feature/${f.key}` ? 'active' : ''}`}
              onClick={() => navigate(`/feature/${f.key}`)}
            >
              <span className="nav-icon">{f.icon}</span>
              {f.name}
            </button>
          ))}
          <button
            className={`sidebar-nav-item ${location.pathname === '/ai-history' ? 'active' : ''}`}
            onClick={() => navigate('/ai-history')}
          >
            <span className="nav-icon">🕒</span>
            AI History
          </button>
          <button
            className={`sidebar-nav-item ${location.pathname === '/advanced-ai' ? 'active' : ''}`}
            onClick={() => navigate('/advanced-ai')}
          >
            <span className="nav-icon">🤖</span>
            Advanced AI
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            ⏻
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
