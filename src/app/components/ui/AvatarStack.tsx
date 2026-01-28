import { motion } from 'framer-motion';
import { useState } from 'react';

interface Avatar {
  id: string;
  name: string;
  image?: string;
  isOnline?: boolean;
}

interface AvatarStackProps {
  avatars: Avatar[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
  spreadOnHover?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
};

const fontSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};

const statusSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3'
};

export function AvatarStack({
  avatars,
  maxVisible = 5,
  size = 'md',
  showOnlineStatus = false,
  spreadOnHover = true,
  className = ''
}: AvatarStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = Math.max(0, avatars.length - maxVisible);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className={`flex items-center ${className}`}
      onMouseEnter={() => spreadOnHover && setIsHovered(true)}
      onMouseLeave={() => spreadOnHover && setIsHovered(false)}
    >
      <div className="flex -space-x-2">
        {visibleAvatars.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            className="relative"
            variants={{
              default: {
                x: 0,
                scale: 1,
                zIndex: visibleAvatars.length - index
              },
              hover: {
                x: index * 12, // Spread effect
                scale: 1.1,
                zIndex: visibleAvatars.length - index
              }
            }}
            animate={isHovered ? 'hover' : 'default'}
            transition={{
              delay: index * 0.03,
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {avatar.image ? (
              <img
                src={avatar.image}
                alt={avatar.name}
                className={`${sizeClasses[size]} rounded-full border-2 border-white object-cover`}
              />
            ) : (
              <div 
                className={`${sizeClasses[size]} rounded-full border-2 border-white bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] flex items-center justify-center ${fontSizeClasses[size]} font-semibold text-white`}
              >
                {getInitials(avatar.name)}
              </div>
            )}
            
            {/* Online status badge */}
            {showOnlineStatus && avatar.isOnline && (
              <motion.div
                className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} rounded-full bg-[var(--success-500)] border-2 border-white`}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.div>
        ))}
        
        {/* Remaining count */}
        {remainingCount > 0 && (
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-2 border-white bg-[var(--bg-tertiary)] flex items-center justify-center ${fontSizeClasses[size]} font-semibold text-[var(--fg-secondary)]`}
            variants={{
              default: {
                x: 0,
                scale: 1
              },
              hover: {
                x: visibleAvatars.length * 12,
                scale: 1.1
              }
            }}
            animate={isHovered ? 'hover' : 'default'}
            transition={{
              delay: visibleAvatars.length * 0.03,
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>
    </div>
  );
}
