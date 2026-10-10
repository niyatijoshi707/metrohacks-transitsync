import { Zap, RotateCcw } from 'lucide-react';

interface DelaySimulatorProps {
  delayMin: number;
  onSimulate: () => void;
  onReset: () => void;
}

export default function DelaySimulator({ delayMin, onSimulate, onReset }: DelaySimulatorProps) {
  const hasDelay = delayMin > 0;

  return (
    <div className="flex flex-wrap items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        Delay Simulator (demo)
      </span>

      {hasDelay && (
        <span
          role="status"
          aria-live="polite"
          className="text-xs font-bold text-red-600 bg-red-100 border border-red-300 rounded px-2 py-0.5"
        >
          Simulated delay active: +{delayMin} min
        </span>
      )}

      <div className="flex gap-2 ml-auto">
        <button
          type="button"
          onClick={onSimulate}
          className="flex items-center gap-1.5 bg-[#FF9933] hover:bg-[#e8882a] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#FF9933]"
          aria-label="Simulate a random delay on the selected route"
        >
          <Zap size={13} aria-hidden="true" />
          Simulate Delay
        </button>

        {hasDelay && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            aria-label="Reset delay simulation"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
