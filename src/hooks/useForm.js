import { useState, useCallback } from 'react';

const useForm = (initialState = {}, validate = () => ({})) => {
  const [formData, setFormData] = useState(initialState || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value !== undefined ? value : '' 
    }));
    
    if (touched[field]) {
      const validationErrors = validate({ ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  }, [formData, touched, validate]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const validationErrors = validate(formData);
    setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
  }, [formData, validate]);

  const resetForm = useCallback(() => {
    setFormData(initialState || {});
    setErrors({});
    setTouched({});
  }, [initialState]);

  const validateForm = useCallback(() => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    return Object.keys(validationErrors).length === 0;
  }, [formData, validate]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    validateForm,
    setFormData
  };
};

export default useForm;

