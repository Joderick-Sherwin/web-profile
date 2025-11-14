import { ReactNode, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/use-parallax';

interface OptimizedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const OptimizedSection = ({ children, className = '', id }: OptimizedSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className}
      style={{
        contentVisibility: isVisible ? 'visible' : 'auto',
        containIntrinsicSize: '1000px',
      }}
    >
      {children}
    </section>
  );
};
