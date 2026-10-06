import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCheck, HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [pwForm, setPwForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      // Update token & user in context
      if (res.data.token) localStorage.setItem('token', res.data.token);
      if (res.data.user && updateUser) updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPw(true);
    try {
      await api.put('/auth/password', {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      toast.success('Password changed successfully');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="profile-page" id="profile-view">
      <div className="profile-container">
        <Link to="/account" className="profile-back-link">
          <HiArrowLeft size={14} />
          <span>Back to Account</span>
        </Link>

        <header className="profile-header">
          <span className="editorial-eyebrow">Your Account</span>
          <h1 className="profile-title">PROFILE SETTINGS</h1>
        </header>

        {/* Profile Form */}
        <section className="profile-section">
          <h2 className="profile-section-title">Personal Information</h2>
          <form onSubmit={handleProfileSave} className="profile-form">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                type="text"
                id="profile-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Your full name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <input
                type="email"
                id="profile-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="your.email@domain.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Contact Telephone</label>
              <input
                type="tel"
                id="profile-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+880 1XXXXXXXXX"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-editorial btn-sm profile-save-btn"
            >
              <HiCheck size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </section>

        {/* Password Form */}
        <section className="profile-section">
          <h2 className="profile-section-title">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="profile-form">
            <div className="form-group">
              <label className="form-label" htmlFor="current-pw">Current Password</label>
              <input
                type="password"
                id="current-pw"
                name="current_password"
                value={pwForm.current_password}
                onChange={handlePwChange}
                className="form-input"
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-pw">New Password</label>
              <input
                type="password"
                id="new-pw"
                name="new_password"
                value={pwForm.new_password}
                onChange={handlePwChange}
                className="form-input"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-pw">Confirm New Password</label>
              <input
                type="password"
                id="confirm-pw"
                name="confirm_password"
                value={pwForm.confirm_password}
                onChange={handlePwChange}
                className="form-input"
                placeholder="Repeat new password"
              />
            </div>

            <button
              type="submit"
              disabled={changingPw}
              className="btn-editorial btn-sm profile-save-btn"
            >
              <span>{changingPw ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
