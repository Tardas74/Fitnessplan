import React from 'react';
import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${disabled ? 'btn--disabled' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonGroup({ children }) {
  return <div className="btn-group">{children}</div>;
}
