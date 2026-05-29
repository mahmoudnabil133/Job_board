import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom class names */
  className?: string;
  /** Children to render inside the card */
  children: React.ReactNode;
}

/**
 * GlassCard – a lightweight component that applies the glass‑morphism style
 * defined in `index.css` (class `.glass-card`). It forwards any additional
 * props to the underlying `<div>` allowing flexible usage across the app.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ className = '', children, ...rest }) => {
  const combined = ['glass-card transition-all duration-300', className].filter(Boolean).join(' ');
  return (
    <div className={combined} {...rest}>
      {children}
    </div>
  );
};
