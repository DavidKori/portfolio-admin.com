import React, { useState, useEffect } from 'react';
import { socialLinksAPI } from '../api/axios';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import { SOCIAL_PLATFORMS } from '../utils/constants';
import { validateUrl } from '../utils/validators';
import '../styles/section.css';

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    iconUrl: ''
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await socialLinksAPI.getAll();
      setSocialLinks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.platform) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!formData.url) {
      newErrors.url = 'URL is required';
    } else if (!validateUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }
    
    try {
      if (editingLink) {
        const response = await socialLinksAPI.update(editingLink._id, formData);
        setSocialLinks(prev => prev.map(link => 
          link._id === editingLink._id ? response.data : link
        ));
        showSuccess('Social link updated successfully');
      } else {
        const response = await socialLinksAPI.create(formData);
        setSocialLinks(prev => [...prev, response.data]);
        showSuccess('Social link added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save social link');
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      iconUrl: link.iconUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    
    try {
      await socialLinksAPI.delete(linkToDelete._id);
      setSocialLinks(prev => prev.filter(link => link._id !== linkToDelete._id));
      showSuccess('Social link deleted successfully');
    } catch (error) {
      showError('Failed to delete social link');
    } finally {
      setLinkToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      iconUrl: ''
    });
    setEditingLink(null);
    setErrors({});
  };

  const getPlatformIcon = (platform) => {
    const platformData = SOCIAL_PLATFORMS.find(p => p.value === platform);
    return platformData ? platformData.icon : '🔗';
  };

  if (loading) {
    return <div className="section-loading">Loading social links...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Social Links</h1>
        <p>Manage your social media and professional profile links</p>
      </div>

      <div className="section-content">
        <div className="section-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Social Link
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingLink ? 'Edit Social Link' : 'Add New Social Link'}</h2>
            
            <form onSubmit={handleSubmit}>
              <FormField
                label="Platform"
                type="select"
                value={formData.platform}
                onChange={(value) => handleInputChange('platform', value)}
                options={SOCIAL_PLATFORMS.map(platform => ({
                  value: platform.value,
                  label: `${platform.icon} ${platform.label}`
                }))}
                required
                error={errors.platform}
              />
              
              <FormField
                label="Profile URL"
                type="url"
                value={formData.url}
                onChange={(value) => handleInputChange('url', value)}
                placeholder="https://github.com/username"
                required
                error={errors.url}
                helperText="Enter your full profile URL"
              />
              
              <FormField
                label="Custom Icon URL (Optional)"
                type="url"
                value={formData.iconUrl}
                onChange={(value) => handleInputChange('iconUrl', value)}
                placeholder="https://example.com/icon.png"
                helperText="Optional: Custom icon URL. Leave blank to use platform default."
              />
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {editingLink ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-grid">
          {socialLinks.map((link) => {
            const platformData = SOCIAL_PLATFORMS.find(p => p.value === link.platform);
            return (
              <div key={link._id} className="item-card social-card">
                <div className="social-icon">
                  {link.iconUrl ? (
                    <img src={link.iconUrl} alt={link.platform} />
                  ) : (
                    <span className="platform-icon">
                      {getPlatformIcon(link.platform)}
                    </span>
                  )}
                </div>
                
                <div className="item-content">
                  <h3 className="item-title">
                    {platformData ? platformData.label : link.platform}
                  </h3>
                  
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-url"
                  >
                    {link.url}
                  </a>
                  
                  <div className="item-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(link)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => {
                        setLinkToDelete(link);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {socialLinks.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>No Social Links Yet</h3>
            <p>Add your social media and professional profile links</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Social Link
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Social Link"
        message="Are you sure you want to delete this social link? This action cannot be undone."
        confirmText="Delete Social Link"
      />
    </div>
  );
};

export default SocialLinks;