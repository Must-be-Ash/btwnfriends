import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { CDPProvider } from '@/components/providers/CDPProvider'
import { Analytics } from '@vercel/analytics/react'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { NetworkStatus } from '@/components/pwa/NetworkStatus'
import { UpdateNotification } from '@/components/pwa/UpdateNotification'
// import { SessionMonitor } from '@/components/pwa/SessionMonitor'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#222222',
}

export const metadata: Metadata = {
  title: 'Between Friends',
  description: 'Your Pal shouldn\'t be taxing you.',
  keywords: [
    'Between Friends',
    'USDC',
    'Payments',
    'Friends',
    'Transfers',
    'CDP',
    'Crypto',
    'Digital Payments',
  ],
  authors: [{ name: 'Between Friends Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/web-app-manifest-192x192.png' },
    ],
    other: [
      { 
        rel: 'android-chrome',
        url: '/web-app-manifest-192x192.png',
        sizes: '192x192'
      },
      { 
        rel: 'android-chrome',
        url: '/web-app-manifest-512x512.png',
        sizes: '512x512'
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Between Friends',
    description: 'Your Pal shouldn\'t be taxing you.',
    url: 'https://btwnfriends.com',
    siteName: 'Between Friends',
    type: 'website',
    images: [
      {
        url: 'https://btwnfriends.com/og.png',
        width: 1200,
        height: 630,
        alt: 'Between Friends - Your Pal shouldn\'t be taxing you',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Between Friends',
    description: 'Your Pal shouldn\'t be taxing you.',
    images: ['https://btwnfriends.com/og.png'],
  },
  metadataBase: new URL('https://btwnfriends.com'),
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Between Friends',
    'format-detection': 'telephone=no',
    'msapplication-tap-highlight': 'no',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <CDPProvider>
          <div className="min-h-screen safe-area-inset">
            {children}
          </div>
          <NetworkStatus />
          <InstallPrompt />
          <UpdateNotification />
          {/* <SessionMonitor /> */}
        </CDPProvider>
        <Analytics />
      </body>
    </html>
  )
}