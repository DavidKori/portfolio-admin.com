import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../api/axios';
import FormField from '../components/FormField';
import MediaUploader from '../components/MediaUploader';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import { useToast } from '../hooks/useToast';
import '../styles/section.css';


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showSuccess, showError } = useToast();
  const [publishModal,setPublishModal] = useState("false");
  const [projectToPUblish,setProjectToPublish] = useState("")

    const [publish,setPublish] = useState({
    status:"draft"
    })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    imageUrl: '',
    images:[''],
    videoUrl: '',
    liveUrl: '',
    githubUrl: '',
  });

  useEffect(() => {
    fetchProjects();
    setPublishModal(false)
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      // Ensure we always get an array, even if response.data is undefined
      setProjects(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      showError('Failed to load projects');
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // const handleArrayInput = (field, value) => {
  //   const array = value.split(',').map(item => item.trim()).filter(item => item);
  //   handleInputChange(field, array);
  // };

  const handleImageUpload = async (formData) => {
    setUploadingImage(true);
    
    try {
      const response = await projectsAPI.uploadMedia(formData);
      handleInputChange('imageUrl', response.data.url);
      showSuccess('Image uploaded successfully');
      return response.data;
    } catch (error) {
      showError('Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };
  // const TogglePublish = (project) => {
  //   setEditingProject(project);
  //   setFormData(project.status==="draft" ? "published" : "draft")
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      techStack: formData.techStack 
        ? formData.techStack.split(',').map(item => item.trim()).filter(item => item)
        : []
    };

    try {
      if (editingProject) {
        const response = await projectsAPI.update(editingProject._id, projectData);
        setProjects(prev => prev.map(p => 
          p._id === editingProject._id ? response.data : p
        ));
        showSuccess('Project updated successfully');
      } else {
        const response = await projectsAPI.create(projectData);
        setProjects(prev => [...prev, response.data]);
        showSuccess('Project added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      showError('Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
      imageUrl: project.imageUrl || '',
      videoUrl: project.videoUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
    });
    setShowForm(true);

  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await projectsAPI.delete(projectToDelete._id);
      setProjects(prev => prev.filter(p => p._id === projectToDelete._id));
      
      showSuccess('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError('Failed to delete project');
    } finally {
      setProjectToDelete(null);
      setShowDeleteModal(false);
    }
  };
      const handlePublish = async () => {
      if (!projectToPUblish) return;

        const showStatus =!projectToPUblish.status 
        const newStatus = publish.status === 'draft' || publish.status!=="published" ? 'published' : 'draft';
        setPublish({status:newStatus});
      try {
       const response = await projectsAPI.update(projectToPUblish._id,publish);
        // setProjects(prev => prev.filter(p => p._id !== projectToPUblish._id));
                setProjects(prev => prev.map(p => 
          p._id === projectToPUblish._id ? response.data : p
          
        ));
        response.data.status === "published" ? showSuccess('Project published successfully') : showSuccess('Project unpublished successfully');
      } catch (error) {
        console.error(response.data.status === "published" ?'Failed to unpublish project' :'Failed to publish project', error);
        response.data.status === "published" ? showError('Failed to unpublish project') : showError('Failed to publish project');
        // showError('Failed to publish project');
      } finally {
        // setProjectToPublish(null);
        setPublishModal(false);
      }
    };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      imageUrl: '',
      videoUrl: '',
      liveUrl: '',
      githubUrl: '',
    });
    setEditingProject(null);
  };

  if (loading) {
    return <Loader text="Loading projects..." />;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Projects Management</h1>
        <p>Manage your portfolio projects</p>
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
            + Add New Project
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            
            <form onSubmit={handleSubmit}>
              <FormField
                label="Title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                required
                placeholder="Project title"
              />
              
              <FormField
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                multiline
                rows={4}
                placeholder="Project description"
                required
              />
              
              <FormField
                label="Tech Stack (comma separated)"
                value={formData.techStack}
                onChange={(value) => handleInputChange('techStack', value)}
                placeholder="React, Node.js, MongoDB"
                helperText="Separate technologies with commas"
              />
              
              <MediaUploader
                label="Project Image"
                onUpload={handleImageUpload}
                accept="image/*"
                existingUrl={formData.imageUrl}
              />
              
              <FormField
                label="Video URL (optional)"
                type="url"
                value={formData.videoUrl}
                onChange={(value) => handleInputChange('videoUrl', value)}
                placeholder="https://youtube.com/watch?v=..."
              />
              
              <FormField
                label="Live URL (optional)"
                type="url"
                value={formData.liveUrl}
                onChange={(value) => handleInputChange('liveUrl', value)}
                placeholder="https://project-live-demo.com"
              />
              
              <FormField
                label="GitHub URL (optional)"
                type="url"
                value={formData.githubUrl}
                onChange={(value) => handleInputChange('githubUrl', value)}
                placeholder="https://github.com/username/project"
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
                  {uploadingImage ? 'Uploading...' : (editingProject ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="items-grid">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id || project.id} className="item-card">
                {project.imageUrl && (
                  <div className="item-image">
                    <img src={project.imageUrl} alt={project.title || 'Project image'} />
                  </div>
                )}
                
                <div className="item-content">
                  <h3 className="item-title">{project.title || 'Untitled Project'}</h3>
                  <p className="item-description">
                    {project.description 
                      ? (project.description.length > 150 
                          ? `${project.description.substring(0, 150)}...` 
                          : project.description)
                      : 'No description provided'
                    }
                  </p>
                  
                  {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                    <div className="item-tech">
                      {project.techStack.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="item-links">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        🌐 Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        💻 GitHub
                      </a>
                    )}
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => {
                        setProjectToDelete(project);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                    
                    <button 
                      className="btn-edit"
                      onClick={() => {
                        setProjectToPublish(project)
                        setPublishModal(true)

                      }}
                    >
                    {project.status === "draft" ? "publish" : "unpublish"}

                    </button>                      
                  </div>
                </div>
              </div>
            ))
          ) : (
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h3>No Projects Yet</h3>
                <p>Add your first project to showcase in your portfolio</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  Add First Project
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
      />
      <ConfirmModal
              isOpen={publishModal}
              onClose={() => setPublishModal(false)}
              onConfirm={handlePublish}
              title={projectToPUblish.status==="draft" ? "publish project":"unpublish project"}
              message={projectToPUblish.status==="draft" ? "when you publish it will show in the client side":"when you unpublish only YOU will be able to see the project"}
              confirmText={projectToPUblish.status==="draft" ? "publish":"unpublish"}
            />
    </div>
  );
};

export default Projects;
