
import React from 'react';
import { motion } from 'framer-motion';

interface StatusBarTooltipProps {
  children: React.ReactNode;
  label: string;
}

export const StatusBarTooltip: React.FC<StatusBarTooltipProps> = ({ children, label }) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (rect.right > viewportWidth) {
        tooltipRef.current.style.left = 'auto';
        tooltipRef.current.style.right = '0';
        tooltipRef.current.style.transform = 'translateY(-100%)';
      }
    }
  }, [showTooltip]);
  
  return (
    <div 
      className="relative flex items-center cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, y: 5 }}
        animate={{ 
          opacity: showTooltip ? 1 : 0,
          y: showTooltip ? 0 : 5
        }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full mb-1.5 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap bg-[#151922] border border-[#374151] text-white shadow-lg z-50"
        style={{ 
          pointerEvents: showTooltip ? 'auto' : 'none',
        }}
      >
        {label}
        <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-[#151922] border-b border-r border-[#374151]"></div>
      </motion.div>
    </div>
  );
};
