import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';

const Loading = memo(({ 
  size = 'md', 
  text = 'Đang tải...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className={`${iconSize} animate-spin text-blue-600 mx-auto mb-4`} />
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className={`${iconSize} animate-spin text-blue-600 mb-3`} />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
