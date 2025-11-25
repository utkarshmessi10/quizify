import React from 'react';
import classNames from 'classnames';
import './Input.css';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  icon = null,
  ...props 
}) => {
  const inputClasses = classNames(
    'input',
    {
      'input-error': error,
      'input-icon': icon,
    },
    className
  );

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon-wrapper">{icon}</span>}
        <input 
          id={id}
          className={inputClasses} 
          {...props} 
        />
      </div>
      {error && (
        <span className="input-error-text">{error}</span>
      )}
    </div>
  );
};

export default Input;