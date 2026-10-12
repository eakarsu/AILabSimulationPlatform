import NativeAIControls from "../components/NativeAIControls";
import useNativeAIRequest from "../components/useNativeAIRequest";
import FormattedAIReport from "../components/FormattedAIReport";
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
      { name: 'subject', label: 'Subject / Topic', type: 'text', required: true, placeholder: 'e.g., Acid-Base Equilibrium' },
      { name: 'submission', label: 'Student Submission', type: 'textarea', required: true, placeholder: 'Paste student answer, lab notes, or solution...' },
      { name: 'expected_answer', label: 'Expected / Correct Answer', type: 'textarea', placeholder: 'Optional reference answer' },
      { name: 'common_misconceptions', label: 'Known Common Misconceptions', type: 'textarea', placeholder: 'Optional misconceptions to check' },
    ],
    examples: [
      { name: 'Equilibrium example', values: { subject: 'Acid-base equilibrium', submission: 'The student states that adding acid to a buffer does not change pH because the acid disappears completely.', expected_answer: 'A buffer limits pH change because its conjugate pair consumes part of the added acid; capacity is finite and pH still changes.', common_misconceptions: 'Buffers keep pH exactly constant; added acid disappears; buffer capacity is unlimited.' } },
      { name: 'Mechanics example', values: { subject: 'Newtonian mechanics', submission: 'The student says a moving cart needs a continuous forward force even when friction is negligible.', expected_answer: 'With negligible net force, the cart continues at constant velocity; force is required for acceleration, not motion itself.', common_misconceptions: 'Motion requires force; velocity and acceleration are interchangeable; zero net force means zero velocity.' } },
      { name: 'Data analysis example', values: { subject: 'Experimental uncertainty', submission: 'The student reports one measurement as exact and removes a different trial only because it is far from the mean.', expected_answer: 'Measurements carry uncertainty, and excluding a trial requires a documented procedural or statistical rationale.', common_misconceptions: 'More decimal places guarantee accuracy; outliers may always be deleted; repeatability proves correctness.' } },
    ],
  },
  {
    id: 'realtime-monitor',
    title: 'Real-time Safety Monitor (advisory)',
    icon: '⚠️',
    endpoint: '/ai/safety/realtime-monitor',
    desc: 'In-progress safety check with risk level, violations, and recommended action (continue/warn/pause/stop/evacuate). Advisory only.',
    fields: [
      { name: 'experiment', label: 'Experiment', type: 'text', required: true, placeholder: 'e.g., acid-base titration' },
      { name: 'current_step', label: 'Current Step', type: 'textarea', required: true, placeholder: 'Describe the procedure step in progress' },
      { name: 'observations', label: 'Observations / Sensor Data', type: 'textarea', placeholder: 'Optional readings and direct observations' },
      { name: 'last_actions', label: 'Recent Student Actions', type: 'textarea', placeholder: 'Optional actions immediately before this check' },
    ],
    examples: [
      { name: 'Titration check', values: { experiment: 'Supervised acid-base titration', current_step: 'A student is adding 0.100 M sodium hydroxide dropwise near the endpoint while the instructor observes.', observations: 'Goggles and gloves worn; burette secured; solution remains clear; no spill; room temperature 22 °C.', last_actions: 'Rinsed burette with titrant, removed funnel, recorded initial reading, and slowed addition near the endpoint.' } },
      { name: 'Heating check', values: { experiment: 'Water-bath heating of a nonflammable sample', current_step: 'The sample is held in a clamped test tube above a controlled water bath.', observations: 'Goggles worn; clamp secure; bath at 62 °C; no visible damage, smoke, or unexpected pressure.', last_actions: 'Verified glassware, set the bath temperature, and pointed the tube away from people.' } },
      { name: 'Spill review', values: { experiment: 'Supervised buffer preparation', current_step: 'Work is paused after approximately 5 mL of dilute buffer was found on the bench.', observations: 'No skin contact reported; area isolated; container label readable; spill kit and supervisor available.', last_actions: 'Stopped work, alerted the instructor, kept others away, and did not begin cleanup without approval.' } },
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
      { name: 'learning_objectives', label: 'Learning Objectives', type: 'textarea', placeholder: 'Optional skills and concepts students should practice' },
      { name: 'student_count', label: 'Number of Students', type: 'number', placeholder: '24' },
      { name: 'budget', label: 'Budget ($)', type: 'number', placeholder: '500' },
      { name: 'constraints', label: 'Constraints', type: 'textarea', placeholder: 'Optional: lab size, age range, restricted chemicals' },
    ],
    examples: [
      { name: 'Electrophoresis lab', values: { experiment_type: 'Agarose gel electrophoresis with pre-stained teaching samples', learning_objectives: 'Load samples accurately, explain DNA migration, compare band patterns, and document uncertainty.', student_count: 24, budget: 650, constraints: 'Six groups; 90-minute session; use nonmutagenic stain; existing power supplies must be reused.' } },
      { name: 'Microscopy lab', values: { experiment_type: 'Onion root-tip mitosis microscopy', learning_objectives: 'Prepare a slide, focus safely, identify mitotic stages, and calculate a mitotic index.', student_count: 18, budget: 300, constraints: 'Nine microscopes available; prepared slides preferred; no live culture work.' } },
      { name: 'Titration lab', values: { experiment_type: 'Microscale acid-base titration', learning_objectives: 'Condition glassware, identify an endpoint, calculate concentration, and discuss measurement uncertainty.', student_count: 30, budget: 500, constraints: 'Fifteen pairs; minimize chemical waste; 60-minute session; instructor approval required for substitutions.' } },
    ],
  },
];

export default function AdvancedAITools() {
  const nativeAIRequest = useNativeAIRequest();

  const navigate = useNavigate();
  const [tab, setTab] = useState(TOOLS[0].id);
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const tool = TOOLS.find((t) => t.id === tab);
  const formData = forms[tab] || {};
  const presetChoices = tool.examples.map((example) => ({
    name: example.name,
    fill: () => {
      setForms((current) => ({ ...current, [tab]: { ...example.values } }));
      setError(null);
      setResult(null);
      return { filled: tool.fields.length, manual: [] };
    },
  }));

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
      const { data } = await nativeAIRequest.run((signal) => api.post(tool.endpoint, body, { signal }));
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
    <NativeAIControls busy={nativeAIRequest.busy} onCancel={nativeAIRequest.cancel} context="Lab Simulation Platform" presets={presetChoices}><div className="feature-page">
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
                <textarea data-ai-field={f.name}
                  rows={4}
                  value={formData[f.name] || ''}
                  placeholder={f.placeholder || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontFamily: 'inherit' }}
                />
              ) : f.type === 'select' ? (
                <select data-ai-field={f.name}
                  value={formData[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
                >
                  <option value="">-- Select --</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input data-ai-field={f.name}
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
            <FormattedAIReport response={result} />
          </div>
        )}
      </div>
    </div></NativeAIControls>
  );
}
