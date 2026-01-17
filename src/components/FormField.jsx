import React from 'react';
import '../styles/form-field.css';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange,
  placeholder, 
  required = false,
  error,
  helperText,
  multiline = false,
  rows = 4,
  options, // For select inputs
  ...props
}) => {
  // Safely generate input ID
  const inputId = React.useId();
  const safeLabel = label || '';
  const fieldId = `input-${inputId}-${safeLabel.toLowerCase().replace(/\s+/g, '-')}`;
   const [size, setSize] = React.useState(1);

  const renderInput = () => {
    if (multiline) {
      return (
        <textarea
          id={fieldId}
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`form-textarea ${error ? 'error' : ''}`}
          {...props}
        />
      );
    }

    if (type === 'select' && options) {
      return (
        <select
          id={fieldId}
          value={value || ''}
          size={size}
          onClick={() => { size===1 ? setSize(5) : setSize(1)}}
          onFocus={() => setSize(5)}
          onBlur={() => setSize(1)}
          onChange={(e) => {onChange && onChange(e.target.value);setTimeout(() => {setSize(1)},500)}}
          required={required}
          className={`form-select ${error ? 'error' : ''}`}
          {...props}
        >
          <option value="">Select {safeLabel}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          id={fieldId}
          checked={!!value}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="form-checkbox"
          {...props}
        />
      );
    }

    return (
      <input
        type={type}
        id={fieldId}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
    );
  };

  return (
    <div className="form-field">
      {safeLabel && (
        <label htmlFor={fieldId} className="form-label">
          {safeLabel}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helperText && !error && (
        <p className="helper-text">{helperText}</p>
      )}
      
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
};

export default FormField;
