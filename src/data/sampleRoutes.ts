/**
 * SAMPLE DATA ONLY — NOT live transport information.
 * All schedules, stops, and times are illustrative for demo purposes.
 * Source: Ahmedabad Metro Phase-1 published corridor map (publicly available),
 * approximated for demonstration.
 */

export type TransitMode = 'metro' | 'brts' | 'amts' | 'auto';

export interface Stop {
  id: string;
  name: string;
  interchange?: TransitMode[]; // other modes available at this stop
  isTerminus?: boolean;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;           // Tailwind color class suffix
  hexColor: string;        // for inline use
  direction: string;
  stops: Stop[];
}

export interface LastMileOption {
  mode: TransitMode;
  label: string;
  description: string;
  approxWait: string;      // simulated, not live
  fare: string;            // simulated
}

// ── Metro Lines (sample, not exhaustive) ────────────────────────────────────
export const METRO_LINES: MetroLine[] = [
  {
    id: 'line1',
    name: 'East–West Corridor (Line 1)',
    color: 'blue',
    hexColor: '#1E40AF',
    direction: 'Thaltej Gam → Vastral Gam',
    stops: [
      { id: 'thaltej-gam',   name: 'Thaltej Gam',         isTerminus: true },
      { id: 'thaltej',       name: 'Thaltej' },
      { id: 'doordarshan',   name: 'Doordarshan Kendra' },
      { id: 'gurukul',       name: 'Gurukul' },
      { id: 'gujarat-uni',   name: 'Gujarat University',   interchange: ['brts'] },
      { id: 'commerce-six',  name: 'Commerce Six Roads',   interchange: ['brts'] },
      { id: 'nehru-nagar',   name: 'Nehru Nagar' },
      { id: 'municipal',     name: 'Old High Court',       interchange: ['amts'] },
      { id: 'gheekanta',     name: 'Gheekanta',            interchange: ['amts', 'auto'] },
      { id: 'kalupur',       name: 'Kalupur Railway Station', interchange: ['amts', 'brts', 'auto'] },
      { id: 'rbi',           name: 'RBI' },
      { id: 'lal-darwaja',   name: 'Lal Darwaja',         interchange: ['amts', 'brts', 'auto'] },
      { id: 'shahpur',       name: 'Shahpur Gate' },
      { id: 'asarwa',        name: 'Asarwa' },
      { id: 'sarangpur',     name: 'Sarangpur' },
      { id: 'apparel-park',  name: 'Apparel Park' },
      { id: 'vastral-gam',   name: 'Vastral Gam',          isTerminus: true },
    ],
  },
  {
    id: 'line2',
    name: 'North–South Corridor (Line 2)',
    color: 'red',
    hexColor: '#B91C1C',
    direction: 'APMC → Motera',
    stops: [
      { id: 'apmc',          name: 'APMC',                 isTerminus: true },
      { id: 'rabari-colony', name: 'Rabari Colony' },
      { id: 'amraiwadi',     name: 'Amraiwadi' },
      { id: 'nirnay-nagar',  name: 'Nirnay Nagar' },
      { id: 'vinzol',        name: 'Vinzol' },
      { id: 'vastral',       name: 'Vastral' },
    ],
  },
];

export const STATIONS: { id: string; name: string; line: string }[] = METRO_LINES.flatMap(
  (line) => line.stops.map((s) => ({ id: s.id, name: s.name, line: line.id })),
);

// ── Last-Mile Options (simulated) ────────────────────────────────────────────
export const LAST_MILE_OPTIONS: LastMileOption[] = [
  {
    mode: 'amts',
    label: 'AMTS City Bus',
    description: 'Ahmedabad Municipal Transport Service — urban bus network covering most neighbourhoods.',
    approxWait: '~8 min (simulated)',
    fare: '₹5 – ₹15 (simulated)',
  },
  {
    mode: 'brts',
    label: 'Janmarg BRTS',
    description: 'Bus Rapid Transit System — dedicated corridors on SG Highway, Satellite Road, and other arterials.',
    approxWait: '~5 min (simulated)',
    fare: '₹5 – ₹20 (simulated)',
  },
  {
    mode: 'auto',
    label: 'Auto-Rickshaw',
    description: 'Available outside most metro stations. Metered fare as per RTO tariff.',
    approxWait: 'Immediate – 3 min (simulated)',
    fare: '₹25 minimum + meter (simulated)',
  },
];

// ── Demo Journey (hardcoded sample) ─────────────────────────────────────────
export const SAMPLE_JOURNEY = {
  from: 'Thaltej Gam',
  to: 'Kalupur Railway Station',
  line: METRO_LINES[0],
  boardAt: 'Thaltej Gam',
  alightAt: 'Kalupur Railway Station',
  stops: METRO_LINES[0].stops.slice(0, 10),
  durationMin: 28,       // simulated
  fareINR: 30,           // simulated
  nextDeparture: '09:14', // simulated
};
