import React, { useState } from 'react';

interface CollegeLogoProps {
  className?: string;
  imgClassName?: string;
  fallbackSize?: 'sm' | 'md' | 'lg';
}

export const OFFICIAL_LOGO_URL = 'https://www.image2url.com/r2/default/images/1791910631362-f0928416-19f5-4ca9-8122-f169e1e505c9.png';

export const CollegeLogo: React.FC<CollegeLogoProps> = ({ 
  className = 'w-10 h-10', 
  imgClassName = 'w-full h-full object-contain',
  fallbackSize = 'md'
}) => {
  const [hasError, setHasError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  // Try local asset first, then remote URL
  const sources = ['/college-logo.png', OFFICIAL_LOGO_URL, '/pec-logo.png'];

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    // Graceful fallback with college initials "PEC"
    const textSize = fallbackSize === 'lg' ? 'text-2xl' : fallbackSize === 'md' ? 'text-sm' : 'text-xs';
    return (
      <div 
        className={`${className} rounded-lg bg-navy-950 text-white font-black flex items-center justify-center border border-navy-800 shadow-sm select-none`}
        title="Prathyusha Engineering College"
      >
        <span className={`${textSize} tracking-widest text-amber-400 font-serif`}>PEC</span>
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center overflow-hidden`}>
      <img
        src={sources[srcIndex]}
        alt="Prathyusha Engineering College Official Logo"
        className={imgClassName}
        style={{ objectFit: 'contain' }}
        onError={handleImageError}
      />
    </div>
  );
};
