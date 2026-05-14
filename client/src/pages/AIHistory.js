import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AIHistory() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const fetchResults = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/ai-results?page=${page}&limit=20`);
      setResults(data.data || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchResults(1); }, [fetchResults]);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatEndpoint = (ep) => ep?.replace('/ai/', '').replace(/\//g, ' / ') || ep;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
          <h1 className="page-title">AI Request History</h1>
        </div>
      </div>

      <div style={{ marginBottom: 16, color: '#94a3b8', fontSize: 14 }}>
        {pagination.total} total AI requests
      </div>

      {loading ? (
        <div className="ai-loading"><div className="spinner"></div><p>Loading history...</p></div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <p style={{ fontSize: 18 }}>No AI requests yet.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Use the AI features to start generating content.</p>
        </div>
      ) : (
        <div>
          {results.map((item) => (
            <div key={item.id} style={{
              background: '#1e293b',
              borderRadius: 12,
              marginBottom: 12,
              border: '1px solid #334155',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer'
                }}
                onClick={() => toggleExpand(item.id)}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>
                    {formatEndpoint(item.endpoint)}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                    {formatDate(item.createdAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {item.parsedResult && (
                    <span style={{ fontSize: 11, background: '#22c55e20', color: '#22c55e', padding: '2px 8px', borderRadius: 4 }}>
                      Structured
                    </span>
                  )}
                  <span style={{ color: '#64748b', fontSize: 18 }}>{expanded[item.id] ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded[item.id] && (
                <div style={{ borderTop: '1px solid #334155', padding: '16px 20px' }}>
                  {item.inputData && Object.keys(item.inputData).length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                        Input
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8' }}>
                        {Object.entries(item.inputData).map(([k, v]) => (
                          <div key={k} style={{ marginBottom: 4 }}>
                            <span style={{ color: '#6366f1' }}>{k}:</span> {String(v).substring(0, 100)}{String(v).length > 100 ? '...' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.parsedResult && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                        Parsed Result
                      </div>
                      <pre style={{
                        background: '#0f172a',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 12,
                        color: '#22c55e',
                        overflow: 'auto',
                        maxHeight: 300
                      }}>
                        {JSON.stringify(item.parsedResult, null, 2)}
                      </pre>
                    </div>
                  )}

                  {item.result && !item.parsedResult && (
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                        AI Response
                      </div>
                      <div style={{
                        background: '#0f172a',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 13,
                        color: '#94a3b8',
                        maxHeight: 300,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {item.result}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
              <button
                className="back-btn"
                onClick={() => fetchResults(pagination.page - 1)}
                disabled={pagination.page <= 1}
                style={{ opacity: pagination.page <= 1 ? 0.4 : 1 }}
              >
                Prev
              </button>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="add-btn"
                onClick={() => fetchResults(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                style={{ opacity: pagination.page >= pagination.totalPages ? 0.4 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
