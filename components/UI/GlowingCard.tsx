'use client';
import React from 'react';
import styles from './GlowingCard.module.css';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  intensity?: 'low' | 'medium' | 'high';
}

const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className = '',
  color = 'blue',
  intensity = 'medium'
}) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'rgba(59, 130, 246, 0.3)',
      border: 'border-blue-200'
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      glow: 'rgba(16, 185, 129, 0.3)',
      border: 'border-green-200'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'rgba(168, 85, 247, 0.3)',
      border: 'border-purple-200'
    },
    orange: {
      gradient: 'from-orange-500 to-red-500',
      glow: 'rgba(249, 115, 22, 0.3)',
      border: 'border-orange-200'
    },
    red: {
      gradient: 'from-red-500 to-pink-500',
      glow: 'rgba(239, 68, 68, 0.3)',
      border: 'border-red-200'
    }
  };

  const intensityConfig = {
    low: '0 4px 12px',
    medium: '0 8px 24px',
    high: '0 12px 36px'
  };

  const config = colorConfig[color];

    <div 
      className={`
        relative rounded-2xl p-6
        bg-white border ${config.border}
        transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl
        group
        ${className}
        glowing-card-${color}-${intensity}
      `}
    >
    >
      {/* Gradient Border Effect */}
      <div className={`
        absolute inset-0 rounded-2xl bg-gradient-to-r ${config.gradient} opacity-0 
        group-hover:opacity-5 transition-opacity duration-500
      `}></div>
      
      {/* Animated Corner Accents */}
      <div className={`
        absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${config.border} 
        rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
      `}></div>
      <div className={`
        absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${config.border} 
        rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
      `}></div>
      <div className={`
        absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${config.border} 
        rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
      `}></div>
      <div className={`
        absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${config.border} 
        rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
      `}></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlowingCard;