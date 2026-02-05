import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../api/axios';
import MediaUploader from '../components/MediaUploader';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const Resume = () => {
  const [resume, setResume] = useState({
    resumePdfUrl: '',
    education: [],
    experience: [],
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.get();
      setResume(response.data || resume);
      console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (formData) => {
    setUploadingResume(true);
    try {
      const response = await resumeAPI.uploadResume(formData);
      setResume(prev => ({ ...prev, resumePdfUrl: response.data.url }));
      showSuccess('Resume uploaded successfully');
      return response.data;
    } catch (error) {
      showError('Failed to upload resume');
      throw error;
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSyncData = async () => {
    setSaving(true);
    try {
      // This would typically sync with other sections
      // For now, we'll just update the resume with current data
      await resumeAPI.update(resume);
      showSuccess('Resume data synced successfully');
    } catch (error) {
      showError('Failed to sync resume data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading resume...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Resume Management</h1>
        <p>Manage your downloadable resume and CV</p>
      </div>

      <div className="section-content">
        <div className="form-card">
          <h2>Upload Resume</h2>
          <p className="helper-text">
            Upload a PDF version of your resume. This will be available for download on your portfolio.
          </p>
          
          <MediaUploader
            label="Resume/CV File (PDF)"
            onUpload={handleResumeUpload}
            accept=".pdf"
            existingUrl={resume.resumePdfUrl}
            helperText="Upload a PDF file of your resume (max 10MB)"
          />
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleSyncData}
              disabled={saving || uploadingResume}
            >
              {saving ? 'Syncing...' : 'Sync with Other Sections'}
            </button>
          </div>
        </div>

        <div className="resume-preview">
          <h2>Resume Preview</h2>
          
          <div className="resume-sections">
            <div className="resume-section">
              <h3>📄 Resume File</h3>
              {resume.resumePdfUrl ? (
                <div className="resume-file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <div className="file-name">Resume.pdf</div>
                    <a 
                      href={resume.resumePdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              ) : (
                <div className="no-resume">
                  <p>No resume uploaded yet.</p>
                  <p className="helper-text">Upload a PDF resume to make it available for download.</p>
                </div>
              )}
            </div>
            
            <div className="resume-section">
              <h3>🎓 Education</h3>
              <div className="section-count">
                {resume.editation?.length || 0} entries
              </div>
              <p className="helper-text">
                Education data is synced from the Education section.
              </p>
            </div>
            
            <div className="resume-section">
              <h3>💼 Experience</h3>
              <div className="section-count">
                {resume.experience?.length || 0} entries
              </div>
              <p className="helper-text">
                Experience data is synced from the Experience section.
              </p>
            </div>
            
            <div className="resume-section">
              <h3>⚡ Skills</h3>
              <div className="section-count">
                {resume.skills?.length || 0} categories
              </div>
              <p className="helper-text">
                Skills data is synced from the Skills section.
              </p>
            </div>
          </div>
          
          <div className="resume-tips">
            <h4>💡 Resume Tips:</h4>
            <ul>
              <li>Keep your resume updated with your latest experience</li>
              <li>Use a clean, professional PDF format</li>
              <li>Include relevant keywords for your industry</li>
              <li>Update your resume quarterly with new achievements</li>
              <li>Sync regularly to include data from other sections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;