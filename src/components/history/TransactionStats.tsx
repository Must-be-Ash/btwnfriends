"use client";

interface TransactionStatsProps {
  stats: {
    total: number
    sent: number
    received: number
    pending: number
  }
}

export function TransactionStats({ stats }: TransactionStatsProps) {
  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      color: 'text-white',
      bgColor: 'bg-[#6B6B6B]',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: 'Sent',
      value: stats.sent,
      color: 'text-white',
      bgColor: 'bg-[#5A5A5A]',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: 'Received',
      value: stats.received,
      color: 'text-white',
      bgColor: 'bg-[#4A4A4A]',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-8.707l3-3a1 1 0 011.414 1.414L9.414 9H13a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: 'Pending',
      value: stats.pending,
      color: 'text-white',
      bgColor: 'bg-[#7A7A7A]',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20 text-center">
          <div className="text-lg font-semibold text-white">
            {item.value.toLocaleString()}
          </div>
          <div className="text-xs text-white/70">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}