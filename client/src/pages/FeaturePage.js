import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FEATURES } from '../config/features';
import api from '../services/api';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';
import Toast from '../components/Toast';

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

  const fetchItems = useCallback(async () => {
    if (!feature) return;
    setLoading(true);
    try {
      const { data } = await api.get(feature.apiPath);
      setItems(data);
    } catch (e) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [feature]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
      fetchItems();
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
      fetchItems();
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

  if (!feature) {
    return <div>Feature not found. <button onClick={() => navigate('/')}>Go back</button></div>;
  }

  const nameCol = feature.columns[0];

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
          <h1 className="page-title">{feature.icon} {feature.name}</h1>
        </div>
        <button className="add-btn" onClick={handleAdd}>
          + New Item
        </button>
      </div>

      {loading ? (
        <div className="ai-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                {feature.columns.map(col => (
                  <th key={col}>{col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} onClick={() => setSelectedItem(item)}>
                  <td>{idx + 1}</td>
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
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={feature.columns.length + 1} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No items found. Click "New Item" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          feature={feature}
          onClose={() => setSelectedItem(null)}
          onEdit={() => handleEdit(selectedItem)}
          onDelete={() => handleDelete(selectedItem.id)}
        />
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
