import { useState, useEffect, useRef } from 'react';
import {
  HiXMark,
  HiOutlinePhoto,
  HiOutlineArrowUpTray,
  HiOutlineTrash,
  HiOutlineStar,
  HiStar,
  HiOutlineLink,
  HiOutlineCheck,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import './ProductImageModal.css';

export default function ProductImageModal({ product, isOpen, onClose, onProductUpdated }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch images when modal opens
  const fetchImages = async () => {
    if (!product?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/products/${product.id}`);
      setImages(res.data.data.images || []);
    } catch (err) {
      console.error('Failed to fetch product images:', err);
      // Fallback try public endpoint
      try {
        const res2 = await api.get(`/products/${product.id}`);
        setImages(res2.data.data.images || []);
      } catch (e) {
        toast.error('Could not load existing product images');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && product?.id) {
      fetchImages();
      setUrlInput('');
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  // Copy SKU to clipboard
  const handleCopySku = () => {
    if (product.sku) {
      navigator.clipboard.writeText(product.sku);
      setCopiedSku(true);
      toast.success(`Copied Model No: ${product.sku}`);
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  // Upload file(s)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length + images.length > 8) {
      toast.error('Maximum 8 images allowed per product');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
      await api.post(`/admin/products/${product.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Images uploaded successfully!', { id: toastId });
      await fetchImages();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload images', { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Image by URL
  const handleAddUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setAddingUrl(true);
    try {
      await api.post(`/admin/products/${product.id}/images/url`, {
        imageUrl: urlInput.trim(),
        alt_text: `${product.brand || 'Drishti'} ${product.sku || product.name}`,
      });
      toast.success('Image URL attached successfully!');
      setUrlInput('');
      await fetchImages();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add image URL');
    } finally {
      setAddingUrl(false);
    }
  };

  // Set Primary Image
  const handleSetPrimary = async (imageId) => {
    try {
      await api.put(`/admin/products/${product.id}/images/${imageId}/primary`);
      toast.success('Primary image updated!');
      await fetchImages();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set primary image');
    }
  };

  // Delete Image
  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/admin/products/${product.id}/images/${imageId}`);
      toast.success('Image removed');
      await fetchImages();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove image');
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="product-image-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="image-modal-header">
          <div>
            <div className="image-modal-badges">
              <span className="image-modal-brand">{product.brand || 'Atelier'}</span>
              <button
                type="button"
                className="image-modal-sku-btn"
                onClick={handleCopySku}
                title="Click to copy Model No"
              >
                Model No: <strong>{product.sku || 'N/A'}</strong>
                {copiedSku ? <HiOutlineCheck size={13} color="#22c55e" /> : <HiOutlineDocumentDuplicate size={13} />}
              </button>
            </div>
            <h2 className="image-modal-title">{product.name}</h2>
            <p className="image-modal-subtitle">
              Price: ৳{parseFloat(product.price).toLocaleString()} • Stock: {product.stock} • Current Images: {images.length}
            </p>
          </div>
          <button type="button" className="image-modal-close-btn" onClick={onClose}>
            <HiXMark size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="image-modal-body">
          {/* Section 1: Current Gallery */}
          <div className="image-modal-section">
            <h3 className="section-label">
              <HiOutlinePhoto size={16} /> Attached Images ({images.length})
            </h3>

            {loading ? (
              <div className="image-modal-loading">Loading gallery...</div>
            ) : images.length === 0 ? (
              <div className="image-modal-empty">
                <div className="empty-icon-wrap">
                  <HiOutlinePhoto size={36} />
                </div>
                <h4>No images attached yet</h4>
                <p>
                  Search this product by Model No <code>{product.sku}</code> anytime and upload high-res frames below.
                </p>
              </div>
            ) : (
              <div className="image-grid">
                {images.map((img) => (
                  <div key={img.id} className={`image-card ${img.is_primary ? 'is-primary' : ''}`}>
                    <img src={img.image_url} alt={img.alt_text || product.name} className="image-preview" />
                    <div className="image-card-bar">
                      {img.is_primary ? (
                        <span className="primary-pill">
                          <HiStar size={13} /> Primary
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="set-primary-btn"
                          onClick={() => handleSetPrimary(img.id)}
                          title="Set as primary thumbnail"
                        >
                          <HiOutlineStar size={13} /> Make Primary
                        </button>
                      )}
                      <button
                        type="button"
                        className="delete-img-btn"
                        onClick={() => handleDeleteImage(img.id)}
                        title="Delete image"
                      >
                        <HiOutlineTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Upload Files */}
          <div className="image-modal-section upload-box">
            <h3 className="section-label">
              <HiOutlineArrowUpTray size={16} /> Upload New Images
            </h3>
            <div className="dropzone-area" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/jpg"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <div className="dropzone-content">
                <div className="dropzone-icon">
                  <HiOutlineArrowUpTray size={24} />
                </div>
                <div className="dropzone-text">
                  <strong>Click to select images</strong> or drag and drop files here
                </div>
                <div className="dropzone-hint">
                  PNG, JPG, WEBP • Max 5MB each • Model: {product.sku}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Add via URL */}
          <div className="image-modal-section">
            <h3 className="section-label">
              <HiOutlineLink size={16} /> Or Attach Image by URL
            </h3>
            <form onSubmit={handleAddUrl} className="url-input-form">
              <input
                type="url"
                className="url-text-input"
                placeholder="https://res.cloudinary.com/... or https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={addingUrl}
              />
              <button type="submit" className="url-submit-btn" disabled={addingUrl || !urlInput.trim()}>
                {addingUrl ? 'Attaching...' : 'Attach URL'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="image-modal-footer">
          <div className="footer-left-info">
            Model SKU: <code>{product.sku}</code>
          </div>
          <button type="button" className="image-modal-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
