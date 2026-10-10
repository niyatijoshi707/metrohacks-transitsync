import { Wifi, WifiOff, Train } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <header className="bg-[#0B2545] text-white shadow-md border-b-4 border-[#FF9933]">
      {/* Gov-style top strip */}
      <div className="bg-[#0a1f3d] py-1 px-4 text-xs text-gray-300 flex items-center justify-between">
        <span className="font-medium tracking-wide">
          भारत सरकार | Government of India &nbsp;·&nbsp; गुजरात &nbsp;·&nbsp; Ahmedabad Municipal Corporation
        </span>
        {/* Offline indicator */}
        <span
          className={`flex items-center gap-1 font-semibold text-xs rounded px-2 py-0.5 ${
            isOnline
              ? 'bg-green-700/60 text-green-100'
              : 'bg-amber-700/70 text-amber-100 animate-pulse'
          }`}
          role="status"
          aria-live="polite"
          aria-label={isOnline ? 'Online' : 'Offline – data may be cached'}
        >
          {isOnline ? (
            <>
              <Wifi size={12} aria-hidden="true" /> Online
            </>
          ) : (
            <>
              <WifiOff size={12} aria-hidden="true" /> Offline – cached data
            </>
          )}
        </span>
      </div>

      {/* Main header row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        {/* Logo area */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF9933]/20 border-2 border-[#FF9933]/50 shrink-0">
          <Train size={26} className="text-[#FF9933]" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-white">
            TransitSync
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 leading-snug">
            Ahmedabad Integrated Public Transport
          </p>
        </div>

        {/* Spacer + right badge */}
        <div className="ml-auto text-right hidden sm:block">
          <span className="block text-[10px] text-blue-300 uppercase tracking-widest">
            Metro&nbsp;·&nbsp;AMTS&nbsp;·&nbsp;BRTS&nbsp;·&nbsp;Auto
          </span>
          <span className="block text-[10px] text-[#FF9933] font-semibold mt-0.5">
            METRO HACKS · GDG Gandhinagar
          </span>
        </div>
      </div>
    </header>
  );
}
