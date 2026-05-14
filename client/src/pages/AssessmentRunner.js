import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AssessmentRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/assessments/${id}`)
      .then(({ data }) => {
        setAssessment(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load assessment.');
        setLoading(false);
      });
  }, [id]);

  const handleSelect = (questionIndex, option) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = async () => {
    const questions = assessment.questions;
    if (!Array.isArray(questions)) {
      setError('This assessment does not have structured questions to submit.');
      return;
    }
    const answersArray = Object.entries(answers).map(([questionIndex, selected]) => ({
      questionIndex: parseInt(questionIndex),
      selected
    }));
    setSubmitting(true);
    try {
      const { data } = await api.post(`/assessments/${id}/submit`, { answers: answersArray });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed.');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading assessment...</p></div>;
  if (error && !assessment) return <div style={{ padding: 40, color: '#ef4444' }}>{error}<br /><button className="add-btn" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Go Home</button></div>;
  if (!assessment) return null;

  const questions = Array.isArray(assessment.questions) ? assessment.questions : null;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <button className="back-btn" onClick={() => navigate('/feature/assessments')} style={{ marginBottom: 24 }}>
        Back to Assessments
      </button>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{assessment.title}</h1>
        <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 14 }}>
          {assessment.subject && <span>Subject: {assessment.subject}</span>}
          {assessment.difficulty && <span className={`badge badge-${assessment.difficulty}`}>{assessment.difficulty}</span>}
          {assessment.estimatedMinutes && <span>{assessment.estimatedMinutes} min</span>}
          {assessment.totalPoints && <span>{assessment.totalPoints} pts total</span>}
        </div>
      </div>

      {!questions ? (
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 32, color: '#94a3b8', textAlign: 'center' }}>
          <p>This assessment does not have structured multiple-choice questions.</p>
          <p style={{ marginTop: 8, fontSize: 13 }}>Use AI to generate a new assessment with structured questions.</p>
        </div>
      ) : result ? (
        <div>
          <div style={{ background: '#1e293b', borderRadius: 12, padding: 32, marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: result.percentage >= 70 ? '#22c55e' : '#ef4444', marginBottom: 8 }}>
              {result.percentage}%
            </div>
            <div style={{ fontSize: 20, color: '#e2e8f0', marginBottom: 4 }}>
              Score: {result.score} / {result.total_points}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 14 }}>
              {result.percentage >= 90 ? 'Excellent!' : result.percentage >= 70 ? 'Good job!' : 'Keep practicing!'}
            </div>
          </div>

          <h3 style={{ marginBottom: 16, color: '#e2e8f0' }}>Question Review</h3>
          {result.feedback?.map((fb, idx) => (
            <div key={idx} style={{
              background: '#1e293b',
              borderRadius: 10,
              padding: 20,
              marginBottom: 12,
              borderLeft: `4px solid ${fb.correct ? '#22c55e' : '#ef4444'}`
            }}>
              <div style={{ fontWeight: 600, marginBottom: 10, color: '#e2e8f0' }}>
                Q{idx + 1}: {fb.question}
              </div>
              <div style={{ fontSize: 14, marginBottom: 6, color: fb.correct ? '#22c55e' : '#ef4444' }}>
                Your answer: {fb.selected || 'Not answered'} {fb.correct ? '(Correct)' : '(Incorrect)'}
              </div>
              {!fb.correct && (
                <div style={{ fontSize: 14, color: '#22c55e', marginBottom: 6 }}>
                  Correct answer: {fb.correct_answer}
                </div>
              )}
              {fb.explanation && (
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, fontStyle: 'italic' }}>
                  {fb.explanation}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                Points: {fb.points_earned}/{fb.points_possible}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button className="add-btn" onClick={() => { setResult(null); setAnswers({}); }}>
              Try Again
            </button>
            <button className="back-btn" onClick={() => navigate('/feature/assessments')}>
              Back to Assessments
            </button>
          </div>
        </div>
      ) : (
        <div>
          {questions.map((q, idx) => (
            <div key={idx} style={{
              background: '#1e293b',
              borderRadius: 12,
              padding: 24,
              marginBottom: 16,
              border: '1px solid #334155'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 16, color: '#e2e8f0', fontSize: 16 }}>
                {idx + 1}. {q.question}
                {q.points && <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>({q.points} pts)</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(q.options || []).map((option, optIdx) => {
                  const optionLabel = typeof option === 'string' ? option : option;
                  const isSelected = answers[idx] === optionLabel;
                  return (
                    <label key={optIdx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 16px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? '#6366f1' : '#334155'}`,
                      transition: 'all 0.15s'
                    }}>
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={optionLabel}
                        checked={isSelected}
                        onChange={() => handleSelect(idx, optionLabel)}
                        style={{ accentColor: '#6366f1' }}
                      />
                      <span style={{ color: '#e2e8f0', fontSize: 14 }}>{optionLabel}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <div style={{ color: '#94a3b8', fontSize: 14 }}>
              {Object.keys(answers).length} of {questions.length} answered
            </div>
            <button
              className="add-btn"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length === 0}
              style={{ opacity: submitting || Object.keys(answers).length === 0 ? 0.6 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
