import React, { useState, useEffect } from 'react';
import { experienceAPI } from '../api/axios';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [editingExp, setEditingExp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expToDelete, setExpToDelete] = useState(null);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    period: '',
    description: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await experienceAPI.getAll();
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingExp) {
        const response = await experienceAPI.update(editingExp._id, formData);
        setExperiences(prev => prev.map(exp => 
          exp._id === editingExp._id ? response.data : exp
        ));
        showSuccess('Experience updated successfully');
      } else {
        const response = await experienceAPI.create(formData);
        setExperiences(prev => [...prev, response.data]);
        showSuccess('Experience added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save experience');
    }
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!expToDelete) return;
    
    try {
      await experienceAPI.delete(expToDelete._id);
      setExperiences(prev => prev.filter(exp => exp._id !== expToDelete._id));
      showSuccess('Experience deleted successfully');
    } catch (error) {
      showError('Failed to delete experience');
    } finally {
      setExpToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      role: '',
      company: '',
      period: '',
      description: ''
    });
    setEditingExp(null);
  };

  if (loading) {
    return <div className="section-loading">Loading experiences...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Work Experience</h1>
        <p>Manage your professional work history</p>
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
            + Add Experience
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingExp ? 'Edit Experience' : 'Add New Experience'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <FormField
                  label="Job Title / Role"
                  value={formData.role}
                  onChange={(value) => handleInputChange('role', value)}
                  required
                  placeholder="e.g., Senior Frontend Developer"
                />
                
                <FormField
                  label="Company"
                  value={formData.company}
                  onChange={(value) => handleInputChange('company', value)}
                  required
                  placeholder="e.g., Google Inc."
                />
              </div>
              
              <FormField
                label="Employment Period"
                value={formData.period}
                onChange={(value) => handleInputChange('period', value)}
                placeholder="e.g., June 2020 - Present"
                required
                helperText="Format: Month YYYY - Month YYYY or Month YYYY - Present"
              />
              
              <FormField
                label="Job Description & Responsibilities"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                multiline
                rows={6}
                placeholder="Describe your responsibilities, achievements, and technologies used..."
                required
                helperText="Use bullet points for better readability"
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
                  {editingExp ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={exp._id} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                {index !== experiences.length - 1 && (
                  <div className="timeline-line"></div>
                )}
              </div>
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3 className="timeline-title">{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                
                <div className="timeline-company">{exp.company}</div>
                
                <div className="timeline-description">
                  {exp.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                
                <div className="timeline-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(exp)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      setExpToDelete(exp);
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

        {experiences.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No Work Experience Added</h3>
            <p>Add your professional work history and roles</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Experience
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this work experience? This action cannot be undone."
        confirmText="Delete Experience"
      />
    </div>
  );
};

export default Experience;