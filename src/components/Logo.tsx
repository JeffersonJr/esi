import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = {
    sm: { width: 52, height: 14, textClass: 'text-lg' },
    md: { width: 104, height: 28, textClass: 'text-2xl' },
    lg: { width: 156, height: 42, textClass: 'text-3xl' }
  };

  const { width, height, textClass } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logoesiwhite.png"
        alt="ESI Sistema Imobiliário"
        width={width}
        height={height}
        className="flex-shrink-0"
      />
      {showText && (
        <span className={`${textClass} font-bold text-white`}>
          esi sistema imobiliário
        </span>
      )}
    </div>
  );
};
