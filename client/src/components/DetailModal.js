import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import FormattedAIReport from './FormattedAIReport';
import FullFieldPresets, { createFeaturePresets } from './FullFieldPresets';

function initialAIInput(item, feature) {
  return Object.fromEntries(feature.fields.map((field) => {
    let value = item[field.key];
    if (field.type === 'date' && value) value = new Date(value).toISOString().slice(0, 10);
    if (typeof value === 'boolean') value = String(value);
    return [field.key, value === null || value === undefined ? '' : String(value)];
  }));
}

export default function DetailModal({ item, feature, onClose, onEdit, onDelete }) {
  const [aiResponse, setAiResponse] = useState(null);
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState(() => initialAIInput(item, feature));
  const presets = useMemo(() => createFeaturePresets(feature), [feature]);

  useEffect(() => {
    setAiInput(initialAIInput(item, feature));
    setAiResponse(null);
    setAiError('');
  }, [item, feature]);

  const handleAI = async (event) => {
    event?.preventDefault();
    const missing = feature.fields.find((field) => field.required && !String(aiInput[field.key] || '').trim());
    if (missing) {
      setAiError(`${missing.label} is required.`);
      return;
    }
    setAiLoading(true);
    setAiResponse(null);
    setAiError('');
    try {
      const request = { ...item, ...aiInput };
      if (feature.key === 'assessments' && !request.topic) request.topic = request.title;
      const { data } = await api.post(feature.aiEndpoint, request);
      setAiResponse(data);
    } catch (error) {
      setAiError(error.response?.data?.error || 'Failed to get an AI response. Check the provider configuration and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase());

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (key === 'deadline' || key === 'lastActive' || key === 'date') {
      return value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
    }
    return String(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{item[feature.detailFields[0]]}</h2>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            {feature.detailFields.map((field) => {
              const fieldConfig = feature.fields.find((candidate) => candidate.key === field);
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
                    ) : formatValue(field, item[field])}
                  </div>
                </div>
              );
            })}
          </div>

          <form className="ai-request-editor" onSubmit={handleAI}>
            <div className="ai-request-editor-heading">
              <div>
                <span className="ai-eyebrow">AI request inputs</span>
                <h3>{feature.aiLabel}</h3>
              </div>
              <p>Edit this request without changing the saved record.</p>
            </div>
            <FullFieldPresets
              value={aiInput}
              presets={presets}
              disabled={aiLoading}
              onChange={(values) => { setAiInput(values); setAiResponse(null); setAiError(''); }}
            />
            <div className="ai-request-grid">
              {feature.fields.map((field) => (
                <div key={field.key} className={`ai-request-field ${field.fullWidth ? 'ai-request-field-wide' : ''}`}>
                  <label htmlFor={`ai-${feature.key}-${field.key}`}>{field.label}<span>{field.required ? 'Required' : 'Optional'}</span></label>
                  {field.type === 'textarea' ? (
                    <textarea id={`ai-${feature.key}-${field.key}`} data-ai-field={field.key} rows={3} required={field.required} disabled={aiLoading} value={aiInput[field.key]} onChange={(event) => setAiInput({ ...aiInput, [field.key]: event.target.value })} />
                  ) : field.type === 'select' ? (
                    <select id={`ai-${feature.key}-${field.key}`} data-ai-field={field.key} disabled={aiLoading} value={aiInput[field.key]} onChange={(event) => setAiInput({ ...aiInput, [field.key]: event.target.value })}>
                      <option value="">Select…</option>
                      {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input id={`ai-${feature.key}-${field.key}`} data-ai-field={field.key} type={field.type || 'text'} required={field.required} disabled={aiLoading} value={aiInput[field.key]} onChange={(event) => setAiInput({ ...aiInput, [field.key]: event.target.value })} />
                  )}
                </div>
              ))}
            </div>
            <div className="ai-request-actions">
              <p>Examples are fictional. Review all fields before requesting analysis.</p>
              <button type="submit" className="btn btn-ai" disabled={aiLoading}>🤖 {aiLoading ? 'Analyzing…' : feature.aiLabel}</button>
            </div>
          </form>

          {aiLoading && <div className="ai-loading"><div className="spinner" /><p>AI is analyzing… Please wait.</p></div>}
          {aiError && <div className="ai-alert" role="alert">{aiError}</div>}
          {aiResponse && <FormattedAIReport response={aiResponse} title={feature.aiLabel} />}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onEdit}>✏️ Edit record</button>
          <button type="button" className="btn btn-danger" onClick={onDelete}>🗑️ Delete record</button>
        </div>
      </div>
    </div>
  );
}
