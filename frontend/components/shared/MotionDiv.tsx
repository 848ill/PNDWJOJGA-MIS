"use client";

// Lightweight replacement for motion.div using CSS animations
export const MotionDiv = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}; 