import { Invitation, RSVPRecord, PricingPlan, Coupon, Template } from '../types';
import { INITIAL_DEMOS, INITIAL_PRICING, INITIAL_COUPONS, INITIAL_TEMPLATES } from '../data/mockData';

const STORAGE_KEYS = {
  INVITATIONS: 'lav_invitations_data_v1',
  TEMPLATES: 'lav_templates_data_v1',
  RSVPS: 'lav_rsvps_data_v1',
  PRICING: 'lav_pricing_data_v1',
  COUPONS: 'lav_coupons_data_v1',
  ADMIN_SESSION: 'lav_admin_auth_v1',
};

// Seed initial RSVPs for the demo invitations
const INITIAL_DEMO_RSVPS: RSVPRecord[] = [
  {
    id: 'rsvp-1',
    invitationId: 'demo-boda-01',
    guestName: 'Mariana Elizondo',
    guestPhone: '+52 55 9821 4433',
    attending: true,
    guestsCount: 2,
    dietaryRestrictions: 'Vegetariana',
    message: '¡Muchísimas felicidades amigos! Nos vemos allá listos para brindar.',
    confirmedAt: '2026-03-12T14:20:00Z',
  },
  {
    id: 'rsvp-2',
    invitationId: 'demo-boda-01',
    guestName: 'Dr. Alejandro Treviño',
    guestPhone: '+52 81 2345 6789',
    attending: true,
    guestsCount: 3,
    dietaryRestrictions: 'Sin gluten',
    message: 'Un honor acompañar a Mateo y Sofía en su gran paso.',
    confirmedAt: '2026-03-13T09:15:00Z',
  },
  {
    id: 'rsvp-3',
    invitationId: 'demo-xv-02',
    guestName: 'Familia Cárdenas González',
    guestPhone: '+52 55 4433 2211',
    attending: true,
    guestsCount: 4,
    message: '¡Hermosa Valentina! Estamos listos para bailar tu vals.',
    confirmedAt: '2026-03-14T18:45:00Z',
  },
  {
    id: 'rsvp-4',
    invitationId: 'demo-kids-03',
    guestName: 'Tía Lucía & Mateo Jr.',
    guestPhone: '+52 81 9988 7766',
    attending: true,
    guestsCount: 2,
    message: '¡Listos para la aventura espacial de Leo!',
    confirmedAt: '2026-03-15T11:00:00Z',
  },
];

export const getStoredInvitations = (): Invitation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(INITIAL_DEMOS));
      return INITIAL_DEMOS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_DEMOS;

    // Ensure all stored invitations have entrance button design & text, and update demos
    const updated = parsed.map((item: Invitation) => {
      const demo = INITIAL_DEMOS.find((d) => d.id === item.id || d.slug === item.slug);
      return {
        ...item,
        entranceButtonDesign: item.entranceButtonDesign || demo?.entranceButtonDesign || 'wax_seal',
        entranceButtonText: item.entranceButtonText || demo?.entranceButtonText || 'Tienes una invitación',
      };
    });

    const missingDemos = INITIAL_DEMOS.filter((demo) => !updated.some((p: Invitation) => p.id === demo.id || p.slug === demo.slug));
    const merged = missingDemos.length > 0 ? [...updated, ...missingDemos] : updated;
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(merged));
    return merged;
  } catch {
    return INITIAL_DEMOS;
  }
};

export const saveInvitations = (invitations: Invitation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
  } catch (err) {
    console.error('Failed to save invitations to localStorage', err);
  }
};

const INVITATION_API_URL = `${import.meta.env.BASE_URL}api/invitations.php`;

export const saveInvitationToServer = async (invitation: Invitation): Promise<void> => {
  const response = await fetch(INVITATION_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitation),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.error || `No se pudo guardar la invitación (HTTP ${response.status}).`);
  }
  saveOrUpdateInvitation(invitation);
};

export const fetchInvitationFromServer = async (slug: string): Promise<Invitation | undefined> => {
  const response = await fetch(`${INVITATION_API_URL}?slug=${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) return undefined;
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success || !result?.invitation) {
    throw new Error(result?.error || `No se pudo cargar la invitación (HTTP ${response.status}).`);
  }
  return result.invitation as Invitation;
};

export const getInvitationBySlug = (slug: string): Invitation | undefined => {
  const list = getStoredInvitations();
  return list.find((item) => item.slug === slug || item.id === slug);
};

export const saveOrUpdateInvitation = (invitation: Invitation): void => {
  const list = getStoredInvitations();
  const index = list.findIndex((i) => i.id === invitation.id);
  if (index >= 0) {
    list[index] = invitation;
  } else {
    list.unshift(invitation);
  }
  saveInvitations(list);
};

export const deleteInvitation = (id: string): void => {
  const list = getStoredInvitations().filter((i) => i.id !== id);
  saveInvitations(list);
};

export const incrementInvitationVisit = (slug: string): void => {
  const list = getStoredInvitations();
  const item = list.find((i) => i.slug === slug || i.id === slug);
  if (item) {
    item.visitsCount = (item.visitsCount || 0) + 1;
    saveInvitations(list);
  }
};

// Templates
export const getStoredTemplates = (): Template[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
      return INITIAL_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_TEMPLATES;
    const missingTemplates = INITIAL_TEMPLATES.filter((tmpl) => !parsed.some((p: Template) => p.id === tmpl.id));
    if (missingTemplates.length > 0) {
      const merged = [...missingTemplates, ...parsed];
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return INITIAL_TEMPLATES;
  }
};

export const saveTemplates = (templates: Template[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save templates', err);
  }
};

// RSVPs
export const getStoredRSVPs = (): RSVPRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(INITIAL_DEMO_RSVPS));
      return INITIAL_DEMO_RSVPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_RSVPS;
  }
};

export const addRSVP = (rsvp: Omit<RSVPRecord, 'id' | 'confirmedAt'>): RSVPRecord => {
  const records = getStoredRSVPs();
  const newRecord: RSVPRecord = {
    ...rsvp,
    id: 'rsvp-' + Date.now(),
    confirmedAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  try {
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving RSVP', err);
  }

  // Update counter in invitation
  const list = getStoredInvitations();
  const invitation = list.find((i) => i.id === rsvp.invitationId);
  if (invitation) {
    invitation.rsvpsCount = (invitation.rsvpsCount || 0) + (rsvp.attending ? rsvp.guestsCount : 0);
    saveInvitations(list);
  }

  return newRecord;
};

export const getRSVPsByInvitation = (invitationId: string): RSVPRecord[] => {
  const records = getStoredRSVPs();
  return records.filter((r) => r.invitationId === invitationId);
};

// Pricing Plans
export const getStoredPricing = (): PricingPlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(INITIAL_PRICING));
      return INITIAL_PRICING;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRICING;
  }
};

export const savePricing = (pricing: PricingPlan[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
  } catch (err) {
    console.error('Failed to save pricing', err);
  }
};

// Coupons
export const getStoredCoupons = (): Coupon[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COUPONS;
  }
};

export const saveCoupons = (coupons: Coupon[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  } catch (err) {
    console.error('Failed to save coupons', err);
  }
};

// Admin authentication state
export const isAdminLoggedIn = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  } catch {
    return false;
  }
};

export const setAdminLoggedIn = (status: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, status ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to set admin session', err);
  }
};

// Utility to export RSVPs to CSV
export const exportRSVPsToCSV = (invitationTitle: string, rsvps: RSVPRecord[]): void => {
  const headers = ['ID', 'Nombre de Invitado', 'Teléfono', 'Asiste', 'Número de Personas', 'Restricciones Dietéticas', 'Mensaje', 'Fecha de Confirmación'];
  const rows = rsvps.map((r) => [
    r.id,
    `"${r.guestName.replace(/"/g, '""')}"`,
    `"${r.guestPhone || ''}"`,
    r.attending ? 'SÍ' : 'NO',
    r.attending ? r.guestsCount : 0,
    `"${(r.dietaryRestrictions || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    new Date(r.confirmedAt).toLocaleString('es-MX'),
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Confirmaciones_${invitationTitle.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
