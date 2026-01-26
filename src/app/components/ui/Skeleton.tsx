import { memo } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

const SkeletonComponent = ({ 
  width, 
  height, 
  variant = 'rectangular',
  className = '' 
}: SkeletonProps) => {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl'
  };

  return (
    <div
      className={`skeleton ${variantStyles[variant]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  );
};

SkeletonComponent.displayName = 'Skeleton';

export const Skeleton = memo(SkeletonComponent);
