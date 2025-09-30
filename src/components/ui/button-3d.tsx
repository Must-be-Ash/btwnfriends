"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'red' | 'gradient'
  size?: 'default' | 'lg'
  isLoading?: boolean
}

export function Button3D({ 
  children, 
  className, 
  variant = 'default', 
  size = 'default',
  isLoading = false,
  disabled,
  style,
  ...props 
}: Button3DProps) {
  const baseStyles = "relative font-medium transition-all duration-150 ease-out transform active:scale-75 focus:outline-none border-none text-white"
  
  const variants = {
    default: {
      normal: "shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 hover:scale-95",
      disabled: "shadow-[0_6px_15px_rgba(0,0,0,0.2)] cursor-not-allowed opacity-60"
    },
    red: {
      normal: "shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 hover:scale-95",
      disabled: "shadow-[0_6px_15px_rgba(0,0,0,0.2)] cursor-not-allowed opacity-60"
    },
    gradient: {
      normal: "shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-2 hover:scale-95",
      disabled: "shadow-[0_6px_15px_rgba(0,0,0,0.2)] cursor-not-allowed opacity-60"
    }
  }
  
  const sizes = {
    default: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  }
  
  const getBackgroundStyle = () => {
    const isDisabled = disabled || isLoading
    
    if (variant === 'gradient') {
      return isDisabled 
        ? { background: 'linear-gradient(to bottom right, #888888, #666666, #999999)' }
        : { background: 'linear-gradient(to bottom right, #737373, #525252, #737373)' }
    }
    
    if (variant === 'red') {
      return isDisabled 
        ? { background: 'linear-gradient(to bottom, #cc8888, #aa6666)' }
        : { background: 'linear-gradient(to bottom, #ee5555, #cc3333)' }
    }
    
    return isDisabled 
      ? { background: 'linear-gradient(to bottom, #888888, #666666)' }
      : { background: 'linear-gradient(to bottom, #666666, #444444)' }
  }
  
  const isDisabled = disabled || isLoading
  const variantStyles = variants[variant][isDisabled ? 'disabled' : 'normal']
  const sizeStyles = sizes[size]
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles,
        sizeStyles,
        isDisabled && "pointer-events-none",
        className
      )}
      style={{
        ...getBackgroundStyle(),
        ...style
      }}
      disabled={isDisabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  )
}