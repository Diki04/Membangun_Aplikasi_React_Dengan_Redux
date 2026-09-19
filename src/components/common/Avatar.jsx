import React from 'react';

function Avatar({ src, name, size = 'md' }) {
  const initials = name ? name[0].toUpperCase() : '?';
  const sizeClass = `avatar avatar-${size}`;

  if (src) {
    return (
      <div className={sizeClass}>
        <img src={src} alt={name} className="avatar-img" />
      </div>
    );
  }

  return (
    <div className={sizeClass}>
      <span className="avatar-initials">{initials}</span>
    </div>
  );
}

export default Avatar;
