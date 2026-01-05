import React, { useState, useEffect } from 'react';
import { achievementsAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import { YEARS } from '../utils/constants';
import '../styles/section.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    iconUrl: ''
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await achievementsAPI.getAll();
      setAchievements(response.data || []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIconUpload = async (formData) => {
    setUploadingIcon(true);
    try {
      const response = await achievementsAPI.uploadIcon(formData);
      handleInputChange('iconUrl', response.data.url);
      showSuccess('Icon uploaded successfully');
      return response.data;
    } catch (error) {
      showError('Failed to upload icon');
      throw error;
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAchievement) {
        const response = await achievementsAPI.update(editingAchievement._id, formData);
        setAchievements(prev => prev.map(a => 
          a._id === editingAchievement._id ? response.data : a
        ));
        showSuccess('Achievement updated successfully');
      } else {
        const response = await achievementsAPI.create(formData);
        setAchievements(prev => [...prev, response.data]);
        showSuccess('Achievement added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save achievement');
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      year: achievement.year,
      iconUrl: achievement.iconUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!achievementToDelete) return;
    
    try {
      await achievementsAPI.delete(achievementToDelete._id);
      setAchievements(prev => prev.filter(a => a._id !== achievementToDelete._id));
      showSuccess('Achievement deleted successfully');
    } catch (error) {
      showError('Failed to delete achievement');
    } finally {
      setAchievementToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear().toString(),
      iconUrl: ''
    });
    setEditingAchievement(null);
  };

  if (loading) {
    return <div className="section-loading">Loading achievements...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Achievements</h1>
        <p>Showcase your awards, recognitions, and milestones</p>
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
            + Add Achievement
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</h2>
            
            <form onSubmit={handleSubmit}>
              <FormField
                label="Title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                required
                placeholder="e.g., Employee of the Year, Hackathon Winner"
              />
              
              <FormField
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                multiline
                rows={3}
                placeholder="Describe the achievement and its significance"
                required
              />
              
              <div className="grid-2">
                <FormField
                  label="Year"
                  type="select"
                  value={formData.year}
                  onChange={(value) => handleInputChange('year', value)}
                  options={YEARS.map(year => ({ value: year.toString(), label: year.toString() }))}
                  required
                />
              </div>
              
              <MediaUploader
                label="Icon or Award Image"
                onUpload={handleIconUpload}
                accept="image/*"
                existingUrl={formData.iconUrl}
                helperText="Optional: Upload an icon or image representing this achievement"
              />
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={uploadingIcon}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={uploadingIcon}
                >
                  {uploadingIcon ? 'Uploading...' : (editingAchievement ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-grid">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="item-card">
              <div className="item-header">
                <div className="item-icon">
                  {achievement.iconUrl ? (
                    <img src={achievement.iconUrl} alt={achievement.title} />
                  ) : (
                    <span className="default-icon">🏆</span>
                  )}
                </div>
                <div className="item-year">{achievement.year}</div>
              </div>
              
              <div className="item-content">
                <h3 className="item-title">{achievement.title}</h3>
                <p className="item-description">{achievement.description}</p>
                
                <div className="item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(achievement)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      setAchievementToDelete(achievement);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No Achievements Yet</h3>
            <p>Add your awards and recognitions to showcase your success</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Achievement
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement? This action cannot be undone."
        confirmText="Delete Achievement"
      />
    </div>
  );
};

export default Achievements;