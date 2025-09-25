
import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  tooltip,
  position = 'top',
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ 
    position,
    adjustedX: 0
  });
  
  React.useEffect(() => {
    if (isHovered && tooltipRef.current && wrapperRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Check if tooltip is going off the right edge
      if (tooltipRect.right > viewportWidth) {
        const overflowAmount = tooltipRect.right - viewportWidth;
        setTooltipPosition(prev => ({ ...prev, adjustedX: -overflowAmount - 10 }));
      } else {
        setTooltipPosition(prev => ({ ...prev, adjustedX: 0 }));
      }
      
      // If close to the top edge, force bottom position
      if (wrapperRect.top < 60 && position === 'top') {
        setTooltipPosition(prev => ({ ...prev, position: 'bottom' }));
      } else {
        setTooltipPosition(prev => ({ ...prev, position }));
      }
    }
  }, [isHovered, position]);
  
  // Calculate tooltip position
  const getTooltipPosition = () => {
    switch (tooltipPosition.position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'right':
        return 'left-full ml-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      default:
        return 'bottom-full mb-2';
    }
  };
  
  return (
    <div 
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isHovered && (
        <motion.div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs rounded-md whitespace-nowrap bg-[#1a1f2c]/95 text-white border border-[#374151]/70 shadow-xl backdrop-blur-sm ${className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          style={{ 
            top: tooltipPosition.position === 'bottom' ? '100%' : 
                 tooltipPosition.position === 'top' ? 'auto' : '50%',
            bottom: tooltipPosition.position === 'top' ? '100%' : 'auto',
            left: tooltipPosition.position === 'right' ? '100%' : 
                  tooltipPosition.position === 'left' ? 'auto' : '50%',
            right: tooltipPosition.position === 'left' ? '100%' : 'auto',
            transform: tooltipPosition.position === 'top' || tooltipPosition.position === 'bottom' 
                      ? `translateX(-50%) translateX(${tooltipPosition.adjustedX}px)` 
                      : tooltipPosition.position === 'left' || tooltipPosition.position === 'right'
                      ? 'translateY(-50%)' 
                      : 'none',
            margin: tooltipPosition.position === 'top' ? '0 0 8px 0' : 
                   tooltipPosition.position === 'right' ? '0 0 0 8px' :
                   tooltipPosition.position === 'bottom' ? '8px 0 0 0' :
                   tooltipPosition.position === 'left' ? '0 8px 0 0' : '0'
          }}
        >
          {tooltip}
        </motion.div>
      )}
    </div>
  );
};
