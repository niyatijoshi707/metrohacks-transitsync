import { useState, useEffect } from 'react';
import Header from './components/Header';
import DemoBanner from './components/DemoBanner';
import JourneyPlanner from './components/JourneyPlanner';
import RouteCard from './components/RouteCard';
import LastMilePanel from './components/LastMilePanel';
import DelaySimulator from './components/DelaySimulator';
import {
  SAMPLE_JOURNEY,
  LAST_MILE_OPTIONS,
  STATIONS,
} from './data/sampleRoutes';

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [delayMin, setDelayMin] = useState(0);

  // Track online/offline status
  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleFindRoute = () => {
    // Full routing engine not implemented yet — shows sample route for demo.
    setShowRoute(true);
    setDelayMin(0);
  };

  const handleSimulateDelay = () => {
    // Random delay between 3 and 18 minutes (simulated)
    const delay = Math.floor(Math.random() * 16) + 3;
    setDelayMin(delay);
  };

  const handleResetDelay = () => setDelayMin(0);

  // Resolve display names from IDs
  const fromName =
    STATIONS.find((s) => s.id === from)?.name ?? SAMPLE_JOURNEY.from;
  const toName =
    (STATIONS.find((s) => s.name === to)?.name ?? to) || SAMPLE_JOURNEY.to;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isOnline={isOnline} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Prominent demo disclaimer */}
        <DemoBanner />

        {/* Journey planner form */}
        <JourneyPlanner
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onFindRoute={handleFindRoute}
        />

        {/* Route results — shown after "Find Route" or as sample on first load */}
        <section aria-label="Sample route result">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-[#0B2545] uppercase tracking-wide">
              {showRoute ? 'Suggested Route (Demo)' : 'Sample Route Preview'}
            </h2>
            <span className="text-xs text-gray-400 italic">
              Sample data only — not a live schedule
            </span>
          </div>

          {/* Delay simulator */}
          <DelaySimulator
            delayMin={delayMin}
            onSimulate={handleSimulateDelay}
            onReset={handleResetDelay}
          />

          <div className="mt-4">
            <RouteCard
              line={SAMPLE_JOURNEY.line}
              stops={SAMPLE_JOURNEY.stops}
              from={showRoute && from ? fromName : SAMPLE_JOURNEY.from}
              to={showRoute && to   ? toName   : SAMPLE_JOURNEY.to}
              durationMin={SAMPLE_JOURNEY.durationMin}
              fareINR={SAMPLE_JOURNEY.fareINR}
              nextDeparture={SAMPLE_JOURNEY.nextDeparture}
              delayMin={delayMin}
            />
          </div>
        </section>

        {/* Last-mile options */}
        <LastMilePanel options={LAST_MILE_OPTIONS} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#0B2545] text-gray-400 text-xs text-center py-4 px-4">
        <p className="text-blue-200">
          TransitSync · METRO HACKS by GDG Gandhinagar · Track 2 City Public Transport · Problem 6 Multi-Modal Coordination
        </p>
        <p className="mt-1 text-gray-500">
          This is a hackathon prototype. All transport data shown is simulated and for demonstration only.
        </p>
      </footer>
    </div>
  );
}
