import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TOOLS = [
  {
    id: 'misconception-detector',
    title: 'Student Misconception Detector',
    icon: '🧠',
    endpoint: '/ai/student/misconception-detector',
    desc: 'Identify misconceptions and error patterns in student submissions; suggest remediation steps and follow-up questions.',
    fields: [
      { name: 'student_submission', label: 'Student Submission', type: 'textarea', required: true, placeholder: 'Paste student answer, lab notes, or solution...' },
      { name: 'expected_answer', label: 'Expected / Correct Answer', type: 'textarea', placeholder: 'Optional reference answer' },
      { name: 'topic', label: 'Topic / Subject', type: 'text', placeholder: 'e.g., Acid-Base Equilibrium, Newtonian Mechanics' },
      { name: 'grade_level', label: 'Grade Level', type: 'select', options: ['Middle School', 'High School', 'Undergraduate', 'Graduate'] },
    ],
  },
  {
    id: 'realtime-monitor',
    title: 'Real-time Safety Monitor (advisory)',
    icon: '⚠️',
    endpoint: '/ai/safety/realtime-monitor',
    desc: 'In-progress safety check with risk level, violations, and recommended action (continue/warn/pause/stop/evacuate). Advisory only.',
    fields: [
      { name: 'experiment_type', label: 'Experiment Type', type: 'text', required: true, placeholder: 'e.g., titration, distillation, electrolysis' },
      { name: 'observation', label: 'Current Observation', type: 'textarea', required: true, placeholder: 'What is happening right now?' },
      { name: 'sensor_data', label: 'Sensor Data (optional, JSON or text)', type: 'textarea', placeholder: 'e.g., temperature: 92C, pressure normal, no smoke' },
      { name: 'ppe_status', label: 'PPE Status', type: 'select', options: ['All required PPE worn', 'Partial PPE', 'No PPE', 'Unknown'] },
    ],
  },
  {
    id: 'equipment-predictor',
    title: 'Lab Equipment Predictor',
    icon: '🧪',
    endpoint: '/ai/equipment/predict',
    desc: 'Predicted equipment, consumables, and PPE for an experiment with cost estimates and low-budget alternatives.',
    fields: [
      { name: 'experiment_type', label: 'Experiment Type', type: 'text', required: true, placeholder: 'e.g., DNA gel electrophoresis' },
      { name: 'student_count', label: 'Number of Students', type: 'number', placeholder: '24' },
      { name: 'budget', label: 'Budget ($)', type: 'number', placeholder: '500' },
      { name: 'duration_minutes', label: 'Duration (minutes)', type: 'number', placeholder: '60' },
      { name: 'constraints', label: 'Constraints', type: 'textarea', placeholder: 'Optional: lab size, age range, restricted chemicals' },
    ],
  },
];

export default function AdvancedAITools() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(TOOLS[0].id);
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const tool = TOOLS.find((t) => t.id === tab);
  const formData = forms[tab] || {};

  useEffect(() => {
    setError(null);
    setResult(null);
  }, [tab]);

  const setField = (name, value) => {
    setForms((p) => ({ ...p, [tab]: { ...(p[tab] || {}), [name]: value } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    for (const f of tool.fields) {
      if (f.required && (formData[f.name] === undefined || formData[f.name] === '')) {
        setError(`${f.label} is required`);
        return;
      }
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const body = {};
      tool.fields.forEach((f) => {
        const v = formData[f.name];
        if (v === '' || v === undefined || v === null) return;
        if (f.type === 'number') body[f.name] = Number(v);
        else body[f.name] = v;
      });
      const { data } = await api.post(tool.endpoint, body);
      setResult(data);
    } catch (err) {
      const status = err.response?.status;
      const msg = status === 429
        ? 'AI rate limit reached.'
        : (err.response?.data?.error || err.message || 'Request failed');
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
          <h1 className="page-title">🤖 Advanced AI Tools</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 16px', borderRadius: 8, border: '1px solid #334155',
              background: tab === t.id ? '#0ea5e9' : '#1e293b',
              color: 'white', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.title}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', padding: 24, borderRadius: 12, color: '#e2e8f0' }}>
        <h3 style={{ marginTop: 0, color: '#7dd3fc' }}>{tool.icon} {tool.title}</h3>
        <p style={{ color: '#94a3b8' }}>{tool.desc}</p>

        <form onSubmit={submit}>
          {tool.fields.map((f) => (
            <div key={f.name} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {f.label} {f.required && <span style={{ color: '#fca5a5' }}>*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={formData[f.name] || ''}
                  placeholder={f.placeholder || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontFamily: 'inherit' }}
                />
              ) : f.type === 'select' ? (
                <select
                  value={formData[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
                >
                  <option value="">-- Select --</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={formData[f.name] || ''}
                  placeholder={f.placeholder || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: loading ? '#475569' : '#0ea5e9', color: 'white',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Generating...' : 'Run Analysis'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: 16, padding: 12, background: '#7f1d1d', color: '#fecaca', borderRadius: 8 }}>{error}</div>
        )}

        {result && (
          <div style={{ marginTop: 16, padding: 16, background: '#0f172a', borderRadius: 8, border: '1px solid #334155' }}>
            <h4 style={{ marginTop: 0, color: '#7dd3fc' }}>Result</h4>
            <pre style={{ background: '#020617', color: '#e2e8f0', padding: 14, borderRadius: 8, overflow: 'auto', fontSize: 12, maxHeight: 520 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
