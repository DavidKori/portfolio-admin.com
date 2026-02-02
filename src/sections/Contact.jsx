import React, { useState, useEffect } from 'react';
import { contactAPI } from '../api/axios';
import FormField from '../components/FormField';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePhone } from '../utils/validators';
import '../styles/section.css';

const Contact = () => {
  const [contact, setContact] = useState({
    email: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await contactAPI.get();
      setContact(response.data || contact);
    } catch (error) {
      console.error('Failed to fetch contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setContact(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (contact.email && !validateEmail(contact.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (contact.phone && !validatePhone(contact.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
    
    setSaving(true);
    
    try {
      await contactAPI.update(contact);
      showSuccess('Contact information updated successfully');
    } catch (error) {
      showError('Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading contact information...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Contact Information</h1>
        <p>Manage how people can contact you</p>
      </div>

      <div className="section-content">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <FormField
              label="Email Address"
              type="email"
              value={contact.email}
              onChange={(value) => handleChange('email', value)}
              placeholder="you@example.com"
              error={errors.email}
              helperText="This email will be displayed on your portfolio"
            />
            
            <FormField
              label="Phone Number"
              value={contact.phone}
              onChange={(value) => handleChange('phone', value)}
              placeholder="+1 (555) 123-4567"
              error={errors.phone}
              helperText="Optional: Include your phone number if you want calls"
            />
            
            <FormField
              label="Location"
              value={contact.location}
              onChange={(value) => handleChange('location', value)}
              placeholder="San Francisco, CA or Remote"
              helperText="Your city, country, or remote status"
            />
            
            <div className="contact-tips">
              <h4>Privacy Tips:</h4>
              <ul>
                <li>Use a professional email address</li>
                <li>Consider updating your contact information regularly</li>
                <li>Only share phone number if you're comfortable with calls</li>
                <li>Be specific about your location or remote availability</li>
              </ul>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Contact Information'}
              </button>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <h2>Preview</h2>
          <div className="preview-card contact-preview">
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  {contact.email || 'your-email@example.com'}
                </div>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">📱</div>
              <div className="contact-details">
                <div className="contact-label">Phone</div>
                <div className="contact-value">
                  {contact.phone || 'Not provided'}
                </div>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <div className="contact-label">Location</div>
                <div className="contact-value">
                  {contact.location || 'Your location'}
                </div>
              </div>
            </div>
            
            <div className="contact-note">
              <p>Visitors will see this information on your portfolio's contact section.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;