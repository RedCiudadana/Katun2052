import React, { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-1000 ease-out';
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeInUp':
          return `${baseClass} opacity-0 translate-y-8`;
        case 'fadeInLeft':
          return `${baseClass} opacity-0 -translate-x-8`;
        case 'fadeInRight':
          return `${baseClass} opacity-0 translate-x-8`;
        case 'scaleIn':
          return `${baseClass} opacity-0 scale-95`;
        default:
          return `${baseClass} opacity-0 translate-y-8`;
      }
    }
    
    return `${baseClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedSection;