import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FEATURES } from '../config/features';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    FEATURES.forEach(async (f) => {
      try {
        const { data } = await api.get(f.apiPath);
        setCounts(prev => ({ ...prev, [f.key]: data.length }));
      } catch (e) {
        setCounts(prev => ({ ...prev, [f.key]: 0 }));
      }
    });
  }, []);

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>AI-powered virtual laboratory platform for modern science education</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🔬</div>
          <div className="stat-value">{FEATURES.length}</div>
          <div className="stat-label">Lab Modules</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <div className="stat-value">14</div>
          <div className="stat-label">AI Features</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{counts['student-progress'] || 0}</div>
          <div className="stat-label">Students</div>
        </div>
      </div>

      <div className="feature-grid">
        {FEATURES.map((feature) => (
          <div
            key={feature.key}
            className="feature-card"
            onClick={() => navigate(`/feature/${feature.key}`)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.name}</h3>
            <p>{feature.description}</p>
            <div className="feature-count">
              {counts[feature.key] !== undefined ? `${counts[feature.key]} items` : 'Loading...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
