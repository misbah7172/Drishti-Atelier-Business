import { useState, useEffect, useRef } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineArrowUpTray,
  HiOutlinePhoto,
  HiOutlineLink,
  HiOutlineSparkles,
  HiOutlineEye,
  HiXMark,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../../../services/bannerService';
import '../AdminManagement.css';
import './ManageBanners.css';

const PRESET_BANNERS = [
  { id: 'p1', name: 'Hero 1 - Atelier 2026', url: '/images/hero-banner-1.jpg' },
  { id: 'p2', name: 'Hero 2 - Beta-Titanium', url: '/images/hero-banner-2.jpg' },
  { id: 'p3', name: 'Hero 3 - Mediterranean Sun', url: '/images/hero-banner-3.jpg' },
  { id: 'p4', name: 'Hero 4 - Mazzucchelli Acetate', url: '/images/hero-banner-4.jpg' },
  { id: 'p5', name: 'Hero 5 - Digital Blue-Light', url: '/images/hero-banner-5.jpg' },
  { id: 'p6', name: 'Banner - Titanium Minimal', url: '/images/banner-titanium.jpg' },
  { id: 'p7', name: 'Banner - Sunwear Archive', url: '/images/banner-sunglasses.jpg' },
  { id: 'p8', name: 'Banner - Acetate Studio', url: '/images/banner-acetate.jpg' },
  { id: 'p9', name: 'Banner - Digital Screen', url: '/images/banner-screen.jpg' },
  { id: 'p10', name: 'Banner - Bespoke Anatomy', url: '/images/banner-bespoke.jpg' },
  { id: 'p11', name: 'Banner - Signature Finale', url: '/images/banner-finale.jpg' },
];

const SECTIONS = [
  { id: 'hero', label: 'Hero Slider' },
  { id: 'categories', label: 'Categories' },
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'finale', label: 'Finale' },
  { id: 'all', label: 'All Banners' },
];

const EMPTY_BANNER = {
  title: '',
  subtitle: '',
  badge: 'NEW COLLECTION 2026',
  cta_text: 'Explore Collection',
  cta_link: '/shop',
  section: 'hero',
  sort_order: 1,
  is_active: true,
  image_url: '/images/hero-banner-1.jpg',
};

export default function ManageBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_BANNER);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Image source modes: 'presets' | 'upload' | 'url'
  const [imageSource, setImageSource] = useState('presets');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getAdminBanners(activeTab);
      setBanners(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [activeTab]);

  const resetForm = () => {
    setForm(EMPTY_BANNER);
    setEditingId(null);
    setSelectedFile(null);
    setFilePreview(null);
    setShowModal(false);
  };

  const handleOpenCreate = () => {
    const nextOrder = banners.length + 1;
    setForm({
      ...EMPTY_BANNER,
      section: activeTab === 'all' ? 'hero' : activeTab,
      sort_order: nextOrder,
    });
    setEditingId(null);
    setSelectedFile(null);
    setFilePreview(null);
    setImageSource('presets');
    setShowModal(true);
  };

  const handleEdit = (b) => {
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      badge: b.badge || '',
      cta_text: b.cta_text || 'Explore Collection',
      cta_link: b.cta_link || '/shop',
      section: b.section || 'hero',
      sort_order: b.sort_order || 1,
      is_active: b.is_active,
      image_url: b.image_url,
    });
    setEditingId(b.id);
    setSelectedFile(null);
    setFilePreview(null);
    setImageSource(
      PRESET_BANNERS.some((p) => p.url === b.image_url) ? 'presets' : 'url'
    );
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      return toast.error('Banner title is required.');
    }

    const currentImg = filePreview || form.image_url;
    if (!selectedFile && (!currentImg || !currentImg.trim())) {
      return toast.error('Please choose or upload a banner image.');
    }

    setSaving(true);
    try {
      if (selectedFile) {
        // Submit multipart form data
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('subtitle', form.subtitle);
        fd.append('badge', form.badge);
        fd.append('cta_text', form.cta_text);
        fd.append('cta_link', form.cta_link);
        fd.append('section', form.section);
        fd.append('sort_order', form.sort_order);
        fd.append('is_active', form.is_active);
        fd.append('image', selectedFile);

        if (editingId) {
          await updateBanner(editingId, fd);
          toast.success('Banner updated with new image.');
        } else {
          await createBanner(fd);
          toast.success('New banner created.');
        }
      } else {
        // Submit JSON payload
        if (editingId) {
          await updateBanner(editingId, form);
          toast.success('Banner updated.');
        } else {
          await createBanner(form);
          toast.success('New banner created.');
        }
      }

      resetForm();
      fetchBanners();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save banner.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (b) => {
    try {
      // Optimistic update
      setBanners((prev) =>
        prev.map((item) =>
          item.id === b.id ? { ...item, is_active: !item.is_active } : item
        )
      );
      await toggleBannerStatus(b.id);
      toast.success(
        `Banner "${b.title}" is now ${!b.is_active ? 'Active' : 'Inactive'}`
      );
    } catch {
      toast.error('Failed to update status');
      fetchBanners();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBanner(deleteTarget.id);
      toast.success('Banner deleted.');
      setDeleteTarget(null);
      fetchBanners();
    } catch {
      toast.error('Failed to delete banner.');
    }
  };

  // Preview Image resolution
  const activePreviewImage = filePreview || form.image_url || '/images/hero-banner-1.jpg';

  return (
    <div className="admin-page" id="admin-banners-view">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Banners & Hero Slider</h1>
          <p className="admin-page-subtitle">
            Curate and customize hero carousel banners, promotional slides, and storefront hero sections
          </p>
        </div>
        {!showModal && (
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenCreate}
            id="admin-create-banner-btn"
          >
            <HiOutlinePlus size={16} /> Create Banner
          </button>
        )}
      </div>

      {/* Section Tabs */}
      <div className="banner-tabs" role="tablist">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            role="tab"
            aria-selected={activeTab === sec.id}
            className={`banner-tab-btn ${activeTab === sec.id ? 'active' : ''}`}
            onClick={() => setActiveTab(sec.id)}
          >
            {sec.label}
            {activeTab === sec.id && (
              <span className="banner-tab-count">{banners.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Banners Table */}
      <div className="admin-table-wrap">
        <table className="admin-mgmt-table">
          <thead>
            <tr>
              <th>Preview & Title</th>
              <th>Placement</th>
              <th>Badge</th>
              <th>CTA Action</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  Loading banners...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  No banners found in this section. Click "+ Create Banner" to add one!
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="banner-cell-preview">
                      <img
                        src={b.image_url}
                        alt={b.title}
                        className="banner-thumb"
                        onError={(e) => {
                          e.target.src = '/images/hero-banner-1.jpg';
                        }}
                      />
                      <div className="banner-info">
                        <span className="banner-title-text">{b.title}</span>
                        {b.subtitle && (
                          <span className="banner-sub-text">{b.subtitle}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline" style={{ textTransform: 'capitalize' }}>
                      {b.section}
                    </span>
                  </td>
                  <td>
                    {b.badge ? (
                      <span className="banner-badge-tag">{b.badge}</span>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.75rem', color: '#111827' }}>
                        {b.cta_text || 'Explore'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                        {b.cta_link || '/shop'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#374151' }}>
                      #{b.sort_order}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`banner-toggle-btn ${b.is_active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggle(b)}
                      title="Click to toggle active state"
                    >
                      {b.is_active ? '● Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td className="admin-actions">
                    <button
                      type="button"
                      className="admin-btn-sm"
                      onClick={() => handleEdit(b)}
                      title="Edit Banner"
                    >
                      <HiOutlinePencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="admin-btn-sm admin-btn-danger"
                      onClick={() => setDeleteTarget(b)}
                      title="Delete Banner"
                    >
                      <HiOutlineTrash size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal with LIVE Storefront Preview */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={resetForm}>
          <div
            className="admin-modal banner-modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={resetForm}
              aria-label="Close modal"
            >
              <HiXMark size={20} />
            </button>

            <h2 className="admin-modal-title">
              {editingId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
            </h2>

            <div className="banner-editor-split">
              {/* Left Column: Form Controls */}
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Banner Title *</label>
                  <input
                    className="admin-form-input"
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder="e.g. Architectural Atelier Eyewear"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Subtitle / Description</label>
                  <textarea
                    className="admin-form-input"
                    rows={2}
                    value={form.subtitle}
                    onChange={(e) => setField('subtitle', e.target.value)}
                    placeholder="e.g. Precision minimalist silhouettes sculpted with timeless Japanese engineering."
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Badge Tagline</label>
                    <input
                      className="admin-form-input"
                      value={form.badge}
                      onChange={(e) => setField('badge', e.target.value.toUpperCase())}
                      placeholder="e.g. NEW COLLECTION 2026"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Placement Section</label>
                    <select
                      className="admin-form-select"
                      value={form.section}
                      onChange={(e) => setField('section', e.target.value)}
                    >
                      <option value="hero">Hero Slider (Home)</option>
                      <option value="categories">Categories Banner</option>
                      <option value="anatomy">Anatomy Guide Banner</option>
                      <option value="finale">Finale Showcase Banner</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">CTA Button Text</label>
                    <input
                      className="admin-form-input"
                      value={form.cta_text}
                      onChange={(e) => setField('cta_text', e.target.value)}
                      placeholder="e.g. Explore Collection"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">CTA Link Target</label>
                    <input
                      className="admin-form-input"
                      value={form.cta_link}
                      onChange={(e) => setField('cta_link', e.target.value)}
                      placeholder="e.g. /shop?material=Titanium"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Display Order</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={form.sort_order}
                      onChange={(e) => setField('sort_order', e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-form-select"
                      value={form.is_active ? 'true' : 'false'}
                      onChange={(e) => setField('is_active', e.target.value === 'true')}
                    >
                      <option value="true">Active (Visible)</option>
                      <option value="false">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Banner Image Selection Options */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Banner Image Source</label>
                  <div className="image-source-nav">
                    <button
                      type="button"
                      className={`image-source-btn ${imageSource === 'presets' ? 'active' : ''}`}
                      onClick={() => setImageSource('presets')}
                    >
                      <HiOutlineSparkles size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Atelier Presets
                    </button>
                    <button
                      type="button"
                      className={`image-source-btn ${imageSource === 'upload' ? 'active' : ''}`}
                      onClick={() => setImageSource('upload')}
                    >
                      <HiOutlineArrowUpTray size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Upload File
                    </button>
                    <button
                      type="button"
                      className={`image-source-btn ${imageSource === 'url' ? 'active' : ''}`}
                      onClick={() => setImageSource('url')}
                    >
                      <HiOutlineLink size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Image URL
                    </button>
                  </div>

                  {imageSource === 'presets' && (
                    <div className="preset-grid">
                      {PRESET_BANNERS.map((preset) => (
                        <div
                          key={preset.id}
                          className={`preset-item ${form.image_url === preset.url && !selectedFile ? 'selected' : ''}`}
                          onClick={() => {
                            setField('image_url', preset.url);
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} />
                          <span className="preset-item-label">{preset.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {imageSource === 'upload' && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <div
                        className="banner-upload-box"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <HiOutlinePhoto size={28} className="banner-upload-icon" />
                        <p className="banner-upload-text">
                          {selectedFile
                            ? selectedFile.name
                            : 'Click to browse image from computer'}
                        </p>
                        <span className="banner-upload-sub">
                          Recommended ratio 16:9 or 2.7:1 (PNG, JPG, WEBP)
                        </span>
                      </div>
                    </div>
                  )}

                  {imageSource === 'url' && (
                    <input
                      className="admin-form-input"
                      value={form.image_url}
                      onChange={(e) => {
                        setField('image_url', e.target.value);
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      placeholder="Paste full image URL (https://...)"
                    />
                  )}
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-btn-cancel"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>

              {/* Right Column: Real-Time Live Storefront Preview */}
              <div className="live-preview-panel">
                <div className="live-preview-header">
                  <span className="live-preview-title">
                    <span className="live-preview-indicator" /> Live Storefront Preview
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                    1:1 Customer Simulation
                  </span>
                </div>

                <div className="live-preview-frame">
                  <img
                    src={activePreviewImage}
                    alt={form.title || 'Banner Preview'}
                    className="live-preview-img"
                    onError={(e) => {
                      e.target.src = '/images/hero-banner-1.jpg';
                    }}
                  />
                  <div className="live-preview-scrim" />

                  {/* Floating Editorial Card Simulation */}
                  <div className="live-preview-card">
                    {form.badge && (
                      <span className="live-preview-badge">{form.badge}</span>
                    )}
                    <h3 className="live-preview-heading">
                      {form.title || 'Untitled Banner'}
                    </h3>
                    {form.subtitle && (
                      <p className="live-preview-sub">{form.subtitle}</p>
                    )}
                    <div className="live-preview-cta">
                      <span>{form.cta_text || 'Explore'}</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

                <div className="live-preview-note">
                  💡 <strong>Real-time Synchronized Preview</strong>: Any change to badge, title, subtitle, CTA button, or image updates this preview immediately as customers will view it in the hero carousel.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="admin-modal confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="admin-modal-title">Delete Banner</h2>
            <p className="confirm-message">
              Are you sure you want to delete banner{' '}
              <strong>"{deleteTarget.title}"</strong>? This will remove it from the
              storefront hero carousel.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="admin-btn-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
