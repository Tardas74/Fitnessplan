/**
 * ICS Parser – Kalender-Events aus calendar.ics laden
 */

export function unfoldIcs(text) {
  return text.replace(/\r\n[ \t]/g, '').split(/\r\n|\n|\r/);
}

export function unescapeIcsText(s) {
  return (s || '')
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

export function parseIcsDate(val) {
  // Format: 20260803T063000 oder 20260803T043000Z oder 20260808 (all-day)
  const isUtc = /Z$/.test(val);
  const m = val.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/);

  if (!m) return null;

  const [, y, mo, d, h, mi, se] = m;

  if (h === undefined) {
    // All-day event
    return { date: new Date(Number(y), Number(mo) - 1, Number(d)), allDay: true };
  }

  if (isUtc) {
    return {
      date: new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(se))),
      allDay: false,
    };
  }

  // Naive local time (interpreted as browser-local)
  return {
    date: new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(se)),
    allDay: false,
  };
}

export function parseIcs(text) {
  const lines = unfoldIcs(text);
  const events = [];
  let cur = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      cur = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (cur) events.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;

    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const left = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const [prop] = left.split(';');

    if (prop === 'DTSTART') cur.dtstart = parseIcsDate(value);
    else if (prop === 'DTEND') cur.dtend = parseIcsDate(value);
    else if (prop === 'SUMMARY') cur.summary = unescapeIcsText(value);
    else if (prop === 'DESCRIPTION') cur.description = unescapeIcsText(value);
    else if (prop === 'LOCATION') cur.location = unescapeIcsText(value);
    else if (prop === 'RRULE') cur.rrule = value;
  }

  return events;
}

export function occurrencesInWeek(events, weekStart, weekEnd) {
  const out = [];

  for (const ev of events) {
    if (!ev.dtstart) continue;

    const durationMs = ev.dtend && ev.dtend.date ? ev.dtend.date - ev.dtstart.date : 45 * 60 * 1000;

    if (ev.rrule && /FREQ=WEEKLY/.test(ev.rrule)) {
      // Find occurrence in [weekStart, weekEnd) with same weekday
      const startDay = ev.dtstart.date.getDay();
      for (let d = new Date(weekStart); d < weekEnd; d.setDate(d.getDate() + 1)) {
        if (
          d.getDay() === startDay &&
          d >= new Date(ev.dtstart.date.getFullYear(), ev.dtstart.date.getMonth(), ev.dtstart.date.getDate())
        ) {
          const occStart = new Date(d);
          occStart.setHours(ev.dtstart.date.getHours(), ev.dtstart.date.getMinutes(), ev.dtstart.date.getSeconds());
          out.push({ start: occStart, summary: ev.summary, description: ev.description, location: ev.location });
        }
      }
    } else {
      if (ev.dtstart.date >= weekStart && ev.dtstart.date < weekEnd) {
        out.push({ start: ev.dtstart.date, summary: ev.summary, description: ev.description, location: ev.location });
      }
    }
  }

  out.sort((a, b) => a.start - b.start);
  return out;
}

export function getWeekMonday(date, weekOffset = 0) {
  const now = date || new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

export function formatWeekRange(monday) {
  const pad = (n) => String(n).padStart(2, '0');
  const fmtDeShort = (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`;
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return `${fmtDeShort(monday)} – ${fmtDeShort(sunday)} ${sunday.getFullYear()}`;
}
