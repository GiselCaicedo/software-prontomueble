// src/components/ImageCarousel.tsx
"use client";

import { useState, useEffect } from 'react';

type ImageCarouselProps = {
  images: string[];
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);
  console.log(isTransitioning)
  return (
    // Removed the relative h-full class since height will be controlled by parent
    <div className="absolute inset-0">
      {/* Image Container - Now covers the full area */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${currentImage === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover brightness-[0.85]"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
        </div>
      ))}

      {/* Navigation Dots - Adjusted z-index to appear above images but below content */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${currentImage === index ? 'bg-white w-4' : 'bg-white/50'}`}
            onClick={() => setCurrentImage(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}