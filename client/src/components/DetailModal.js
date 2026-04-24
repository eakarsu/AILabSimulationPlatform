import React, { useState } from 'react';
import api from '../services/api';
import AIResponse from './AIResponse';

export default function DetailModal({ item, feature, onClose, onEdit, onDelete }) {
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAI = async () => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const { data } = await api.post(feature.aiEndpoint, item);
      setAiResponse(data);
    } catch (e) {
      setAiResponse({ content: 'Failed to get AI response. Please check your OpenRouter API key in .env file.', error: true });
    } finally {
      setAiLoading(false);
    }
  };

  const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  const formatValue = (key, val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (key === 'deadline' || key === 'lastActive' || key === 'date') {
      return val ? new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
    }
    return String(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item[feature.detailFields[0]]}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            {feature.detailFields.map(field => {
              const fieldConfig = feature.fields.find(f => f.key === field);
              const isLong = fieldConfig?.type === 'textarea' || String(item[field] || '').length > 60;
              return (
                <div key={field} className={`detail-item ${isLong ? 'full-width' : ''}`}>
                  <label>{formatLabel(field)}</label>
                  <div className="value">
                    {['difficulty', 'status'].includes(field) ? (
                      <span className={`badge badge-${(item[field] || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {item[field]}
                      </span>
                    ) : field === 'averageScore' ? (
                      <>
                        <span>{item[field]}%</span>
                        <div className="progress-bar" style={{ marginTop: '8px' }}>
                          <div
                            className={`progress-bar-fill ${item[field] >= 85 ? 'high' : item[field] >= 70 ? 'medium' : 'low'}`}
                            style={{ width: `${item[field]}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      formatValue(field, item[field])
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {aiLoading && (
            <div className="ai-loading">
              <div className="spinner"></div>
              <p>AI is analyzing... Please wait</p>
            </div>
          )}

          {aiResponse && <AIResponse response={aiResponse} />}
        </div>

        <div className="modal-actions">
          <button className="btn btn-ai" onClick={handleAI} disabled={aiLoading}>
            🤖 {feature.aiLabel}
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            ✏️ Edit
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
