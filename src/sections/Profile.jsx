import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    professionalTitle: '',
    tagline: '',
    heroImageUrl: '',
    profileImageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data || profile);
      console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (formData, type) => {
    try {
      const response = await profileAPI.uploadImage(formData);
      handleChange(type, response.data.url);
      showSuccess(`Profile image uploaded successfully`);
      return response.data;
    } catch (error) {
      showError('Failed to upload image');
      throw error;
    }
  };
    const handleHeroUpload = async (formData, type) => {
    try {
      const response = await profileAPI.uploadHero(formData);
      handleChange(type, response.data.url);
      showSuccess(`Hero image uploaded successfully`);
      return response.data;
    } catch (error) {
      showError('Failed to upload image');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await profileAPI.update(profile);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading profile...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Profile Management</h1>
        <p>Update your personal information and images</p>
      </div>

      <div className="section-content">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <FormField
                label="Full Name"
                value={profile.fullName || ""}
                onChange={(value) => handleChange('fullName', value)}
                required
                placeholder="John Doe"
              />
              
              <FormField
                label="Professional Title"
                value={profile.professionalTitle || ""}
                onChange={(value) => handleChange('professionalTitle', value)}
                required
                placeholder="Senior Full Stack Developer"
              />
            </div>

            <FormField
              label="Tagline / Short Bio"
              value={profile.tagline || ""}
              onChange={(value) => handleChange('tagline', value)}
              multiline
              rows={2}
              placeholder="Passionate developer creating amazing digital experiences"
              helperText="Short tagline that appears below your name"
            />

            <div className="media-grid">
              <MediaUploader
                label="Hero Image (Large banner image)"
                onUpload={(formData) => handleHeroUpload(formData, 'heroImageUrl')}
                accept="image/*"
                existingUrl={profile.heroImageUrl}
              />
              
              <MediaUploader
                label="Profile Image (Your photo)"
                onUpload={(formData) => handleImageUpload(formData, 'profileImageUrl')}
                accept="image/*"
                existingUrl={profile.profileImageUrl}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <h2>Preview</h2>
          <div className="preview-card">
            <div className="preview-hero">
              {profile.heroImageUrl ? (
                <img src={profile.heroImageUrl} alt="Hero Preview" />
              ) : (
                <div className="preview-placeholder">Hero Image</div>
              )}
            </div>
            
            <div className="preview-profile">
              <div className="preview-avatar">
                {profile.profileImageUrl ? (
                  <img src={profile.profileImageUrl} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">{profile.fullName?.charAt(0) || 'A'}</div>
                )}
              </div>
              
              <div className="preview-info">
                <h3>{profile.fullName || 'My Name'}</h3>
                <p className="preview-title">{profile.professionalTitle || 'My Title'}</p>
                <p className="preview-tagline">{profile.tagline || 'My tagline will appear here'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;