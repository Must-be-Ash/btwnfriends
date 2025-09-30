'use client';
import React, { type JSX } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);


  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:200%_100%,auto] bg-clip-text',
        'text-transparent',
        className
      )}
      initial={{ backgroundPosition: '200% center' }}
      animate={{ backgroundPosition: '-200% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          backgroundImage: `linear-gradient(90deg, #999999 0%, #CCCCCC 20%, #FFFFFF 50%, #CCCCCC 80%, #999999 100%), linear-gradient(#999999, #999999)`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

// Basic shimmer component for easy usage
export function TextShimmerBasic({ 
  children, 
  className,
  duration = 1 
}: { 
  children: string; 
  className?: string;
  duration?: number;
}) {
  return (
    <TextShimmer className={cn('font-mono text-sm', className)} duration={duration}>
      {children}
    </TextShimmer>
  );
}