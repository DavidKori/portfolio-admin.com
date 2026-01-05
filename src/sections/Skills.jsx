import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../api/axios';
import FormField from '../components/FormField';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import Loader from '../components/Loader';
import '../styles/section.css';

// Category options matching your enum
const CATEGORY_OPTIONS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Other', label: 'Other' }
];

// Level options
const LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' }
];

// Common icon URLs for skills (optional pre-filled suggestions)
const COMMON_ICONS = {
  'Frontend': [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/react.svg' },
    { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vuedotjs.svg' },
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/angular.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/javascript.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/typescript.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/html5.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/css3.svg' },
    { name: 'Sass', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sass.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tailwindcss.svg' },
  ],
  'Backend': [
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nodedotjs.svg' },
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/express.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/python.svg' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/django.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/java.svg' },
    { name: 'Spring', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/spring.svg' },
    { name: 'PHP', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/php.svg' },
    { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/laravel.svg' },
    { name: 'Ruby', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/ruby.svg' },
    { name: 'Rails', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/rubyonrails.svg' },
    { name: 'Go', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/go.svg' },
  ],
  'Database': [
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mongodb.svg' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/mysql.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/postgresql.svg' },
    { name: 'Redis', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/redis.svg' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/sqlite.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/firebase.svg' },
  ],
  'Tools': [
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/git.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/docker.svg' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/amazonaws.svg' },
    { name: 'Azure', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/microsoftazure.svg' },
    { name: 'Heroku', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/heroku.svg' },
    { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/nginx.svg' },
    { name: 'Webpack', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/webpack.svg' },
    { name: 'Vite', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/vite.svg' },
  ],
  'Other': [
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/figma.svg' },
    { name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobephotoshop.svg' },
    { name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/adobeillustrator.svg' },
    { name: 'Linux', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linux.svg' },
  ]
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: '',
    iconUrl: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      // Ensure we always get an array, even if response.data is undefined
      setSkills(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      showError('Failed to load skills');
      setSkills([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    
    // Auto-suggest icon URL when skill name is entered
    if (field === 'name' && value && updatedFormData.category) {
      const categoryIcons = COMMON_ICONS[updatedFormData.category] || [];
      const matchingIcon = categoryIcons.find(icon => 
        icon.name.toLowerCase() === value.toLowerCase()
      );
      if (matchingIcon && !updatedFormData.iconUrl) {
        updatedFormData.iconUrl = matchingIcon.icon;
      }
    }
    
    // Clear icon suggestions when category changes
    if (field === 'category' && value && updatedFormData.name) {
      const categoryIcons = COMMON_ICONS[value] || [];
      const matchingIcon = categoryIcons.find(icon => 
        icon.name.toLowerCase() === updatedFormData.name.toLowerCase()
      );
      if (matchingIcon && !updatedFormData.iconUrl) {
        updatedFormData.iconUrl = matchingIcon.icon;
      }
    }
    
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSkill) {
        const response = await skillsAPI.update(editingSkill._id, formData);
        setSkills(prev => prev.map(s => 
          s._id === editingSkill._id ? response.data : s
        ));
        showSuccess('Skill updated successfully');
      } else {
        const response = await skillsAPI.create(formData);
        setSkills(prev => [...prev, response.data]);
        showSuccess('Skill added successfully');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save skill:', error);
      showError('Failed to save skill');
    }
  };

  const handleBulkCreate = async () => {
    if (!formData.name || !formData.category) {
      showError('Please enter skill name and category');
      return;
    }

    const skillNames = formData.name.split('\n')
      .map(name => name.trim())
      .filter(name => name);
    
    const categories = formData.category.split('\n')
      .map(cat => cat.trim())
      .filter(cat => cat);
    
    const levels = formData.level ? 
      formData.level.split('\n')
        .map(lvl => lvl.trim())
        .filter(lvl => lvl) : 
      [];

    const bulkData = skillNames.map((name, index) => {
      const category = categories[index] || categories[0] || 'Other';
      const level = levels[index] || levels[0] || 'Intermediate';
      
      // Auto-suggest icon
      let iconUrl = '';
      const categoryIcons = COMMON_ICONS[category] || [];
      const matchingIcon = categoryIcons.find(icon => 
        icon.name.toLowerCase() === name.toLowerCase()
      );
      if (matchingIcon) {
        iconUrl = matchingIcon.icon;
      }

      return {
        name,
        category,
        level,
        iconUrl
      };
    });

    try {
      const response = await skillsAPI.bulkCreate(bulkData);
      setSkills(prev => [...prev, ...(Array.isArray(response.data) ? response.data : [])]);
      showSuccess(`${bulkData.length} skills created successfully`);
      resetForm();
      setBulkMode(false);
    } catch (error) {
      console.error('Failed to bulk create skills:', error);
      showError('Failed to create skills');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || '',
      level: skill.level || '',
      iconUrl: skill.iconUrl || ''
    });
    setShowForm(true);
    setBulkMode(false);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    
    try {
      await skillsAPI.delete(skillToDelete._id);
      setSkills(prev => prev.filter(s => s._id !== skillToDelete._id));
      showSuccess('Skill deleted successfully');
    } catch (error) {
      console.error('Failed to delete skill:', error);
      showError('Failed to delete skill');
    } finally {
      setSkillToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: '',
      iconUrl: ''
    });
    setEditingSkill(null);
  };

  // Group skills by category for better display
  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {});

  const getLevelColor = (level) => {
    if (!level) return '#9e9e9e';
    
    switch(level.toLowerCase()) {
      case 'beginner': return '#4caf50'; // Green
      case 'intermediate': return '#ff9800'; // Orange
      case 'advanced': return '#2196f3'; // Blue
      case 'expert': return '#9c27b0'; // Purple
      default: return '#9e9e9e'; // Grey
    }
  };

  if (loading) {
    return <Loader text="Loading skills..." />;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Skills Management</h1>
        <p>Manage your technical and professional skills</p>
      </div>

      <div className="section-content">
        <div className="section-actions">
          <button 
            className="btn-secondary"
            onClick={() => {
              setBulkMode(!bulkMode);
              setShowForm(false);
              resetForm();
            }}
          >
            {bulkMode ? 'Single Mode' : 'Bulk Mode'}
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              setBulkMode(false);
              setShowForm(true);
              resetForm();
            }}
          >
            + Add New Skill
          </button>
        </div>

        {bulkMode ? (
          <div className="form-card">
            <h2>Bulk Create Skills</h2>
            <p className="helper-text">Enter skill names (one per line) and optionally categories/levels (also one per line).</p>
            
            <FormField
              label="Skill Names (one per line)"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              multiline
              rows={6}
              placeholder="React\nVue.js\nTypeScript\nNode.js\nMongoDB"
              helperText="Each line will become a separate skill"
            />
            
            <FormField
              label="Categories (one per line, optional)"
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              multiline
              rows={3}
              placeholder="Frontend\nFrontend\nFrontend\nBackend\nDatabase"
              helperText="Match each skill with a category, or use first category for all"
            />
            
            <FormField
              label="Levels (one per line, optional)"
              value={formData.level}
              onChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
              multiline
              rows={3}
              placeholder="Advanced\nIntermediate\nAdvanced\nAdvanced\nIntermediate"
              helperText="Match each skill with a level, or use first level for all"
            />
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setBulkMode(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleBulkCreate}
              >
                Create All Skills
              </button>
            </div>
          </div>
        ) : showForm && (
          <div className="form-card">
            <h2>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
            
            <form onSubmit={handleSubmit}>
              <FormField
                label="Skill Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                required
                placeholder="e.g., React, Node.js, MongoDB"
              />
              
              <div className="grid-2">
                <FormField
                  label="Category"
                  type="select"
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  options={CATEGORY_OPTIONS}
                  required
                />
                
                <FormField
                  label="Proficiency Level"
                  type="select"
                  value={formData.level}
                  onChange={(value) => handleInputChange('level', value)}
                  options={LEVEL_OPTIONS}
                  placeholder="Select level"
                />
              </div>
              
              <FormField
                label="Icon URL (Optional)"
                type="url"
                value={formData.iconUrl}
                onChange={(value) => handleInputChange('iconUrl', value)}
                placeholder="https://example.com/icon.svg"
                helperText={
                  <span>
                    URL to skill icon (e.g., from <a href="https://simpleicons.org/" target="_blank" rel="noopener noreferrer">Simple Icons</a>). 
                    We'll auto-suggest based on skill name.
                  </span>
                }
              />
              
              {formData.name && formData.category && COMMON_ICONS[formData.category] && (
                <div className="icon-suggestions">
                  <p className="helper-text">Suggested icons for {formData.category}:</p>
                  <div className="icon-grid">
                    {COMMON_ICONS[formData.category]
                      .filter(icon => icon.name.toLowerCase().includes(formData.name.toLowerCase()) || 
                                     formData.name.toLowerCase().includes(icon.name.toLowerCase()))
                      .slice(0, 5)
                      .map((icon, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`icon-suggestion ${formData.iconUrl === icon.icon ? 'selected' : ''}`}
                          onClick={() => handleInputChange('iconUrl', icon.icon)}
                        >
                          <img src={icon.icon} alt={icon.name} />
                          <span>{icon.name}</span>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
              
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
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        )}

        {Object.keys(groupedSkills).length > 0 ? (
          <div className="skills-by-category">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="category-section">
                <h2 className="category-title">
                  {category} <span className="category-count">({categorySkills.length})</span>
                </h2>
                <div className="skills-grid">
                  {categorySkills.map((skill) => (
                    <div key={skill._id || skill.id} className="skill-card">
                      <div className="skill-header">
                        {skill.iconUrl ? (
                          <img 
                            src={skill.iconUrl} 
                            alt={skill.name} 
                            className="skill-icon"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="skill-icon-fallback"
                          style={{ display: skill.iconUrl ? 'none' : 'flex' }}
                        >
                          {skill.name ? skill.name.charAt(0) : '?'}
                        </div>
                        <div className="skill-info">
                          <h3 className="skill-name">{skill.name}</h3>
                          {skill.level && (
                            <span 
                              className="skill-level"
                              style={{ backgroundColor: getLevelColor(skill.level) }}
                            >
                              {skill.level}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="skill-meta">
                        <span className="meta-item">
                          <span className="meta-label">Category:</span> {skill.category}
                        </span>
                        <span className="meta-item">
                          <span className="meta-label">Added:</span> {
                            skill.createdAt || skill.updatedAt 
                              ? new Date(skill.createdAt || skill.updatedAt).toLocaleDateString()
                              : 'N/A'
                          }
                        </span>
                      </div>
                      
                      <div className="skill-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(skill)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => {
                            setSkillToDelete(skill);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="empty-state">
              <div className="empty-icon">⚡</div>
              <h3>No Skills Yet</h3>
              <p>Add your skills to showcase your expertise</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  setBulkMode(false);
                  setShowForm(true);
                }}
              >
                Add First Skill
              </button>
            </div>
          )
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete Skill"
      />
    </div>
  );
};

export default Skills;
