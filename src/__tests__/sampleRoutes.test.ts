import { describe, it, expect } from 'vitest';
import { METRO_LINES, STATIONS, LAST_MILE_OPTIONS, SAMPLE_JOURNEY } from '../data/sampleRoutes';

describe('sampleRoutes data integrity', () => {
  it('should have at least 2 metro lines', () => {
    expect(METRO_LINES.length).toBeGreaterThanOrEqual(2);
  });

  it('each metro line should have a name, color and stops', () => {
    for (const line of METRO_LINES) {
      expect(line.id).toBeTruthy();
      expect(line.name).toBeTruthy();
      expect(line.hexColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(line.stops.length).toBeGreaterThan(0);
    }
  });

  it('STATIONS array flattens all stops with unique ids', () => {
    const ids = STATIONS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have 3 last-mile options (AMTS, BRTS, auto)', () => {
    const modes = LAST_MILE_OPTIONS.map((o) => o.mode);
    expect(modes).toContain('amts');
    expect(modes).toContain('brts');
    expect(modes).toContain('auto');
  });

  it('SAMPLE_JOURNEY should reference a valid metro line', () => {
    const lineIds = METRO_LINES.map((l) => l.id);
    expect(lineIds).toContain(SAMPLE_JOURNEY.line.id);
  });

  it('SAMPLE_JOURNEY stops should be a subset of the line stops', () => {
    const lineStopIds = SAMPLE_JOURNEY.line.stops.map((s) => s.id);
    for (const stop of SAMPLE_JOURNEY.stops) {
      expect(lineStopIds).toContain(stop.id);
    }
  });
});
