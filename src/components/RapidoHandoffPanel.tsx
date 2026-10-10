/**
 * RapidoHandoffPanel — auto-rickshaw last-mile handoff component.
 *
 * Since Rapido has no public deep-link URL format for prefilling locations,
 * this component implements the documented reliable fallback:
 *  - Opens https://www.rapido.bike/ in a new tab.
 *  - Shows pickup and destination from the selected journey.
 *  - Provides Copy Pickup, Copy Destination, and Copy Journey Details buttons.
 *  - Falls back to displaying text for manual copy if clipboard is denied.
 */
import { useState } from 'react';
import { Car, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  buildRapidoUrl,
  buildJourneyDetailText,
  copyToClipboard,
  RAPIDO_BASE_URL,
} from '../data/rapidoHandoff';

interface RapidoHandoffPanelProps {
  pickupStation: string | null;
  dropStation: string | null;
}

type CopyState = 'idle' | 'copied' | 'failed';

export default function RapidoHandoffPanel({
  pickupStation,
  dropStation,
}: RapidoHandoffPanelProps) {
  const [pickupCopyState,  setPickupCopyState]  = useState<CopyState>('idle');
  const [dropCopyState,    setDropCopyState]    = useState<CopyState>('idle');
  const [detailCopyState,  setDetailCopyState]  = useState<CopyState>('idle');
  // When clipboard is denied, we surface the text for manual copy
  const [showManualCopy,   setShowManualCopy]   = useState(false);

  const hasPickup = Boolean(pickupStation);
  const hasDrop   = Boolean(dropStation);

  const rapido = {
    pickupStation: pickupStation ?? '',
    dropStation:   dropStation   ?? '',
  };

  const detailText = buildJourneyDetailText(rapido);
  const rapUrl     = buildRapidoUrl(rapido);

  const handleCopy = async (
    text: string,
    setState: (s: CopyState) => void,
  ) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } else {
      setState('failed');
      setShowManualCopy(true);
    }
  };

  const CopyButton = ({
    label,
    text,
    state,
    onCopy,
  }: {
    label: string;
    text: string;
    state: CopyState;
    onCopy: () => void;
  }) => (
    <button
      type="button"
      onClick={onCopy}
      disabled={!text}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors
        ${state === 'copied'
          ? 'bg-green-50 border-green-400 text-green-700'
          : state === 'failed'
          ? 'bg-red-50 border-red-300 text-red-600'
          : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400`}
      aria-label={label}
    >
      {state === 'copied' ? (
        <Check size={12} aria-hidden="true" />
      ) : (
        <Copy size={12} aria-hidden="true" />
      )}
      {state === 'copied' ? 'Copied!' : state === 'failed' ? 'Denied' : label}
    </button>
  );

  return (
    <div
      className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex flex-col gap-3"
      role="region"
      aria-label="Auto-Rickshaw last-mile via Rapido"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Car size={18} className="text-yellow-700 shrink-0" aria-hidden="true" />
        <span className="text-sm font-bold text-yellow-800">
          Auto-Rickshaw — Continue via Rapido
        </span>
      </div>

      {/* Missing-value warning */}
      {(!hasPickup || !hasDrop) && (
        <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {!hasPickup && !hasDrop
              ? 'Plan a journey first to see pickup and destination details.'
              : !hasPickup
              ? 'Pickup station not available — plan a journey first.'
              : 'Destination station not available — plan a journey first.'}
          </span>
        </div>
      )}

      {/* Journey details panel */}
      {(hasPickup || hasDrop) && (
        <dl className="grid grid-cols-1 gap-1.5 text-xs text-gray-700">
          <div className="flex items-start justify-between gap-2">
            <div>
              <dt className="text-gray-500 font-medium">Pickup:</dt>
              <dd className="font-semibold text-gray-900">{pickupStation ?? '—'}</dd>
            </div>
            <CopyButton
              label="Copy Pickup"
              text={pickupStation ?? ''}
              state={pickupCopyState}
              onCopy={() => handleCopy(pickupStation ?? '', setPickupCopyState)}
            />
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <dt className="text-gray-500 font-medium">Destination:</dt>
              <dd className="font-semibold text-gray-900">{dropStation ?? '—'}</dd>
            </div>
            <CopyButton
              label="Copy Destination"
              text={dropStation ?? ''}
              state={dropCopyState}
              onCopy={() => handleCopy(dropStation ?? '', setDropCopyState)}
            />
          </div>
        </dl>
      )}

      {/* Action row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Open Rapido button */}
        <a
          href={rapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#FF9933] hover:bg-[#e8882a] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#FF9933]"
          aria-label="Open Rapido website in a new tab"
        >
          <ExternalLink size={12} aria-hidden="true" />
          Open Rapido
        </a>

        {/* Copy journey details */}
        {detailText && (
          <CopyButton
            label="Copy Journey Details"
            text={detailText}
            state={detailCopyState}
            onCopy={() => handleCopy(detailText, setDetailCopyState)}
          />
        )}
      </div>

      {/* Manual copy fallback (shown when clipboard is denied) */}
      {showManualCopy && detailText && (
        <div className="mt-1">
          <p className="text-xs text-gray-500 mb-1">
            Clipboard access was denied. Copy the details below manually:
          </p>
          <textarea
            readOnly
            rows={6}
            value={detailText}
            className="w-full text-xs font-mono border border-gray-300 rounded px-2 py-1.5 bg-white resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            aria-label="Journey details for manual copy"
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-yellow-700 leading-snug">
        Rapido availability, ride matching, fare, and booking are handled entirely by Rapido.
        TransitSync has no partnership with or API access to Rapido.
        No ride is booked by clicking "Open Rapido". Fare shown above (if any) is an illustrative demo estimate only.
        External link opens{' '}
        <span className="font-semibold">{RAPIDO_BASE_URL}</span> in a new tab.
      </p>
    </div>
  );
}
