import { Bus, Bike, Car } from 'lucide-react';
import type { LastMileOption } from '../data/sampleRoutes';

interface LastMilePanelProps {
  options: LastMileOption[];
}

const modeIcon = (mode: string) => {
  switch (mode) {
    case 'brts':
    case 'amts':
      return <Bus size={20} aria-hidden="true" />;
    case 'auto':
      return <Car size={20} aria-hidden="true" />;
    default:
      return <Bike size={20} aria-hidden="true" />;
  }
};

const modeAccent: Record<string, { bg: string; border: string; icon: string }> = {
  amts:  { bg: 'bg-orange-50',  border: 'border-orange-200', icon: 'text-orange-600' },
  brts:  { bg: 'bg-green-50',   border: 'border-green-200',  icon: 'text-green-700'  },
  auto:  { bg: 'bg-yellow-50',  border: 'border-yellow-300', icon: 'text-yellow-700' },
};

export default function LastMilePanel({ options }: LastMilePanelProps) {
  return (
    <section aria-labelledby="lastmile-heading">
      <h3
        id="lastmile-heading"
        className="text-sm font-bold text-[#0B2545] uppercase tracking-wide mb-3"
      >
        Last-Mile Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const accent = modeAccent[opt.mode] ?? {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            icon: 'text-gray-600',
          };
          return (
            <div
              key={opt.mode}
              className={`rounded-lg border ${accent.bg} ${accent.border} p-4 flex flex-col gap-2`}
              role="article"
              aria-label={opt.label}
            >
              <div className={`flex items-center gap-2 font-semibold text-gray-800 ${accent.icon}`}>
                {modeIcon(opt.mode)}
                <span className="text-sm">{opt.label}</span>
              </div>
              <p className="text-xs text-gray-600 leading-snug">{opt.description}</p>
              <dl className="text-xs text-gray-700 space-y-0.5 mt-auto">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Wait:</dt>
                  <dd className="font-medium">{opt.approxWait}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fare:</dt>
                  <dd className="font-medium">{opt.fare}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
}
