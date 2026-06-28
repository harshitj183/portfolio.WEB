import React, { forwardRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';

export interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  tiltAngle?: number; 
}

const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(({ 
  children, className = '', style = {}, tiltAngle = 15, ...rest 
}, ref) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltAngle}deg`, `-${tiltAngle}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltAngle}deg`, `${tiltAngle}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
    if (rest.onMouseMove) rest.onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    x.set(0);
    y.set(0);
    if (rest.onMouseLeave) rest.onMouseLeave(e);
  };

  return (
    <div style={{ perspective: '1000px', width: '100%', height: '100%' }}>
      <motion.div
        ref={ref}
        className={className}
        style={{
          ...style,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...rest}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    </div>
  );
});

TiltCard.displayName = 'TiltCard';
export default TiltCard;
