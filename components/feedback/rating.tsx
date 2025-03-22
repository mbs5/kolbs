'use client';

import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ value, max = 10, size = 'md' }: RatingProps) {
  // Calculate stars (out of 5)
  const stars = (value / max) * 5;
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-yellow-500">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`fill-current ${sizeClass[size]}`} />
        ))}
        
        {hasHalfStar && <StarHalf className={`fill-current ${sizeClass[size]}`} />}
        
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className={`text-gray-300 ${sizeClass[size]}`} />
        ))}
      </div>
      
      <span className="text-sm font-medium ml-1">{value}/{max}</span>
    </div>
  );
} 