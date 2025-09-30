"use client";

import { useRouter } from 'next/navigation'
import { Send, Download, Users, History, ChevronRight } from 'lucide-react'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      id: 'send',
      label: 'Send',
      description: 'Transfer USDC',
      icon: <Send className="w-5 h-5 text-white" />,
      onClick: () => router.push('/send')
    },
    {
      id: 'receive',
      label: 'Receive',
      description: 'Get USDC',
      icon: <Download className="w-5 h-5 text-white" />,
      onClick: () => router.push('/receive')
    },
    {
      id: 'contacts',
      label: 'Contacts',
      description: 'Manage contacts',
      icon: <Users className="w-5 h-5 text-white" />,
      onClick: () => router.push('/contacts')
    },
    {
      id: 'history',
      label: 'History',
      description: 'View transactions',
      icon: <History className="w-5 h-5 text-white" />,
      onClick: () => router.push('/history')
    }
  ]

  return (
    <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                {action.icon}
              </div>
              <div className="text-left">
                <div className="text-white font-medium text-sm">{action.label}</div>
                <div className="text-white/60 text-xs">{action.description}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}