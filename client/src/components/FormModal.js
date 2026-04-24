import React, { useState } from 'react';

export default function FormModal({ feature, item, onClose, onSave }) {
  const [formData, setFormData] = useState(() => {
    if (item) {
      const data = {};
      feature.fields.forEach(f => {
        let val = item[f.key];
        if (f.key === 'deadline' || f.key === 'date' || f.key === 'lastActive') {
          val = val ? new Date(val).toISOString().split('T')[0] : '';
        }
        data[f.key] = val !== null && val !== undefined ? String(val) : '';
      });
      return data;
    }
    const data = {};
    feature.fields.forEach(f => { data[f.key] = ''; });
    return data;
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const processed = { ...formData };
    feature.fields.forEach(f => {
      if (f.type === 'number' && processed[f.key]) {
        processed[f.key] = Number(processed[f.key]);
      }
      if (f.key === 'virtualAvailable' || f.key === 'aiGenerated') {
        processed[f.key] = processed[f.key] === 'true';
      }
    });
    await onSave(processed);
    setSaving(false);
  };

  return (
    <div className="modal-overlay form-modal" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit Item' : 'New Item'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {feature.fields.map(field => (
                <div key={field.key} className={`form-group ${field.fullWidth ? 'full-width' : ''}`}>
                  <label>{field.label} {field.required && '*'}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      required={field.required}
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-danger" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : (item ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
