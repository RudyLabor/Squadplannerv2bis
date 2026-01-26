import { motion } from 'motion/react';
import { ExternalLink, MessageCircle, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

interface DeepLinkButtonProps {
  type: 'discord' | 'game' | 'custom';
  label: string;
  deepLink: string;
  fallbackUrl?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function DeepLinkButton({
  type,
  label,
  deepLink,
  fallbackUrl,
  icon,
  variant = 'primary',
  className = ''
}: DeepLinkButtonProps) {
  const [attempting, setAttempting] = useState(false);

  const handleClick = () => {
    setAttempting(true);

    // Try deep link first
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // Fallback after timeout if deep link doesn't work
    const timer = setTimeout(() => {
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank');
      }
      document.body.removeChild(iframe);
      setAttempting(false);
    }, 2500);

    // Listen for visibility change (app opened successfully)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
        document.body.removeChild(iframe);
        setAttempting(false);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'discord':
        return <MessageCircle className="w-5 h-5" strokeWidth={2} />;
      case 'game':
        return <Gamepad2 className="w-5 h-5" strokeWidth={2} />;
      default:
        return <ExternalLink className="w-5 h-5" strokeWidth={2} />;
    }
  };

  const variantClasses = variant === 'primary'
    ? 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] shadow-[0_4px_16px_rgba(245,158,11,0.25)]'
    : 'bg-white text-[var(--fg-primary)] border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] shadow-sm';

  return (
    <motion.button
      onClick={handleClick}
      disabled={attempting}
      className={`
        flex items-center justify-center gap-3 h-14 px-6 rounded-2xl
        font-semibold text-base
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses}
        ${className}
      `}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
    >
      {getIcon()}
      <span>{attempting ? 'Ouverture...' : label}</span>
    </motion.button>
  );
}
