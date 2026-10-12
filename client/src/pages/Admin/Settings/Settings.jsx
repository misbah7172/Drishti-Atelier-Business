import { useState, useEffect } from 'react';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import '../AdminManagement.css';
import './Settings.css';

const CATEGORY_LABELS = {
  general: 'General',
  contact: 'Contact Information',
  social: 'Social Media',
  store: 'Store Configuration',
  seo: 'SEO & Analytics',
};

const CATEGORY_ICONS = {
  general: '🏪',
  contact: '📞',
  social: '🌐',
  store: '🛒',
  seo: '🔍',
};

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState({});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    api.get('/admin/settings')
      .then(res => { setSettings(res.data.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setDirty(p => ({ ...p, [key]: value }));
  };

  const getValue = (key, original) => {
    return dirty[key] !== undefined ? dirty[key] : original;
  };

  const handleSave = async () => {
    if (Object.keys(dirty).length === 0) return toast('No changes to save');
    setSaving(true);
    try {
      await api.put('/admin/settings', { settings: dirty });
      toast.success(`${Object.keys(dirty).length} setting(s) saved`);
      // Update local state
      const updated = { ...settings };
      for (const cat of Object.keys(updated)) {
        updated[cat] = updated[cat].map(s => ({
          ...s,
          value: dirty[s.key] !== undefined ? dirty[s.key] : s.value,
        }));
      }
      setSettings(updated);
      setDirty({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const categories = Object.keys(settings);
  const dirtyCount = Object.keys(dirty).length;

  return (
    <div className="admin-page" id="admin-settings-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your store, SEO, contact info, and social links</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleSave}
          disabled={saving || dirtyCount === 0}
          style={{ opacity: dirtyCount === 0 ? 0.4 : 1 }}
        >
          <HiOutlineCog6Tooth size={16} />
          {saving ? 'Saving...' : `Save${dirtyCount > 0 ? ` (${dirtyCount})` : ''}`}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>Loading settings...</div>
      ) : (
        <div className="settings-layout">
          {/* Tabs */}
          <div className="settings-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`settings-tab ${activeTab === cat ? 'settings-tab-active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                <span className="settings-tab-icon">{CATEGORY_ICONS[cat] || '⚙️'}</span>
                <span className="settings-tab-label">{CATEGORY_LABELS[cat] || cat}</span>
              </button>
            ))}
          </div>

          {/* Settings Panel */}
          <div className="settings-panel">
            <h2 className="settings-panel-title">
              {CATEGORY_ICONS[activeTab]} {CATEGORY_LABELS[activeTab] || activeTab}
            </h2>
            <div className="settings-fields">
              {(settings[activeTab] || []).map(s => (
                <div key={s.key} className="settings-field">
                  <label className="settings-field-label">{s.label || s.key}</label>
                  <span className="settings-field-key">{s.key}</span>
                  {s.value.length > 80 || s.key.includes('description') || s.key.includes('address') ? (
                    <textarea
                      className="settings-field-input settings-textarea"
                      value={getValue(s.key, s.value)}
                      onChange={(e) => handleChange(s.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      type={s.key.includes('fee') || s.key.includes('threshold') || s.key.includes('amount') ? 'number' : 'text'}
                      className="settings-field-input"
                      value={getValue(s.key, s.value)}
                      onChange={(e) => handleChange(s.key, e.target.value)}
                    />
                  )}
                  {dirty[s.key] !== undefined && dirty[s.key] !== s.value && (
                    <span className="settings-changed-badge">modified</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
