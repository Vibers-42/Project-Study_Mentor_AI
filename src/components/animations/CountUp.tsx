import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CountUpProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  value, 
  duration = 1.5, 
  delay = 0,
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  
  const springValue = useSpring(0, {
    damping: 50,
    stiffness: 100,
    duration: duration * 1000
  });

  const displayValue = useTransform(springValue, (current) => {
    return Math.round(current).toString();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
      springValue.set(value);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [value, delay, springValue]);

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
};
