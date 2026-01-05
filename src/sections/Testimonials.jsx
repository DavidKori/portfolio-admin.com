import React, { useState, useEffect } from 'react';
import { testimonialsAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    message: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (formData) => {
    setUploadingImage(true);
    try {
      const response = await testimonialsAPI.uploadImage(formData);
      handleInputChange('imageUrl', response.data.url);
      showSuccess('Profile image uploaded successfully');
      return response.data;
    } catch (error) {
      showError('Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTestimonial) {
        const response = await testimonialsAPI.update(editingTestimonial._id, formData);
        setTestimonials(prev => prev.map(t => 
          t._id === editingTestimonial._id ? response.data : t
        ));
        showSuccess('Testimonial updated successfully');
      } else {
        const response = await testimonialsAPI.create(formData);
        setTestimonials(prev => [...prev, response.data]);
        showSuccess('Testimonial added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
      imageUrl: testimonial.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    
    try {
      await testimonialsAPI.delete(testimonialToDelete._id);
      setTestimonials(prev => prev.filter(t => t._id !== testimonialToDelete._id));
      showSuccess('Testimonial deleted successfully');
    } catch (error) {
      showError('Failed to delete testimonial');
    } finally {
      setTestimonialToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      message: '',
      imageUrl: ''
    });
    setEditingTestimonial(null);
  };

  if (loading) {
    return <div className="section-loading">Loading testimonials...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Testimonials</h1>
        <p>Manage reviews and feedback from clients and colleagues</p>
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
            + Add Testimonial
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <FormField
                  label="Person's Name"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  required
                  placeholder="e.g., John Smith"
                />
                
                <FormField
                  label="Role/Position"
                  value={formData.role}
                  onChange={(value) => handleInputChange('role', value)}
                  required
                  placeholder="e.g., Project Manager at Google"
                />
              </div>
              
              <FormField
                label="Testimonial Message"
                value={formData.message}
                onChange={(value) => handleInputChange('message', value)}
                multiline
                rows={4}
                placeholder="Their feedback about working with you..."
                required
              />
              
              <MediaUploader
                label="Profile Image (Optional)"
                onUpload={handleImageUpload}
                accept="image/*"
                existingUrl={formData.imageUrl}
                helperText="Upload the person's profile picture"
              />
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={uploadingImage}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : (editingTestimonial ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="item-card testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-message">{testimonial.message}</p>
              </div>
              
              <div className="testimonial-author">
                <div className="author-image">
                  {testimonial.imageUrl ? (
                    <img src={testimonial.imageUrl} alt={testimonial.name} />
                  ) : (
                    <div className="author-initials">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="item-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(testimonial)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => {
                    setTestimonialToDelete(testimonial);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No Testimonials Yet</h3>
            <p>Add feedback from clients and colleagues to build trust</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Testimonial
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete Testimonial"
      />
    </div>
  );
};

export default Testimonials;