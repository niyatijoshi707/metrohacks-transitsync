import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DemoBanner from './components/DemoBanner';
import JourneyPlanner from './components/JourneyPlanner';
import ItineraryTimeline from './components/ItineraryTimeline';
import LastMileCards from './components/LastMileCards';
import DelaySimulator from './components/DelaySimulator';
import { planJourney, applyDelay, searchPlaces, type JourneyPlan, type PlaceMatch } from './engine';
import { Train, Bus, Zap, ShieldCheck, MapPin } from 'lucide-react';

export default function App() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Initial pre-filled selections
  const initialOriginMatch = searchPlaces('Paldi').find((p) => p.name === 'Paldi') || null;
  const initialDestMatch = searchPlaces('Vastral Gam').find((p) => p.name === 'Vastral Gam') || null;

  // TWO separate pieces of state per field: query (text) and selected (PlaceMatch object)
  const [originQuery, setOriginQuery] = useState('Paldi');
  const [originSelected, setOriginSelected] = useState<PlaceMatch | null>(initialOriginMatch);
  const [destQuery, setDestQuery] = useState('Vastral Gam');
  const [destSelected, setDestSelected] = useState<PlaceMatch | null>(initialDestMatch);

  const [basePlan, setBasePlan] = useState<JourneyPlan | null>(null);
  const [activePlan, setActivePlan] = useState<JourneyPlan | null>(null);
  const [delayMin, setDelayMin] = useState(0);
  const [delayMode, setDelayMode] = useState<'metro' | 'amts' | 'brts'>('metro');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track online/offline status and tab visibility
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleVisibility = () => setIsTabHidden(document.hidden);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const getCurrentTimeString = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const minOfDay = d.getHours() * 60 + d.getMinutes();
    if (minOfDay < 6 * 60 || minOfDay > 22 * 60) {
      return '08:30';
    }
    return `${hh}:${mm}`;
  };

  const handleFindRoute = useCallback(() => {
    if (!originSelected || !destSelected) return;
    setErrorMessage(null);
    try {
      const timeStr = getCurrentTimeString();
      const plan = planJourney(originSelected.name, destSelected.name, timeStr);
      setBasePlan(plan);
      setActivePlan(plan);
      setDelayMin(0);
      setDelayMode('metro');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to plan route';
      setErrorMessage(msg);
      setBasePlan(null);
      setActivePlan(null);
    }
  }, [originSelected, destSelected]);

  const handleApplyDelay = (mode: 'metro' | 'amts' | 'brts', minutes: number) => {
    if (!basePlan) return;
    setDelayMode(mode);
    setDelayMin(minutes);
    const delayed = applyDelay(basePlan, mode, minutes);
    setActivePlan(delayed);
  };

  const handleResetDelay = () => {
    setDelayMin(0);
    if (basePlan) {
      setActivePlan(basePlan);
    }
  };

  const handleQuickDemo = (demoOrigin: string, demoDest: string) => {
    const oMatch = searchPlaces(demoOrigin).find((p) => p.name.toLowerCase() === demoOrigin.toLowerCase()) || null;
    const dMatch = searchPlaces(demoDest).find((p) => p.name.toLowerCase() === demoDest.toLowerCase()) || null;
    setOriginQuery(demoOrigin);
    setOriginSelected(oMatch);
    setDestQuery(demoDest);
    setDestSelected(dMatch);
    setErrorMessage(null);
    if (oMatch && dMatch) {
      try {
        const plan = planJourney(oMatch.name, dMatch.name, '08:00');
        setBasePlan(plan);
        setActivePlan(plan);
        setDelayMin(0);
        setDelayMode('metro');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unable to plan route';
        setErrorMessage(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4E8D8]/30 flex flex-col font-sans text-gray-800 relative overflow-x-hidden">
      {/* 1. FIXED PAGE BACKGROUND (CHANGE 1: /images/metro-bg.webp, does not scroll) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none select-none bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/metro-bg.webp)',
        }}
      />

      <Header isOnline={isOnline} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5 relative z-10">
        {/* Prominent demo disclaimer */}
        <DemoBanner />

        {/* Journey planner form */}
        <JourneyPlanner
          originQuery={originQuery}
          originSelected={originSelected}
          destQuery={destQuery}
          destSelected={destSelected}
          onOriginQueryChange={(val) => {
            setOriginQuery(val);
            setErrorMessage(null);
          }}
          onOriginSelect={(item) => {
            setOriginSelected(item);
            setErrorMessage(null);
          }}
          onDestQueryChange={(val) => {
            setDestQuery(val);
            setErrorMessage(null);
          }}
          onDestSelect={(item) => {
            setDestSelected(item);
            setErrorMessage(null);
          }}
          onFindRoute={handleFindRoute}
        />

        {/* Error message if planning failed */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs font-medium"
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Active Route Section or Welcome Initial State */}
        {activePlan ? (
          <section aria-label="Route Results" className="space-y-4">
            {/* Delay simulator panel for judges */}
            <DelaySimulator
              currentDelayMin={delayMin}
              currentMode={delayMode}
              onApplyDelay={handleApplyDelay}
              onReset={handleResetDelay}
            />

            {/* Itinerary timeline with source chips & missed connection detection */}
            <ItineraryTimeline plan={activePlan} />

            {/* Last-mile feeder cards + Metro Route Map */}
            <LastMileCards
              lastMile={activePlan.lastMileOptions}
              isOnline={isOnline}
              destinationName={activePlan.destination}
            />
          </section>
        ) : (
          <section
            aria-label="Welcome Guide"
            className="bg-[#F4E8D8] border border-[#E3D2B8] rounded-lg p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#E3D2B8]">
              <Zap size={20} className="text-[#FF9933]" />
              <h3 className="font-bold text-[#0B2545] text-base">
                Welcome to TransitSync
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              TransitSync is an offline-first multi-modal journey planner for Ahmedabad Metro, AMTS feeder buses, Janmarg BRTS corridors, and auto-rickshaws. All datasets are bundled locally and cached for full offline airplane-mode functionality.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs space-y-1">
                <div className="font-bold text-[#0B2545] flex items-center gap-1.5">
                  <Train size={14} className="text-blue-700" />
                  <span>54 Metro Stations</span>
                </div>
                <p className="text-gray-600">
                  Official GMRC timetable w.e.f. 18 May 2026 across Red, Blue, Yellow, and Violet corridors.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Bus size={14} className="text-amber-700" />
                  <span>AMTS & BRTS Feeders</span>
                </div>
                <p className="text-gray-600">
                  GTFS schedules for AMTS routes Metro1–14 & Feeder-8/9, plus walk distance to nearest BRTS stops.
                </p>
              </div>

              <div className="p-3 bg-green-50/70 border border-green-200 rounded text-xs space-y-1">
                <div className="font-bold text-green-900 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-green-700" />
                  <span>Offline First PWA</span>
                </div>
                <p className="text-gray-600">
                  Zero server round-trips. Routing engine, spatial lookups, and timetables run 100% in browser.
                </p>
              </div>
            </div>

            {/* Quick Demo Routes */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Judge Quick-Demo Scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('Paldi', 'Vastral Gam')}
                  className="text-xs bg-[#EFE0CD] hover:bg-[#E3D2B8] hover:border-amber-400 border border-[#E3D2B8] text-gray-900 rounded px-2.5 py-1.5 font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MapPin size={12} className="text-[#FF9933]" />
                  <span>Paldi → Vastral Gam (Interchange & Missed Transfer Demo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('APMC', 'Gujarat Science City')}
                  className="text-xs bg-[#EFE0CD] hover:bg-[#E3D2B8] hover:border-amber-400 border border-[#E3D2B8] text-gray-900 rounded px-2.5 py-1.5 font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MapPin size={12} className="text-[#FF9933]" />
                  <span>APMC → Science City (Place Disambiguation & Auto Last-Mile)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('Thaltej Gam', 'GIFT City')}
                  className="text-xs bg-[#EFE0CD] hover:bg-[#E3D2B8] hover:border-amber-400 border border-[#E3D2B8] text-gray-900 rounded px-2.5 py-1.5 font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MapPin size={12} className="text-[#FF9933]" />
                  <span>Thaltej Gam → GIFT City (Phase-2 Violet Corridor)</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer with moving orange metro train on dedicated 28px top strip (CHANGE 4) */}
      <footer className="bg-[#0B2545] text-gray-400 text-xs text-center mt-12 relative z-10 border-t border-blue-900 shadow-inner">
        {/* Dedicated ~28px track and train strip along top edge of footer */}
        <div
          aria-hidden="true"
          className="h-[28px] relative overflow-hidden bg-[#071930] pointer-events-none select-none border-b border-blue-950/60"
        >
          <style>{`
            @keyframes footerTrainRun {
              0% {
                transform: translate3d(100vw, 0, 0) scaleX(-1);
              }
              100% {
                transform: translate3d(-100%, 0, 0) scaleX(-1);
              }
            }
            .footer-train-anim {
              will-change: transform;
              animation: footerTrainRun 30s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .footer-train-anim {
                animation: none !important;
                transform: translate3d(65vw, 0, 0) scaleX(-1) !important;
              }
            }
          `}</style>

          {/* Track Line */}
          <div className="absolute bottom-[4px] left-0 right-0 h-[2px] bg-[#FF9933]/40" />

          {/* Moving Orange Metro Train (driving right to left) */}
          <div
            className="absolute bottom-[5px] left-0 footer-train-anim"
            style={{ animationPlayState: isTabHidden ? 'paused' : 'running' }}
          >
            <svg
              width="120"
              height="20"
              viewBox="0 0 120 20"
              className="block"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Train body in theme orange #FF9933 */}
              <path
                d="M 4 16 C 14 16 22 14 30 10 C 38 6 46 4 56 4 L 118 4 L 118 16 Z"
                fill="#FF9933"
              />
              {/* Windshield */}
              <path
                d="M 12 13 C 18 12 24 10 30 7 L 28 6 C 21 8 15 10 9 11 Z"
                fill="#0B2545"
              />
              {/* White windows */}
              <rect x="38" y="7" width="8" height="4" rx="1" fill="#ffffff" />
              <rect x="50" y="7" width="8" height="4" rx="1" fill="#ffffff" />
              <rect x="62" y="7" width="8" height="4" rx="1" fill="#ffffff" />
              <rect x="74" y="7" width="8" height="4" rx="1" fill="#ffffff" />
              <rect x="86" y="7" width="8" height="4" rx="1" fill="#ffffff" />
              <rect x="98" y="7" width="8" height="4" rx="1" fill="#ffffff" />
              <rect x="110" y="7" width="6" height="4" rx="1" fill="#ffffff" />
              {/* Wheels */}
              <circle cx="28" cy="17" r="1.5" fill="#ffffff" />
              <circle cx="36" cy="17" r="1.5" fill="#ffffff" />
              <circle cx="95" cy="17" r="1.5" fill="#ffffff" />
              <circle cx="103" cy="17" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Footer text content */}
        <div className="py-4 px-4">
          <p className="text-blue-200 font-medium">
            TransitSync · METRO HACKS by GDG Gandhinagar · Track 2 City Public Transport · Problem 6 Multi-Modal Coordination
          </p>
          <p className="mt-1 text-gray-400">
            Demo uses scheduled timetables and simulated delays, not live GMRC/AMTS/BRTS data.
          </p>
        </div>
      </footer>
    </div>
  );
}
