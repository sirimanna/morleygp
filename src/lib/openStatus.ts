// Turns the CMS display hours (free text like "Monday – Friday" / "8:30 am – 5:30 pm")
// into a machine-readable weekly schedule the browser can check against Perth time.
// Used by the Hero "Book Now" status line. Kept tolerant of small formatting changes.

export type Slot = { o: number; c: number } | null;

const DAY_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// "8:30 am" -> minutes since midnight (510). Returns null if it can't be read.
function parseTimeToMinutes(input: string): number | null {
  const m = input.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3];
  if (ap === 'pm' && h !== 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

// "Monday – Friday" -> [1,2,3,4,5]; "Saturday" -> [6]; "Public Holidays" -> [].
function expandDays(label: string): number[] {
  const l = label.toLowerCase();
  const range = l.match(/([a-z]+)\s*(?:–|-|to)\s*([a-z]+)/);
  if (range) {
    const start = DAY_ORDER.indexOf(range[1]);
    const end = DAY_ORDER.indexOf(range[2]);
    if (start !== -1 && end !== -1) {
      const out: number[] = [];
      for (let i = start; ; i = (i + 1) % 7) {
        out.push(i);
        if (i === end) break;
      }
      return out;
    }
  }
  for (let i = 0; i < DAY_ORDER.length; i++) {
    if (l.includes(DAY_ORDER[i])) return [i];
  }
  return [];
}

// Weekly schedule as a 7-slot array indexed by JS weekday (0 = Sunday).
export function buildWeeklySchedule(
  hours: { day: string; hours: string; open: boolean }[]
): Slot[] {
  const week: Slot[] = [null, null, null, null, null, null, null];
  for (const row of hours) {
    if (!row.open) continue;
    const parts = row.hours.toLowerCase().split(/–|-|to/).map((s) => s.trim());
    if (parts.length < 2) continue;
    const o = parseTimeToMinutes(parts[0]);
    const c = parseTimeToMinutes(parts[parts.length - 1]);
    if (o == null || c == null || c <= o) continue;
    for (const d of expandDays(row.day)) week[d] = { o, c };
  }
  return week;
}
