export const formatSkills = (skills) => {
  if (!skills || !Array.isArray(skills)) return [];
  
  return skills.reduce((acc, skill) => {
    if (skill.category && Array.isArray(skill.items)) {
      acc.push({
        category: skill.category,
        items: skill.items
      });
    }
    return acc;
  }, []);
};

export const formatProject = (project) => {
  return {
    ...project,
    techStack: Array.isArray(project.techStack) 
      ? project.techStack 
      : typeof project.techStack === 'string'
        ? project.techStack.split(',').map(t => t.trim()).filter(t => t)
        : []
  };
};

export const formatEducation = (education) => {
  return education.map(edu => ({
    ...edu,
    period: edu.period || `${edu.startYear || ''} - ${edu.endYear || 'Present'}`
  }));
};

export const formatExperience = (experience) => {
  return experience.map(exp => ({
    ...exp,
    period: exp.period || `${exp.startDate || ''} - ${exp.endDate || 'Present'}`
  }));
};

export const formatSocialLinks = (links) => {
  return links.map(link => ({
    ...link,
    platform: link.platform.toLowerCase(),
    iconUrl: link.iconUrl || getSocialIcon(link.platform)
  }));
};

const getSocialIcon = (platform) => {
  const icons = {
    github: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg',
    linkedin: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg',
    twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
    instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg',
    facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
    youtube: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg',
    dribbble: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/dribbble.svg',
    behance: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/behance.svg',
    medium: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/medium.svg'
  };
  
  return icons[platform.toLowerCase()] || '';
};