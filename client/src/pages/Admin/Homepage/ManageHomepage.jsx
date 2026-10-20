import { useState, useEffect } from 'react';
import {
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineViewColumns,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import {
  getAdminHomepageSections,
  updateHomepageSections,
  DEFAULT_HOMEPAGE_SECTIONS,
} from '../../../services/homepageService';
import '../AdminManagement.css';
import './ManageHomepage.css';

export default function ManageHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await getAdminHomepageSections();
      setSections(data || DEFAULT_HOMEPAGE_SECTIONS);
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load homepage layout.');
      setSections(DEFAULT_HOMEPAGE_SECTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggle = (id) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setHasChanges(true);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setHasChanges(true);
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setHasChanges(true);
  };

  const handleReset = () => {
    setSections(DEFAULT_HOMEPAGE_SECTIONS);
    setHasChanges(true);
    toast.success('Reset to default homepage layout.');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHomepageSections(sections);
      toast.success('Homepage layout saved successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save homepage layout.');
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = sections.filter((s) => s.enabled !== false).length;

  return (
    <div className="admin-page" id="admin-homepage-view">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage Layout & Sections</h1>
          <p className="admin-page-subtitle">
            Customize which sections appear on the storefront homepage and drag/sort their presentation order
          </p>
        </div>
        <div className="layout-toolbar-actions">
          <button
            type="button"
            className="btn-layout-reset"
            onClick={handleReset}
            title="Reset to default sequence"
          >
            <HiOutlineArrowPath size={14} style={{ display: 'inline', marginRight: 4 }} />
            Reset Defaults
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            id="admin-save-layout-btn"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <HiOutlineCheck size={16} /> Save Layout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Toolbar */}
      <div className="layout-toolbar">
        <div className="layout-stats">
          <span className="layout-stat-badge">
            <span className="layout-stat-dot" />
            {enabledCount} of {sections.length} Sections Active
          </span>
          {hasChanges && (
            <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 600 }}>
              ● Unsaved layout changes
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
          💡 Tip: Use the Up / Down arrows to reorder sections. Toggle the switch to show or hide.
        </span>
      </div>

      {/* Sections List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
          Loading homepage layout...
        </div>
      ) : (
        <div className="layout-sections-list">
          {sections.map((section, index) => {
            const isEnabled = section.enabled !== false;
            return (
              <div
                key={section.id}
                className={`layout-section-card ${!isEnabled ? 'disabled' : ''}`}
              >
                <div className="layout-section-left">
                  <span className="layout-section-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="layout-section-details">
                    <span className="layout-section-name">{section.name}</span>
                    <span className="layout-section-desc">{section.description}</span>
                  </div>
                </div>

                <div className="layout-section-right">
                  {/* Reorder Buttons */}
                  <div className="layout-reorder-group">
                    <button
                      type="button"
                      className="layout-arrow-btn"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      title="Move Up"
                      aria-label={`Move ${section.name} up`}
                    >
                      <HiOutlineArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      className="layout-arrow-btn"
                      onClick={() => moveDown(index)}
                      disabled={index === sections.length - 1}
                      title="Move Down"
                      aria-label={`Move ${section.name} down`}
                    >
                      <HiOutlineArrowDown size={15} />
                    </button>
                  </div>

                  {/* Toggle Active Switch */}
                  <label className="layout-toggle-switch" title={isEnabled ? 'Enabled' : 'Disabled'}>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggle(section.id)}
                    />
                    <span className="layout-toggle-slider" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
