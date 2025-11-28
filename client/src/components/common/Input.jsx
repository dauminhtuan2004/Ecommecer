// src/components/common/Input.jsx
import React from 'react';

const Input = ({ 
  type = 'text', 
  name, 
  label, 
  value, 
  onChange, 
  error, 
  required = false, 
  icon: Icon,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  const errorClasses = error ? 'border-red-300 pr-10' : '';

  const classes = `${baseClasses} ${errorClasses} ${Icon ? 'pl-10' : ''} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={classes}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;