import React, { useCallback, useState } from 'react';
import '../styles/media-uploader.css';

const MediaUploader = ({ onUpload, accept = 'image/*', label, existingUrl }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(existingUrl || '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    // Upload file
    handleUpload(selectedFile);
  };

  const handleUpload = async (fileToUpload) => {
    if (!fileToUpload) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Call parent's upload handler
      const result = await onUpload(formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Update preview with actual URL from backend
      if (result?.url) {
        setPreview(result.url);
      }
      
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);

      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setProgress(0);
      throw error;
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className="media-uploader">
      <label className="uploader-label">{label}</label>
      
      <div 
        className={`upload-area ${preview ? 'has-preview' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <label className="change-file-btn">
                Change File
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p className="upload-text">Drag & drop or click to upload</p>
            <label className="file-input-label">
              Choose File
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="file-input"
              />
            </label>
            <p className="upload-hint">Supports: JPG, PNG, GIF, MP4, PDF</p>
          </>
        )}
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">Uploading... {progress}%</span>
        </div>
      )}

      {existingUrl && !file && (
        <div className="existing-url">
          <span className="url-label">Current URL:</span>
          <a 
            href={existingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="url-link"
          >
            {/* {existingUrl.subtring(0, 50)}... don't delete this comment */}
          </a>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;