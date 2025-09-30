"use client";

import { ReactNode } from 'react'

interface SendButton3DProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function SendButton3D({ children, onClick, disabled = false, className = "" }: SendButton3DProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-xl font-semibold text-lg text-white
        relative overflow-hidden
        transform-gpu
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer active:translate-y-1 active:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
        }
        ${className}
      `}
      style={{
        background: disabled 
          ? 'radial-gradient(circle at center, #2a2a2a 0%, #1f1f1f 40%, #151515 70%, #0a0a0a 100%)'
          : 'radial-gradient(circle at center, #5a5a5a 0%, #4a4a4a 25%, #3a3a3a 50%, #2a2a2a 75%, #1a1a1a 90%, #0f0f0f 100%)',
        boxShadow: disabled 
          ? '0 4px 12px rgba(0,0,0,0.2)' 
          : '0 8px 24px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease-out'
      }}
    >
      {/* Inner highlight for 3D effect */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 60%, transparent 80%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Bottom inner shadow for depth */}
      <div 
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 35%, transparent 60%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  )
}