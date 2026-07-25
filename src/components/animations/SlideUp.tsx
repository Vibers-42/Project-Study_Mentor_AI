import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const SlideUp: React.FC<SlideUpProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  yOffset = 20,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
