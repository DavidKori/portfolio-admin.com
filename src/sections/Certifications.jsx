import React, { useState, useEffect } from 'react';
import { certificationsAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import { YEARS } from '../utils/constants';
import '../styles/section.css';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({
    certificate: false,
    image: false
  });
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: new Date().getFullYear().toString(),
    certificateUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await certificationsAPI.getAll();
      setCertifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (formData, type) => {
    setUploadingFiles(prev => ({ ...prev, [type]: true }));
    try {
      const response = await certificationsAPI.uploadCertificate(formData);
      handleInputChange(type, response.data.url);
      showSuccess(`Certificate uploaded successfully`);
      return response.data;
    } catch (error) {
      showError(`Failed to upload ${type === 'certificateUrl' ? 'certificate' : 'image'}`);
      throw error;
    } finally {
      setUploadingFiles(prev => ({ ...prev, [type]: false }));
    }
  };
    const handleBadgeUpload = async (formData, type) => {
    setUploadingFiles(prev => ({ ...prev, [type]: true }));
    try {
      const response = await certificationsAPI.uploadCertificateBadge(formData);
      handleInputChange(type, response.data.url);
      showSuccess(`Badge uploaded successfully`);
      return response.data;
    } catch (error) {
      showError(`Failed to upload ${type === 'certificateUrl' ? 'certificate' : 'image'}`);
      throw error;
    } finally {
      setUploadingFiles(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCert) {
        const response = await certificationsAPI.update(editingCert._id, formData);
        setCertifications(prev => prev.map(c => 
          c._id === editingCert._id ? response.data : c
        ));
        showSuccess('Certification updated successfully');
      } else {
        const response = await certificationsAPI.create(formData);
        setCertifications(prev => [...prev, response.data]);
        showSuccess('Certification added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save certification');
    }
  };

  const handleEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      certificateUrl: cert.certificateUrl || '',
      imageUrl: cert.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!certToDelete) return;
    
    try {
      await certificationsAPI.delete(certToDelete._id);
      setCertifications(prev => prev.filter(c => c._id !== certToDelete._id));
      showSuccess('Certification deleted successfully');
    } catch (error) {
      showError('Failed to delete certification');
    } finally {
      setCertToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      year: new Date().getFullYear().toString(),
      certificateUrl: '',
      imageUrl: ''
    });
    setEditingCert(null);
  };

  if (loading) {
    return <div className="section-loading">Loading certifications...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Certifications</h1>
        <p>Manage your professional certifications and badges</p>
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
            + Add Certification
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingCert ? 'Edit Certification' : 'Add New Certification'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <FormField
                  label="Certification Title"
                  value={formData.title}
                  onChange={(value) => handleInputChange('title', value)}
                  required
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
                
                <FormField
                  label="Issuing Organization"
                  value={formData.issuer}
                  onChange={(value) => handleInputChange('issuer', value)}
                  required
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              
              <FormField
                label="Year Obtained"
                type="select"
                value={formData.year}
                onChange={(value) => handleInputChange('year', value)}
                options={YEARS.map(year => ({ value: year.toString(), label: year.toString() }))}
                required
              />
              
              <div className="media-grid">
                <MediaUploader
                  label="Certificate File"
                  onUpload={(formData) => handleFileUpload(formData, 'certificateUrl')}
                  accept=".pdf,.jpg,.jpeg,.png"
                  existingUrl={formData.certificateUrl}
                  helperText="Upload your certificate PDF or image"
                />
                
                <MediaUploader
                  label="Badge/Logo Image"
                  onUpload={(formData) => handleBadgeUpload(formData, 'imageUrl')}
                  accept="image/*"
                  existingUrl={formData.imageUrl}
                  helperText="Optional: Certification badge or issuer logo"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={uploadingFiles.certificate || uploadingFiles.image}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={uploadingFiles.certificate || uploadingFiles.image}
                >
                  {uploadingFiles.certificate || uploadingFiles.image 
                    ? 'Uploading...' 
                    : (editingCert ? 'Update' : 'Create')
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-grid">
          {certifications.map((cert) => (
            <div key={cert._id} className="item-card">
              <div className="item-header">
                <div className="item-image">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.title} />
                  ) : (
                    <div className="default-badge">📜</div>
                  )}
                </div>
                <div className="item-year">{cert.year}</div>
              </div>
              
              <div className="item-content">
                <h3 className="item-title">{cert.title}</h3>
                <div className="item-subtitle">Issued by: {cert.issuer}</div>
                
                <div className="item-actions">
                  {cert.certificateUrl && (
                    <a 
                      href={cert.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-certificate"
                    >
                      View Certificate
                    </a>
                  )}
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(cert)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      setCertToDelete(cert);
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

        {certifications.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <h3>No Certifications Yet</h3>
            <p>Add your professional certifications and badges</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Certification
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This action cannot be undone."
        confirmText="Delete Certification"
      />
    </div>
  );
};

export default Certifications;