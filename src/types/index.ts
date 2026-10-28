export type EventCategory =
  | 'boda'
  | 'xv_anos'
  | 'cumpleanos'
  | 'graduacion'
  | 'bautizo'
  | 'primera_comunion'
  | 'baby_shower'
  | 'gender_reveal'
  | 'aniversario'
  | 'infantil'
  | 'corporativo'
  | 'inauguracion'
  | 'despedida'
  | 'reunion_familiar'
  | 'personalizado';

export type EntranceButtonDesign = string;

export type TemplateStyle =
  | 'luxury_gold'
  | 'botanical_emerald'
  | 'champagne_blush'
  | 'midnight_black'
  | 'royal_lavender'
  | 'cosmic_fun'
  | 'safari_adventure'
  | 'boho_terracotta'
  | 'celestial_white'
  | 'academic_navy'
  | 'editorial_chic'
  | 'rose_gold'
  | 'premium_book';

export type EnvelopeAnimationType = 'wax_seal' | 'ribbon_box' | 'royal_curtain' | 'minimalist_fold' | 'book_open';

export interface BookPage {
  id: string;
  chapterTitle?: string;
  subtitle?: string;
  text?: string;
  photos: string[];
  layout: 'single' | 'duo' | 'trio' | 'quad' | 'text_focus' | 'dedication';
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  icon?: string;
}

export interface GiftRegistryItem {
  type: 'store' | 'bank' | 'envelope';
  title: string;
  detail: string;
  link?: string;
}

export interface Invitation {
  id: string;
  slug: string;
  templateId: string;
  category: EventCategory;
  title: string;
  headline: string;
  hostNames: string;
  parentsNames?: string;
  godparentsNames?: string;
  eventDate: string; // ISO date 'YYYY-MM-DD'
  eventTime: string; // '18:00'
  venueName: string;
  venueAddress: string;
  mapEmbedQuery?: string;
  coverImage: string;
  galleryImages: string[];
  style: TemplateStyle;
  primaryColor: string;
  fontHeading: 'Cinzel' | 'Playfair Display' | 'Cormorant Garamond' | 'Plus Jakarta Sans';
  envelopeAnimation: EnvelopeAnimationType;
  musicTrackId: 'wedding_canon' | 'quince_waltz' | 'kids_cheerful' | 'acoustic_romance' | 'none';
  dressCode: string; // e.g. 'Rigurosa Etiqueta', 'Cocktail', 'Guayabera Formal', 'Divertido / Casual'
  dressCodeDetails: string;
  dressCodeColors: string[];
  personalMessage: string;
  itinerary: ItineraryItem[];
  giftRegistries: GiftRegistryItem[];
  rsvpEnabled: boolean;
  rsvpDeadline: string;
  rsvpWhatsAppPhone: string;
  particlesEffect: 'petals' | 'sparkles' | 'confetti' | 'none';
  packageTier: 'esencial' | 'premium' | 'exclusivo';
  status: 'activa' | 'borrador' | 'suspendida';
  visitsCount: number;
  rsvpsCount: number;
  createdAt: string;
  isDemo?: boolean;
  bookCoverStyle?: 'romantic' | 'vintage' | 'editorial' | 'minimalist' | 'modern' | 'luxury_linen';
  bookPages?: BookPage[];
  entranceButtonDesign?: EntranceButtonDesign;
  entranceButtonText?: string;
}

export interface RSVPRecord {
  id: string;
  invitationId: string;
  guestName: string;
  guestPhone?: string;
  attending: boolean;
  guestsCount: number;
  dietaryRestrictions?: string;
  message?: string;
  confirmedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: EventCategory;
  style: TemplateStyle;
  description: string;
  previewImage: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  defaultHeadline: string;
  defaultDressCode: string;
  defaultMusic: 'wedding_canon' | 'quince_waltz' | 'kids_cheerful' | 'acoustic_romance' | 'none';
  primaryColor?: string;
  fontHeading?: 'Cinzel' | 'Playfair Display' | 'Cormorant Garamond' | 'Plus Jakarta Sans';
  envelopeAnimation?: EnvelopeAnimationType;
  entranceButtonDesign?: EntranceButtonDesign;
}

export interface PricingPlan {
  id: 'esencial' | 'premium' | 'exclusivo';
  name: string;
  priceMxn: number;
  priceUsd: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  active: boolean;
  usageCount: number;
}
