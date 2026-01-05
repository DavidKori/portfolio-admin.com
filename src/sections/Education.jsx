import React, { useState, useEffect } from 'react';
import { educationAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    period: '',
    description: '',
    certificateUrl: ''
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await educationAPI.getAll();
      setEducation(response.data || []);
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificateUpload = async (formData) => {
    setUploadingCertificate(true);
    try {
      const response = await educationAPI.uploadCertificate(formData);
      handleInputChange('certificateUrl', response.data.url);
      showSuccess('Certificate uploaded successfully');
      return response.data;
    } catch (error) {
      showError('Failed to upload certificate');
      throw error;
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const response = await educationAPI.update(editingItem._id, formData);
        setEducation(prev => prev.map(e => 
          e._id === editingItem._id ? response.data : e
        ));
        showSuccess('Education updated successfully');
      } else {
        const response = await educationAPI.create(formData);
        setEducation(prev => [...prev, response.data]);
        showSuccess('Education added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save education');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      period: item.period,
      description: item.description,
      certificateUrl: item.certificateUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await educationAPI.delete(itemToDelete._id);
      setEducation(prev => prev.filter(e => e._id !== itemToDelete._id));
      showSuccess('Education deleted successfully');
    } catch (error) {
      showError('Failed to delete education');
    } finally {
      setItemToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      period: '',
      description: '',
      certificateUrl: ''
    });
    setEditingItem(null);
  };

  if (loading) {
    return <div className="section-loading">Loading education...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Education</h1>
        <p>Manage your academic qualifications and certifications</p>
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
            + Add Education
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingItem ? 'Edit Education' : 'Add New Education'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <FormField
                  label="Degree/Certificate"
                  value={formData.degree}
                  onChange={(value) => handleInputChange('degree', value)}
                  required
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
                
                <FormField
                  label="Institution"
                  value={formData.institution}
                  onChange={(value) => handleInputChange('institution', value)}
                  required
                  placeholder="e.g., University of Technology"
                />
              </div>
              
              <FormField
                label="Period"
                value={formData.period}
                onChange={(value) => handleInputChange('period', value)}
                placeholder="e.g., 2018 - 2022"
                required
                helperText="Format: YYYY - YYYY or YYYY - Present"
              />
              
              <FormField
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                multiline
                rows={4}
                placeholder="Describe your coursework, achievements, and relevant projects..."
              />
              
              <MediaUploader
                label="Certificate (Optional)"
                onUpload={handleCertificateUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                existingUrl={formData.certificateUrl}
                helperText="Upload your degree certificate or transcript"
              />
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={uploadingCertificate}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={uploadingCertificate}
                >
                  {uploadingCertificate ? 'Uploading...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-list">
          {education.map((item) => (
            <div key={item._id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-header">
                  <h3 className="list-item-title">{item.degree}</h3>
                  <span className="list-item-period">{item.period}</span>
                </div>
                
                <div className="list-item-subtitle">{item.institution}</div>
                
                {item.description && (
                  <p className="list-item-description">{item.description}</p>
                )}
                
                {item.certificateUrl && (
                  <a 
                    href={item.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="certificate-link"
                  >
                    📄 View Certificate
                  </a>
                )}
              </div>
              
              <div className="list-item-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => {
                    setItemToDelete(item);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {education.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No Education Added</h3>
            <p>Add your academic qualifications and certifications</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Education
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete Education"
      />
    </div>
  );
};

export default Education;