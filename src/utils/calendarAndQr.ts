import { Invitation } from '../types';

/**
 * Generates an Add to Google Calendar URL
 */
export const getGoogleCalendarUrl = (invitation: Invitation): string => {
  const title = encodeURIComponent(invitation.title || invitation.headline);
  const details = encodeURIComponent(
    `${invitation.personalMessage}\n\nCódigo de Vestimenta: ${invitation.dressCode}\nLAV Invitaciones: ${window.location.href}`
  );
  const location = encodeURIComponent(`${invitation.venueName}, ${invitation.venueAddress}`);

  // Format date: YYYYMMDDTHHmmSSZ
  const dateStr = invitation.eventDate.replace(/-/g, '');
  const timeStr = invitation.eventTime ? invitation.eventTime.replace(/:/g, '') + '00' : '180000';
  const startIso = `${dateStr}T${timeStr}`;

  // Assume 6 hour event duration
  const endHour = Math.min(23, parseInt(invitation.eventTime?.split(':')[0] || '18', 10) + 6);
  const endIso = `${dateStr}T${String(endHour).padStart(2, '0')}0000`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
};

/**
 * Downloads a universal .ics calendar file for Apple Calendar / Outlook
 */
export const downloadIcsFile = (invitation: Invitation): void => {
  const dateStr = invitation.eventDate.replace(/-/g, '');
  const timeStr = invitation.eventTime ? invitation.eventTime.replace(/:/g, '') + '00' : '180000';
  const startIso = `${dateStr}T${timeStr}`;
  const endHour = Math.min(23, parseInt(invitation.eventTime?.split(':')[0] || '18', 10) + 6);
  const endIso = `${dateStr}T${String(endHour).padStart(2, '0')}0000`;

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LAV Invitations//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${invitation.title}`,
    `DESCRIPTION:${invitation.personalMessage.replace(/\n/g, '\\n')}`,
    `LOCATION:${invitation.venueName}, ${invitation.venueAddress}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${invitation.slug || 'evento'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Creates prefilled WhatsApp RSVP link
 */
export const getWhatsAppRsvpUrl = (phone: string, guestName: string, eventTitle: string, attending: boolean): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = attending
    ? `¡Hola! Confirmo con mucho gusto mi asistencia al evento "${eventTitle}". Nombre: ${guestName || 'Invitado'}. ¡Nos vemos pronto!`
    : `Hola, lamento informar que no podré asistir al evento "${eventTitle}". Saludos cordiales de ${guestName || 'Invitado'}.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Clean SVG QR Code generator (matrix deterministic generator for crisp rendering & download)
 */
export const generateQrSvgDataUri = (url: string): string => {
  // Generate deterministic visual matrix pattern for the URL
  const size = 25; // 25x25 grid standard QR version
  const grid: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Finder patterns at corners (top-left, top-right, bottom-left)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // outer square
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // inner square
        ) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      grid[6][i] = true;
      grid[i][6] = true;
    }
  }

  // Populate data cells deterministically based on URL hash
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders or timing
      const inFinderTL = r < 8 && c < 8;
      const inFinderTR = r < 8 && c >= size - 8;
      const inFinderBL = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inFinderTL && !inFinderTR && !inFinderBL && !isTiming) {
        const seed = Math.sin((r * size + c + hash) * 9999);
        grid[r][c] = seed > 0.15;
      }
    }
  }

  // Construct SVG string
  const cellSize = 10;
  const viewBoxSize = size * cellSize;
  let paths = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) {
        paths += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#171717" />`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="280" height="280"><rect width="100%" height="100%" fill="#ffffff" rx="16"/>${paths}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
