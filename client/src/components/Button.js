import React from 'react';
import classNames from 'classnames';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  loading = false,
  icon = null,
  ...props 
}) => {
  const buttonClasses = classNames(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    {
      'btn-loading': loading,
      'btn-disabled': disabled,
    },
    className
  );

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="btn-spinner">
          <div className="spinner" />
        </div>
      )}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;