import { MapPin, Navigation, Search } from 'lucide-react';
import { STATIONS } from '../data/sampleRoutes';

interface JourneyPlannerProps {
  from: string;
  to: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onFindRoute: () => void;
}

export default function JourneyPlanner({
  from,
  to,
  onFromChange,
  onToChange,
  onFindRoute,
}: JourneyPlannerProps) {
  return (
    <section
      aria-labelledby="planner-heading"
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6"
    >
      <h2
        id="planner-heading"
        className="text-lg sm:text-xl font-bold text-[#0B2545] mb-5 flex items-center gap-2"
      >
        <Navigation size={20} className="text-[#FF9933]" aria-hidden="true" />
        Plan Your Journey
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Boarding station selector */}
        <div>
          <label
            htmlFor="boarding-select"
            className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"
          >
            <MapPin size={12} className="inline mr-1 text-[#0B2545]" aria-hidden="true" />
            Boarding Station
          </label>
          <select
            id="boarding-select"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545]"
          >
            <option value="">— Select boarding station —</option>
            {STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination search */}
        <div>
          <label
            htmlFor="destination-input"
            className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide"
          >
            <Search size={12} className="inline mr-1 text-[#0B2545]" aria-hidden="true" />
            Destination
          </label>
          <input
            id="destination-input"
            type="text"
            list="destination-list"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            placeholder="Search destination station…"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] placeholder:text-gray-400"
          />
          <datalist id="destination-list">
            {STATIONS.map((s) => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
        </div>
      </div>

      <button
        type="button"
        onClick={onFindRoute}
        disabled={!from || !to}
        className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#163a6b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2545]"
        aria-label="Find route between selected stations"
      >
        Find Route →
      </button>
    </section>
  );
}
