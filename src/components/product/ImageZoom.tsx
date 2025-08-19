import React, { useState, useRef, useCallback } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className = '' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    setMousePosition({ x, y });
    setImagePosition({ x: xPercent, y: yPercent });
  }, []);

  return (
    <div className="relative">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden cursor-crosshair ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: isZoomed ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        
        {/* Zoom Lens Overlay */}
        {isZoomed && (
          <div
            className="absolute pointer-events-none border-2 border-white shadow-lg"
            style={{
              width: '100px',
              height: '100px',
              left: mousePosition.x - 50,
              top: mousePosition.y - 50,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
            }}
          />
        )}
      </div>

      {/* Zoomed Image Display - Desktop Only */}
      {isZoomed && (
        <div className="hidden lg:block absolute left-full top-0 ml-4 w-96 h-96 border border-gray-200 rounded-lg overflow-hidden shadow-xl bg-white z-50">
          <img
            src={src}
            alt={`${alt} - Zoomed`}
            className="w-full h-full object-cover"
            style={{
              transform: `scale(2.5)`,
              transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};