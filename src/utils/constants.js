export const API_BASE_URL = 'http://localhost:5000/api';

export const SOCIAL_PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: '🐙' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'dribbble', label: 'Dribbble', icon: '🏀' },
  { value: 'behance', label: 'Behance', icon: '🎨' },
  { value: 'medium', label: 'Medium', icon: '📝' },
  { value: 'devto', label: 'Dev.to', icon: '💻' },
  { value: 'stackoverflow', label: 'Stack Overflow', icon: '🔧' },
  { value: 'codepen', label: 'CodePen', icon: '✏️' },
  { value: 'leetcode', label: 'LeetCode', icon: '⚡' },
  { value: 'hackerrank', label: 'HackerRank', icon: '💾' },
  { value: 'website', label: 'Website', icon: '🌐' },
];

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Cloud',
  'Mobile',
  'Design',
  'Tools',
  'Languages',
  'Frameworks',
  'Libraries',
  'Testing',
  'Soft Skills'
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const YEARS = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
);

export const FILE_TYPES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  video: ['mp4', 'webm', 'mov', 'avi'],
  document: ['pdf', 'doc', 'docx', 'txt'],
  resume: ['pdf', 'doc', 'docx']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB