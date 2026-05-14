import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FEATURES } from '../config/features';
import api from '../services/api';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';

const PAGINATED_FEATURES = ['chemistry-experiments', 'physics-simulations', 'biology-labs', 'assessments', 'student-progress'];

export default function FeaturePage() {
  const { featureKey } = useParams();
  const navigate = useNavigate();
  const feature = FEATURES.find(f => f.key === featureKey);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rubricLoading, setRubricLoading] = useState(false);
  const [rubricResult, setRubricResult] = useState(null);

  const isPaginated = PAGINATED_FEATURES.includes(featureKey);

  const fetchItems = useCallback(async (p = 1) => {
    if (!feature) return;
    setLoading(true);
    try {
      const url = isPaginated ? `${feature.apiPath}?page=${p}&limit=20` : feature.apiPath;
      const { data } = await api.get(url);
      if (isPaginated && data.data) {
        setItems(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      } else {
        setItems(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotal(Array.isArray(data) ? data.length : 0);
      }
    } catch (e) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [feature, isPaginated]);

  useEffect(() => {
    setPage(1);
    setRubricResult(null);
    fetchItems(1);
  }, [featureKey]);

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`${feature.apiPath}/${id}`);
      showToast('Item deleted successfully');
      setSelectedItem(null);
      fetchItems(page);
    } catch (e) {
      showToast('Failed to delete item', 'error');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        await api.put(`${feature.apiPath}/${editItem.id}`, formData);
        showToast('Item updated successfully');
      } else {
        await api.post(feature.apiPath, formData);
        showToast('Item created successfully');
      }
      setShowForm(false);
      setEditItem(null);
      fetchItems(page);
    } catch (e) {
      showToast('Failed to save item', 'error');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(null);
    setEditItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleRubricGrade = async (reportId) => {
    setRubricLoading(true);
    setRubricResult(null);
    try {
      const { data } = await api.post('/ai/report/rubric-grade', { reportId });
      setRubricResult(data);
    } catch (e) {
      showToast('Rubric grading failed: ' + (e.response?.data?.error || e.message), 'error');
    }
    setRubricLoading(false);
  };

  if (!feature) {
    return <div>Feature not found. <button onClick={() => navigate('/')}>Go back</button></div>;
  }

  const nameCol = feature.columns[0];

  const renderAssessmentQuestions = (questions) => {
    if (!Array.isArray(questions) || questions.length === 0) return null;
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16, color: '#e2e8f0' }}>
          Questions ({questions.length})
        </div>
        {questions.map((q, idx) => (
          <div key={idx} style={{
            background: '#0f172a',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 10,
            border: '1px solid #1e293b'
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#e2e8f0' }}>
              {idx + 1}. {q.question}
              {q.points && <span style={{ fontWeight: 400, color: '#64748b', fontSize: 12, marginLeft: 8 }}>{q.points} pts</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(q.options || []).map((opt, oi) => (
                <div key={oi} style={{
                  fontSize: 13,
                  color: opt === q.correct_answer ? '#22c55e' : '#94a3b8',
                  fontWeight: opt === q.correct_answer ? 600 : 400
                }}>
                  {opt === q.correct_answer ? '✓ ' : '  '}{opt}
                </div>
              ))}
            </div>
            {q.explanation && (
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontStyle: 'italic' }}>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRubricResult = (result) => {
    if (!result) return null;
    const sections = [
      { label: 'Hypothesis', key: 'hypothesis_score' },
      { label: 'Methods', key: 'methods_score' },
      { label: 'Data Collection', key: 'data_collection_score' },
      { label: 'Analysis', key: 'analysis_score' },
      { label: 'Conclusion', key: 'conclusion_score' },
    ];
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16, color: '#e2e8f0' }}>
          Rubric Grading Result
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {sections.map(s => (
            <div key={s.key} style={{ background: '#0f172a', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  flex: 1, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(result[s.key] / 20) * 100}%`,
                    background: result[s.key] >= 15 ? '#22c55e' : result[s.key] >= 10 ? '#f59e0b' : '#ef4444',
                    borderRadius: 4,
                    transition: 'width 0.5s'
                  }} />
                </div>
                <span style={{ fontWeight: 700, color: '#e2e8f0', minWidth: 40, textAlign: 'right' }}>
                  {result[s.key]}/20
                </span>
              </div>
              {result.feedback_by_section?.[s.key.replace('_score', '')] && (
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                  {result.feedback_by_section[s.key.replace('_score', '')]}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ background: '#0f172a', borderRadius: 8, padding: '16px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: result.total_score >= 70 ? '#22c55e' : '#ef4444' }}>
            {result.total_score}/100
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Total Score</div>
        </div>
        {result.overall_feedback && (
          <div style={{ background: '#0f172a', borderRadius: 8, padding: '14px 16px', color: '#94a3b8', fontSize: 14 }}>
            <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>Overall Feedback</div>
            {result.overall_feedback}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
          <h1 className="page-title">{feature.icon} {feature.name}</h1>
        </div>
        <button className="add-btn" onClick={handleAdd}>+ New Item</button>
      </div>

      {loading ? (
        <div className="ai-loading"><div className="spinner"></div><p>Loading data...</p></div>
      ) : (
        <div className="data-table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>{total} items</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                {feature.columns.map(col => (
                  <th key={col}>{col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</th>
                ))}
                {featureKey === 'assessments' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
                  <td>{(page - 1) * 20 + idx + 1}</td>
                  {feature.columns.map(col => (
                    <td key={col}>
                      {['difficulty', 'status'].includes(col) ? (
                        <span className={`badge badge-${(item[col] || '').toLowerCase().replace(/\s+/g, '-')}`}>
                          {item[col]}
                        </span>
                      ) : col === 'averageScore' ? (
                        <span>{item[col]}%</span>
                      ) : col === 'completedLabs' ? (
                        <span>{item[col]}/{item.totalLabs}</span>
                      ) : col === 'virtualAvailable' ? (
                        <span className={`badge ${item[col] ? 'badge-available' : 'badge-retired'}`}>
                          {item[col] ? 'Yes' : 'No'}
                        </span>
                      ) : col === 'aiGenerated' ? (
                        <span className={`badge ${item[col] ? 'badge-available' : 'badge-retired'}`}>
                          {item[col] ? 'AI' : 'Manual'}
                        </span>
                      ) : (
                        String(item[col] || '—').substring(0, 50)
                      )}
                    </td>
                  ))}
                  {featureKey === 'assessments' && (
                    <td onClick={e => e.stopPropagation()}>
                      {Array.isArray(item.questions) && item.questions.length > 0 && (
                        <button
                          className="add-btn"
                          style={{ fontSize: 12, padding: '4px 10px' }}
                          onClick={() => navigate(`/assessments/${item.id}/take`)}
                        >
                          Take Quiz
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={feature.columns.length + 2} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No items found. Click "+ New Item" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isPaginated && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
              <button
                className="back-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{ opacity: page <= 1 ? 0.4 : 1 }}
              >
                Prev
              </button>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>Page {page} of {totalPages}</span>
              <button
                className="add-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{ opacity: page >= totalPages ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <>
          <DetailModal
            item={selectedItem}
            feature={feature}
            onClose={() => { setSelectedItem(null); setRubricResult(null); }}
            onEdit={() => handleEdit(selectedItem)}
            onDelete={() => handleDelete(selectedItem.id)}
          />

          {featureKey === 'assessments' && Array.isArray(selectedItem.questions) && selectedItem.questions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {renderAssessmentQuestions(selectedItem.questions)}
              <button
                className="add-btn"
                style={{ marginTop: 16 }}
                onClick={() => navigate(`/assessments/${selectedItem.id}/take`)}
              >
                Take This Assessment
              </button>
            </div>
          )}

          {featureKey === 'lab-reports' && (
            <div style={{ marginTop: 16 }}>
              <button
                className="add-btn"
                onClick={() => handleRubricGrade(selectedItem.id)}
                disabled={rubricLoading}
                style={{ opacity: rubricLoading ? 0.6 : 1 }}
              >
                {rubricLoading ? 'Grading...' : 'AI Grade Report (Rubric)'}
              </button>
              {selectedItem.gradingResult && !rubricResult && renderRubricResult(selectedItem.gradingResult)}
              {rubricResult && renderRubricResult(rubricResult)}
            </div>
          )}
        </>
      )}

      {showForm && (
        <FormModal
          feature={feature}
          item={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
