import React from 'react';
import './BrandedLoader.css';

const BrandedLoader = ({ 
  size = 'medium', 
  message = 'Loading...', 
  type = 'products',
  fullPage = false 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28'
  };

  const containerClasses = fullPage 
    ? 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50' 
    : 'relative';

  const messages = {
    products: 'Curating premium fashion...',
    search: 'Finding perfect matches...',
    images: 'Loading gallery...',
    auth: 'Authenticating...',
    default: message
  };

  const loaderMessage = messages[type] || messages.default;

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center p-8 min-h-[300px]`}>
      <div className="relative mb-8">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-100 relative overflow-hidden`}>
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 animate-spin-slow bg-clip-border">
            <div className="absolute inset-1 rounded-full bg-white"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/images/darkLogo.svg" 
                alt="Hira Logo" 
                className="w-full h-full object-contain opacity-80 animate-pulse-gentle"
              />
            </div>
          </div>
        </div>
        
  </div>


      <p className="text-gray-600 text-sm font-light tracking-wide animate-pulse-gentle mb-6">
        {loaderMessage}
      </p>

      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="w-1 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse-sequence"
            style={{ 
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1.5s'
            }}
          ></div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-purple-200 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-indigo-200 rounded-full animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-16 h-16 border border-purple-100 rounded-full animate-float-slow" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6 place-items-center">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] bg-white rounded-lg border shadow-sm overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-elegant"></div>
            
            {/* Logo placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 opacity-20">
                <img 
                  src="/images/darkLogo.svg" 
                  alt="Loading" 
                  className="w-full h-full object-contain animate-pulse-gentle"
                />
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-3 space-y-3">
            {/* Product Name */}
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse-gentle"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse-gentle" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {/* Price */}
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16 animate-pulse-gentle" style={{ animationDelay: '0.4s' }}></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 animate-pulse-gentle" style={{ animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Button */}
            <div className="h-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded animate-pulse-gentle" style={{ animationDelay: '0.8s' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Image Loading Component with Logo
export const ImageWithLoader = ({ 
  src, 
  alt, 
  className, 
  fallback,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallback) setImgSrc(fallback);
    if (onError) onError();
  };

  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImgSrc(src);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 z-10">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-400 to-indigo-400 animate-spin-slow rounded-full bg-clip-border">
                <div className="absolute inset-1 bg-gray-50 rounded-full"></div>
              </div>
            </div>
            
            {/* Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/images/darkLogo.svg" 
                alt="Loading" 
                className="w-6 h-6 object-contain opacity-60 animate-pulse-gentle"
              />
            </div>
          </div>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {hasError && !fallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
          <div className="w-12 h-12 mb-2 opacity-50">
            <img 
              src="/images/darkLogo.svg" 
              alt="Hira" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-xs font-light">Image not available</div>
        </div>
      )}
    </div>
  );
};

export default BrandedLoader;