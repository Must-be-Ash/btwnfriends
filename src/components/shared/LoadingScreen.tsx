interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222222]">
      <div className="text-center backdrop-blur-xl bg-[#2A2A2A]/80 border border-[#4A4A4A] rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 border-4 border-[#4A4A4A] border-t-[#B8B8B8] rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-[#CCCCCC] mb-2">Between Friends</h2>
        <p className="text-[#B8B8B8]">{message}</p>
      </div>
    </div>
  )
}