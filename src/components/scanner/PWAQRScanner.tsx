"use client";

import { useState, useEffect, useRef, useCallback } from 'react'
import jsQR from 'jsqr'
import { Camera, X, FlashlightIcon as FlashOff, FlashlightIcon as FlashOn } from 'lucide-react'

interface QRScanResult {
  walletAddress?: string
  amount?: string
  message?: string
  name?: string
  url?: string
}

interface PWAQRScannerProps {
  onScanSuccess: (result: QRScanResult) => void
  onClose: () => void
  className?: string
}

export function PWAQRScanner({ onScanSuccess, onClose, className = '' }: PWAQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const mountedRef = useRef(true)

  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Initialize camera and start scanning
  const startCamera = async () => {
    try {
      console.log('🎥 Starting camera for QR scanning...')

      // Check if getUserMedia is available (PWA compatibility)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser')
      }

      // Request camera permission with back camera preference
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera for QR scanning
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (mountedRef.current) {
        setStream(mediaStream)
        setHasPermission(true)
        setError(null)
      }

      if (videoRef.current && mountedRef.current) {
        videoRef.current.srcObject = mediaStream
        // Handle play promise properly to avoid uncaught errors
        videoRef.current.play()
          .then(() => {
            console.log('✅ Video playback started')
            if (mountedRef.current) {
              setIsScanning(true)
            }
          })
          .catch(err => {
            console.warn('⚠️ Video play failed:', err)
            // Try to play again after a short delay
            setTimeout(() => {
              if (videoRef.current && mountedRef.current) {
                videoRef.current.play().catch(e => console.error('Video play retry failed:', e))
              }
            }, 100)
          })
      }

      console.log('✅ Camera started successfully')
    } catch (err) {
      console.error('❌ Camera access error:', err)
      if (mountedRef.current) {
        setHasPermission(false)
      }

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access and try again.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.')
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported in this browser.')
        } else {
          setError(`Camera error: ${err.message}`)
        }
      } else {
        setError('Failed to access camera.')
      }
    }
  }


  // Parse QR code data
  const parseQRData = useCallback((data: string): QRScanResult => {
    console.log('🔍 Parsing QR data:', data)

    try {
      // Check if it's a URL
      const url = new URL(data)

      // Extract parameters from URL
      const searchParams = url.searchParams
      const walletAddress = searchParams.get('to') || searchParams.get('address')
      const amount = searchParams.get('amount')
      const message = searchParams.get('message') || searchParams.get('memo')
      const name = searchParams.get('name') || searchParams.get('displayName')

      return {
        walletAddress: walletAddress || undefined,
        amount: amount || undefined,
        message: message || undefined,
        name: name || undefined,
        url: data
      }
    } catch {
      // If not a valid URL, try to parse as raw wallet address
      const addressMatch = data.match(/^(0x[a-fA-F0-9]{40})$/)
      if (addressMatch) {
        return {
          walletAddress: addressMatch[1],
          url: data
        }
      }

      // Return raw data if nothing else matches
      return { url: data }
    }
  }, [])

  // QR code scanning loop
  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode)
      return
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for QR detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Scan for QR code
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    })

    if (qrCode) {
      console.log('✅ QR Code detected:', qrCode.data)

      // Parse the QR data
      const result = parseQRData(qrCode.data)

      // Provide haptic feedback if available (PWA feature)
      if ('vibrate' in navigator) {
        navigator.vibrate(100)
      }

      // Stop scanning and return result
      setIsScanning(false)
      onScanSuccess(result)
      return
    }


    // Continue scanning
    animationFrameRef.current = requestAnimationFrame(scanQRCode)
  }, [isScanning, onScanSuccess, parseQRData])

  // Start scanning when video is ready
  useEffect(() => {
    if (isScanning && videoRef.current && videoRef.current.readyState >= 2) {
      scanQRCode()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isScanning, scanQRCode])

  // Toggle flashlight (if supported)
  const toggleFlash = useCallback(async () => {
    if (!stream) return

    try {
      const track = stream.getVideoTracks()[0]
      if (track && 'torch' in track.getCapabilities()) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled } as MediaTrackConstraints]
        })
        setFlashEnabled(!flashEnabled)
      }
    } catch (err) {
      console.warn('Flash not supported:', err)
    }
  }, [stream, flashEnabled])

  // Initialize camera on mount
  useEffect(() => {
    mountedRef.current = true
    startCamera()

    return () => {
      mountedRef.current = false
      // Cleanup camera on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // Note: stream cleanup is handled by React state cleanup
    }
  }, []) // Empty dependency array - only run once on mount/unmount

  // Handle close
  const handleClose = useCallback(() => {
    // Stop camera directly without referencing stopCamera
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsScanning(false)
    onClose()
  }, [stream, onClose])

  if (hasPermission === false) {
    return (
      <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-[#222222] rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Camera Access Required</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={startCamera}
              className="w-full py-3 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="w-full py-3 px-6 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-black z-50 ${className}`}>
      {/* Video Stream */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* Hidden canvas for QR processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={handleClose}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h1 className="text-white text-lg font-semibold">Scan QR Code</h1>

        <button
          onClick={toggleFlash}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {flashEnabled ? (
            <FlashOn className="w-5 h-5" />
          ) : (
            <FlashOff className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Scanning Area - Perfectly centered on full screen */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* QR Code Frame - Minimal corner design */}
            <div className="w-64 h-64 relative">
              {/* Top-left corner */}
              <div className="absolute top-0 left-0 w-6 h-6">
                <div className="absolute top-0 left-0 w-6 h-1.5 bg-[#F5F5F5] rounded-full"></div>
                <div className="absolute top-0 left-0 w-1.5 h-6 bg-[#F5F5F5] rounded-full"></div>
              </div>

              {/* Top-right corner */}
              <div className="absolute top-0 right-0 w-6 h-6">
                <div className="absolute top-0 right-0 w-6 h-1.5 bg-[#F5F5F5] rounded-full"></div>
                <div className="absolute top-0 right-0 w-1.5 h-6 bg-[#F5F5F5] rounded-full"></div>
              </div>

              {/* Bottom-left corner */}
              <div className="absolute bottom-0 left-0 w-6 h-6">
                <div className="absolute bottom-0 left-0 w-6 h-1.5 bg-[#F5F5F5] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1.5 h-6 bg-[#F5F5F5] rounded-full"></div>
              </div>

              {/* Bottom-right corner */}
              <div className="absolute bottom-0 right-0 w-6 h-6">
                <div className="absolute bottom-0 right-0 w-6 h-1.5 bg-[#F5F5F5] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-1.5 h-6 bg-[#F5F5F5] rounded-full"></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-12 text-center">

              <p className="text-white/70 text-sm">
              Position QR code within the frame
              </p>
            </div>
          </div>
        </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="text-center">
          <p className="text-white/70 text-sm">
            Scan payment requests from Between Friends users
          </p>
        </div>
      </div>
    </div>
  )
}