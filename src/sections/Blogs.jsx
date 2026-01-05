import React, { useState, useEffect } from 'react';
import { blogsAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    url: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.getAll();
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
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
      const response = await blogsAPI.uploadImage(formData);
      handleInputChange('imageUrl', response.data.url);
      showSuccess('Blog image uploaded successfully');
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
      if (editingBlog) {
        const response = await blogsAPI.update(editingBlog._id, formData);
        setBlogs(prev => prev.map(b => 
          b._id === editingBlog._id ? response.data : b
        ));
        showSuccess('Blog updated successfully');
      } else {
        const response = await blogsAPI.create(formData);
        setBlogs(prev => [...prev, response.data]);
        showSuccess('Blog added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      showError('Failed to save blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl || '',
      author: blog.author || '',
      date: blog.date.split('T')[0],
      url: blog.url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    
    try {
      await blogsAPI.delete(blogToDelete._id);
      setBlogs(prev => prev.filter(b => b._id !== blogToDelete._id));
      showSuccess('Blog deleted successfully');
    } catch (error) {
      showError('Failed to delete blog');
    } finally {
      setBlogToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      url: ''
    });
    setEditingBlog(null);
  };

  if (loading) {
    return <div className="section-loading">Loading blogs...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Blog Posts</h1>
        <p>Manage your blog posts and articles</p>
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
            + Add Blog Post
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
            
            <form onSubmit={handleSubmit}>
              <FormField
                label="Blog Title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                required
                placeholder="e.g., Building Scalable React Applications"
              />
              
              <FormField
                label="Blog Content"
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                multiline
                rows={10}
                placeholder="Write your blog content here..."
                required
              />
              
              <div className="grid-2">
                <FormField
                  label="Author"
                  value={formData.author}
                  onChange={(value) => handleInputChange('author', value)}
                  placeholder="Your name"
                />
                
                <FormField
                  label="Publish Date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => handleInputChange('date', value)}
                  required
                />
              </div>
              
              <FormField
                label="Blog URL (Optional)"
                type="url"
                value={formData.url}
                onChange={(value) => handleInputChange('url', value)}
                placeholder="https://medium.com/@username/blog-post"
                helperText="Link to your published blog post (Medium, Dev.to, etc.)"
              />
              
              <MediaUploader
                label="Featured Image"
                onUpload={handleImageUpload}
                accept="image/*"
                existingUrl={formData.imageUrl}
                helperText="Upload a featured image for your blog post"
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
                  {uploadingImage ? 'Uploading...' : (editingBlog ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="item-card blog-card">
              {blog.imageUrl && (
                <div className="blog-image">
                  <img src={blog.imageUrl} alt={blog.title} />
                </div>
              )}
              
              <div className="item-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    {new Date(blog.date).toLocaleDateString()}
                  </span>
                  {blog.author && (
                    <span className="blog-author">By {blog.author}</span>
                  )}
                </div>
                
                <h3 className="item-title">{blog.title}</h3>
                
                <p className="item-description">
                  {blog.content.length > 150 
                    ? `${blog.content.substring(0, 150)}...` 
                    : blog.content
                  }
                </p>
                
                <div className="item-actions">
                  {blog.url && (
                    <a 
                      href={blog.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="blog-link"
                    >
                      Read Full Post
                    </a>
                  )}
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(blog)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      setBlogToDelete(blog);
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

        {blogs.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Blog Posts Yet</h3>
            <p>Add your blog posts and articles to share your knowledge</p>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Blog Post
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete Blog Post"
      />
    </div>
  );
};

export default Blogs;