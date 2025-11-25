// src/components/common/Button.jsx
import React from 'react';

const Button = ({ 
  type = 'button', 
  disabled = false, 
  fullWidth = false, 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 disabled:border-gray-200 disabled:text-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
  };

  const sizeClasses = fullWidth ? 'w-full' : 'px-4 py-2';

  const classes = `${baseClasses} ${variants[variant]} ${sizeClasses} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 
