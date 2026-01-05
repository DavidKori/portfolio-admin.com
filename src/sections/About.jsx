import React, { useState, useEffect } from 'react';
import { aboutAPI } from '../api/axios';
import FormField from '../components/FormField';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const About = () => {
  const [about, setAbout] = useState({
    bio: '',
    highlights: ['']
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await aboutAPI.get();
      const data = response.data || about;
      setAbout({
        bio: data.bio || '',
        highlights: data.highlights?.length > 0 ? data.highlights : ['']
      });
    } catch (error) {
      console.error('Failed to fetch about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAbout(prev => ({ ...prev, [field]: value }));
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...about.highlights];
    newHighlights[index] = value;
    setAbout(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setAbout(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index) => {
    if (about.highlights.length > 1) {
      const newHighlights = about.highlights.filter((_, i) => i !== index);
      setAbout(prev => ({ ...prev, highlights: newHighlights }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSend = {
      bio: about.bio,
      highlights: about.highlights.filter(h => h.trim() !== '')
    };
    
    try {
      await aboutAPI.update(dataToSend);
      showSuccess('About section updated successfully');
    } catch (error) {
      showError('Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading about section...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>About Section</h1>
        <p>Tell your story and highlight key achievements</p>
      </div>

      <div className="section-content">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <FormField
              label="About Summary"
              value={about.bio}
              onChange={(value) => handleChange('bio', value)}
              multiline
              rows={6}
              required
              placeholder="Write a compelling summary about yourself, your journey, and what makes you unique..."
              helperText="This will be the main about text on your portfolio"
            />

            <div className="highlights-section">
              <label className="form-label">
                Key Highlights
                <span className="helper-text">(Bullet points that will stand out)</span>
              </label>
              
              {about.highlights.map((highlight, index) => (
                <div key={index} className="highlight-input">
                  <FormField
                    value={highlight}
                    onChange={(value) => handleHighlightChange(index, value)}
                    placeholder={`Highlight ${index + 1} (e.g., "Built scalable applications for 50K+ users")`}
                  />
                  {about.highlights.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeHighlight(index)}
                      title="Remove highlight"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-btn"
                onClick={addHighlight}
              >
                + Add Another Highlight
              </button>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save About Section'}
              </button>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <h2>Preview</h2>
          <div className="preview-card">
            <h3>About Me</h3>
            <p className="preview-summary">
              {about.bio || 'Your about bio will appear here...'}
            </p>
            
            <div className="preview-highlights">
              <h4>Key Highlights:</h4>
              <ul>
                {about.highlights.filter(h => h.trim() !== '').map((highlight, index) => (
                  <li key={index}>• {highlight || `Highlight ${index + 1}`}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;