import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Check,
  Gift,
  Copy,
  ExternalLink,
  ChevronLeft,
  Smartphone,
  Monitor,
  Sparkles,
  Send,
  MessageCircle,
  Church,
  Utensils,
  GlassWater,
  PartyPopper,
  Smile,
  Rocket,
  Cake,
} from 'lucide-react';
import { Invitation, RSVPRecord } from '../../types';
import { musicPlayer } from '../../utils/audioSynth';
import { CelebrationParticles } from '../common/CelebrationParticles';
import { getGoogleCalendarUrl, downloadIcsFile, getWhatsAppRsvpUrl } from '../../utils/calendarAndQr';
import { addRSVP, incrementInvitationVisit } from '../../utils/storage';
import { InteractiveBookExperience } from './InteractiveBookExperience';
import { EntranceButton } from './EntranceButtonCollection';
import { BookLeafPhotoCarousel } from '../common/BookLeafPhotoCarousel';

interface InvitationViewerProps {
  invitation: Invitation;
  onBackToHome?: () => void;
  onEditInvitation?: (invitation: Invitation) => void;
  isStandalone?: boolean;
  isEmbedded?: boolean;
  forceOpened?: boolean;
  hideFloatingHeader?: boolean;
}

// Helper to extract personalized guest and allocated passes from URL query or hash
const extractGuestFromUrl = (): { guestName: string; guestPasses: number } => {
  try {
    const fullHref = window.location.href;
    const qIndex = fullHref.indexOf('?');
    if (qIndex !== -1) {
      const queryString = fullHref.slice(qIndex + 1);
      const params = new URLSearchParams(queryString);
      const name = params.get('guest') || params.get('invitado') || '';
      const p = parseInt(params.get('pases') || params.get('passes') || '2', 10);
      return {
        guestName: decodeURIComponent(name).trim(),
        guestPasses: isNaN(p) || p < 1 ? 2 : p,
      };
    }
  } catch {}
  return { guestName: '', guestPasses: 2 };
};

export const InvitationViewer: React.FC<InvitationViewerProps> = ({
  invitation,
  onBackToHome,
  onEditInvitation,
  isStandalone = false,
  isEmbedded = false,
  forceOpened = false,
  hideFloatingHeader = false,
}) => {
  const isBookTemplate = invitation?.templateId === 'tmpl-erase-una-vez-book' || invitation?.style === 'premium_book';
  const [useBookMode, setUseBookMode] = useState<boolean>(isBookTemplate);

  // Personalized guest URL support (?guest=Familia+Perez&pases=3)
  const [guestParam] = useState(() => extractGuestFromUrl());

  useEffect(() => {
    setUseBookMode(isBookTemplate);
  }, [isBookTemplate, invitation?.templateId, invitation?.style]);

  // Opening Envelope State
  const [isOpened, setIsOpened] = useState(forceOpened);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile' | 'full'>('mobile');
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  useEffect(() => {
    if (forceOpened !== undefined) {
      setIsOpened(forceOpened);
    }
  }, [forceOpened]);

  // RSVP Form State with auto-filled guest name if present
  const [rsvpGuestName, setRsvpGuestName] = useState(guestParam.guestName);
  const [rsvpGuestPhone, setRsvpGuestPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState(true);
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState(Math.min(guestParam.guestPasses, 2));
  const [rsvpDietary, setRsvpDietary] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Track page visit once
  useEffect(() => {
    if (invitation?.slug) {
      incrementInvitationVisit(invitation.slug);
    }
  }, [invitation?.slug]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      musicPlayer.stop();
    };
  }, []);

  // Countdown Calculation
  useEffect(() => {
    if (!invitation?.eventDate) return;
    const calculateCountdown = () => {
      const target = new Date(`${invitation.eventDate}T${invitation.eventTime || '18:00'}:00`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [invitation.eventDate, invitation.eventTime]);

  // Handle Envelope Open with Audio
  const handleOpenEnvelope = () => {
    setIsOpened(true);
    if (invitation.musicTrackId && invitation.musicTrackId !== 'none') {
      musicPlayer.play(invitation.musicTrackId);
      setIsPlayingAudio(true);
    }
  };

  const toggleAudio = () => {
    if (invitation.musicTrackId && invitation.musicTrackId !== 'none') {
      const state = musicPlayer.toggle(invitation.musicTrackId);
      setIsPlayingAudio(state);
    }
  };

  const handleCopyClabe = (clabeText: string) => {
    navigator.clipboard.writeText(clabeText);
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2500);
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpGuestName.trim()) return;

    addRSVP({
      invitationId: invitation.id,
      guestName: rsvpGuestName.trim(),
      guestPhone: rsvpGuestPhone.trim(),
      attending: rsvpAttending,
      guestsCount: rsvpAttending ? rsvpGuestsCount : 0,
      dietaryRestrictions: rsvpDietary.trim(),
      message: rsvpMessage.trim(),
    });

    setRsvpSubmitted(true);
  };

  // Helper icon for itinerary
  const renderItineraryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Church':
        return <Church className="h-5 w-5" />;
      case 'Utensils':
        return <Utensils className="h-5 w-5" />;
      case 'GlassWater':
        return <GlassWater className="h-5 w-5" />;
      case 'Heart':
        return <Heart className="h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'PartyPopper':
        return <PartyPopper className="h-5 w-5" />;
      case 'Rocket':
        return <Rocket className="h-5 w-5" />;
      case 'Cake':
        return <Cake className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (useBookMode) {
    return (
      <InteractiveBookExperience
        invitation={invitation}
        onBackToHome={onBackToHome}
        onEditInvitation={onEditInvitation}
        onToggleContinuousView={() => setUseBookMode(false)}
        isEmbedded={isEmbedded}
        forceOpen={forceOpened}
        hideFloatingHeader={hideFloatingHeader}
      />
    );
  }

  return (
    <div
      style={{ '--invitation-accent': invitation.primaryColor || '#d4af37' } as React.CSSProperties}
      className={`relative ${isEmbedded ? 'h-full w-full overflow-y-auto' : isStandalone ? 'min-h-screen w-full' : 'min-h-screen'} bg-neutral-950 text-neutral-100 selection:bg-amber-500/20`}
    >
      {/* Background celebration particles */}
      <CelebrationParticles type={invitation.particlesEffect || 'petals'} intensity="gentle" isEmbedded={isEmbedded} />

      {/* Floating Viewport Switcher & Top Bar Controls */}
      {!hideFloatingHeader && (
        <div className={`${isEmbedded ? 'absolute top-2 left-2 right-2' : 'fixed top-4 left-4 right-4'} z-40 flex items-center justify-between pointer-events-none`}>
        {/* Left: Back / Exit button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 rounded-full border border-neutral-700/80 bg-neutral-900/90 px-3.5 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-md hover:bg-neutral-800 transition-colors shadow-lg"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Volver a LAV</span>
            </button>
          )}

          {onEditInvitation && (
            <button
              onClick={() => onEditInvitation(invitation)}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md hover:bg-amber-500/30 transition-colors shadow-lg"
            >
              <span>Editar Invitación</span>
            </button>
          )}

          {isBookTemplate && (
            <button
              onClick={() => setUseBookMode(true)}
              className="flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md hover:bg-amber-500/30 transition-colors shadow-lg"
            >
              <span>Modo Libro 3D</span>
            </button>
          )}
        </div>

        {/* Right: Sound toggle & Device View toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Device viewport frame mode (Desktop only) */}
          <div className="hidden lg:flex items-center rounded-full border border-neutral-700/80 bg-neutral-900/90 p-1 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setDeviceFrameMode('mobile')}
              className={`rounded-full p-1.5 text-xs transition-colors ${
                deviceFrameMode === 'mobile' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Vista Móvil (Formato WhatsApp)"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeviceFrameMode('full')}
              className={`rounded-full p-1.5 text-xs transition-colors ${
                deviceFrameMode === 'full' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Vista Pantalla Completa"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Music player toggle */}
          {invitation.musicTrackId && invitation.musicTrackId !== 'none' && (
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md shadow-lg transition-all ${
                isPlayingAudio
                  ? 'border-amber-400/80 bg-amber-500/20 text-amber-300'
                  : 'border-neutral-700/80 bg-neutral-900/90 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Pausar Música</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Reproducir Música</span>
                </>
              )}
            </button>
          )}

          {/* Share button */}
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 rounded-full border border-neutral-700/80 bg-neutral-900/90 px-3.5 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-md hover:bg-neutral-800 transition-colors shadow-lg"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Compartir'}</span>
          </button>
        </div>
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. ENVELOPE OPENING OVERLAY (Unsealing experience) */}
      {/* ------------------------------------------------------------- */}
      {!isOpened && (
        <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-40 isolate flex min-h-[100dvh] items-end justify-center overflow-hidden bg-neutral-950 text-center`}>
          <img
            src={invitation.coverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/90" />
          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col items-center justify-end px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16 sm:justify-center sm:pb-12">
            <span className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
              Invitación digital · {invitation.category === 'xv_anos' ? 'Mis XV años' : invitation.category.replace(/_/g, ' ')}
            </span>
            <h2 className="max-w-xl font-cormorant text-4xl font-medium leading-tight text-white drop-shadow-lg sm:text-6xl">
              {invitation.title}
            </h2>
            <p className="mt-3 max-w-md font-cormorant text-xl italic text-white/90 drop-shadow sm:text-2xl">
              {invitation.hostNames}
            </p>
            <div className="my-5 h-px w-20" style={{ backgroundColor: invitation.primaryColor || '#d4af37' }} />
            <p className="max-w-sm text-sm tracking-wide text-white/90 drop-shadow">
              {invitation.eventDate} · {invitation.eventTime} h
            </p>
            {guestParam.guestName && (
              <div className="mt-5 rounded-xl border border-white/30 bg-black/30 px-5 py-3 text-white backdrop-blur-md">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/75">Pase personalizado</span>
                <p className="mt-1 text-sm font-semibold">{guestParam.guestName}</p>
                <p className="text-xs text-white/80">{guestParam.guestPasses} {guestParam.guestPasses === 1 ? 'pase reservado' : 'pases reservados'}</p>
              </div>
            )}
            <div className="mt-7">
              <EntranceButton
                design={invitation.entranceButtonDesign || (invitation.envelopeAnimation as any) || 'wax_seal'}
                text={invitation.entranceButtonText || 'Abrir invitación'}
                onClick={handleOpenEnvelope}
              />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-white/65">
              {invitation.musicTrackId !== 'none' ? 'Toca para abrir · Música y detalles interactivos' : 'Toca para abrir la invitación'}
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. INVITATION CONTENT CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div className={`mx-auto transition-all duration-300 ${isEmbedded ? 'max-w-md py-6 px-3' : isStandalone ? 'w-full px-0 py-0' : deviceFrameMode === 'mobile' ? 'max-w-md py-16 px-3' : 'max-w-4xl py-20 px-6'}`}>
        <article className={`overflow-hidden bg-neutral-950 shadow-2xl shadow-black ${isStandalone ? 'min-h-screen w-full rounded-none border-0' : 'rounded-3xl border border-neutral-800'}`}>

          {/* HERO COVER HEADER */}
          <div className={`relative w-full overflow-hidden bg-neutral-950 ${isStandalone ? 'h-[100dvh] min-h-[620px]' : 'aspect-[3/4] sm:aspect-[4/5]'}`}>
            <img
              src={invitation.coverImage}
              alt={invitation.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Luxury gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-black/10" />

            {/* Overlaid Header Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-center space-y-4">
              <span className="font-cinzel text-xs font-semibold uppercase tracking-widest" style={{ color: invitation.primaryColor || '#d4af37' }}>
                {invitation.headline}
              </span>

              <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white drop-shadow-md">
                {invitation.hostNames}
              </h1>

              <div className="mx-auto my-2 h-0.5 w-16" style={{ backgroundColor: invitation.primaryColor || '#d4af37' }} />

              <p className="font-cinzel text-sm sm:text-base tracking-wider text-neutral-200">
                {invitation.eventDate} · {invitation.eventTime} HRS
              </p>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                {invitation.venueName}
              </p>
            </div>
          </div>

          {/* MAIN BODY SECTIONS */}
          <div className="p-6 sm:p-10 space-y-14">

            {/* COUNTDOWN TIMER */}
            <div className="rounded-2xl border border-amber-500/20 bg-neutral-950/80 p-6 text-center shadow-inner">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: invitation.primaryColor || '#d4af37' }}>
                Cuenta Regresiva
              </span>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
                  <span className="font-playfair text-2xl sm:text-3xl font-bold tabular-nums" style={{ color: invitation.primaryColor || '#d4af37' }}>
                    {timeLeft.days}
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Días</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
                  <span className="font-playfair text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums">
                    {timeLeft.hours}
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Horas</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
                  <span className="font-playfair text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums">
                    {timeLeft.minutes}
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Min</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
                  <span className="font-playfair text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums">
                    {timeLeft.seconds}
                  </span>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Seg</p>
                </div>
              </div>
            </div>

            {/* PERSONAL WELCOME MESSAGE */}
            {invitation.personalMessage && (
              <div className="text-center space-y-4 max-w-lg mx-auto">
                <div className="flex justify-center text-amber-400">
                  <Heart className="h-5 w-5 fill-amber-400/20" />
                </div>
                <p className="font-cormorant text-xl sm:text-2xl italic leading-relaxed text-neutral-200">
                  "{invitation.personalMessage}"
                </p>
              </div>
            )}

            {/* PARENTS & GODPARENTS HONORS */}
            {(invitation.parentsNames || invitation.godparentsNames) && (
              <div className="space-y-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-6 text-center text-xs">
                {invitation.parentsNames && (
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-amber-400 text-[10px] block mb-1">
                      Con la bendición y amor de nuestros padres
                    </span>
                    <p className="text-neutral-300 leading-relaxed max-w-md mx-auto">
                      {invitation.parentsNames}
                    </p>
                  </div>
                )}
                {invitation.godparentsNames && (
                  <div className="pt-3 border-t border-neutral-800/60">
                    <span className="font-semibold uppercase tracking-wider text-amber-400 text-[10px] block mb-1">
                      Padrinos de Honor
                    </span>
                    <p className="text-neutral-300 leading-relaxed max-w-md mx-auto">
                      {invitation.godparentsNames}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ITINERARY */}
            {invitation.itinerary && invitation.itinerary.length > 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                    Programa del Evento
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                    Itinerario
                  </h3>
                </div>

                <div className="space-y-4 max-w-md mx-auto relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-neutral-800">
                  {invitation.itinerary.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-12 group">
                      <div className="absolute left-3.5 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/40 bg-neutral-900 text-amber-400 group-hover:scale-110 transition-transform">
                        {renderItineraryIcon(item.icon)}
                      </div>
                      <div className="flex-1 rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-playfair text-sm font-bold text-neutral-100">{item.title}</h4>
                          <span className="font-mono text-xs text-amber-400 font-semibold">{item.time} hrs</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-snug">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VENUE & MAPS & CALENDAR SYNC */}
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                  ¿Dónde y Cuándo?
                </span>
                <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                  Ubicación & Calendario
                </h3>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-5 text-center">
                <div className="space-y-2">
                  <h4 className="font-playfair text-lg font-bold text-neutral-100">
                    {invitation.venueName}
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    {invitation.venueAddress}
                  </p>
                </div>

                {/* Location Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${invitation.venueName} ${invitation.venueAddress}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Abrir en Google Maps</span>
                  </a>

                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent(`${invitation.venueName} ${invitation.venueAddress}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>Abrir en Waze</span>
                  </a>
                </div>

                {/* Calendar Add Buttons */}
                <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-3 text-xs">
                  <a
                    href={getGoogleCalendarUrl(invitation)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-neutral-300 hover:text-amber-300 transition-colors"
                  >
                    <Calendar className="h-3.5 w-3.5 text-amber-400" />
                    <span>Añadir a Google Calendar</span>
                  </a>
                  <span className="text-neutral-700">·</span>
                  <button
                    onClick={() => downloadIcsFile(invitation)}
                    className="flex items-center gap-1.5 text-neutral-300 hover:text-amber-300 transition-colors"
                  >
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Descargar para Apple / Outlook (.ics)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DRESS CODE */}
            {invitation.dressCode && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 text-center space-y-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                  Código de Vestimenta
                </span>
                <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                  {invitation.dressCode}
                </h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {invitation.dressCodeDetails}
                </p>

                {invitation.dressCodeColors && invitation.dressCodeColors.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-2">
                      Paleta de colores sugerida
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      {invitation.dressCodeColors.map((color, cIdx) => (
                        <div
                          key={cIdx}
                          className="h-6 w-6 rounded-full border border-neutral-700 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHOTO GALLERY — 3D Book Leaf-Turn Carousel */}
            {invitation.galleryImages && invitation.galleryImages.length > 0 && (
              <div className="space-y-4">
                <BookLeafPhotoCarousel
                  photos={invitation.galleryImages}
                  title="Galería de Recuerdos"
                  subtitle="Desliza las fotos con tu dedo o ratón para hojear como papel real"
                  onOpenPhotoModal={(imgUrl) => setActivePhotoModal(imgUrl)}
                />
              </div>
            )}

            {/* GIFT REGISTRY */}
            {invitation.giftRegistries && invitation.giftRegistries.length > 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                    Mesa de Regalos
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                    Sugerencias de Regalo
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Tu presencia es nuestro mejor obsequio. Si deseas tener un detalle con nosotros:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {invitation.giftRegistries.map((reg, rIdx) => (
                    <div
                      key={rIdx}
                      className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Gift className="h-4 w-4" />
                          <h4 className="font-playfair text-sm font-bold text-neutral-100">{reg.title}</h4>
                        </div>
                        <p className="text-xs text-neutral-300 select-all">{reg.detail}</p>
                      </div>

                      {reg.type === 'bank' ? (
                        <button
                          onClick={() => handleCopyClabe(reg.detail)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 py-1.5 text-xs text-neutral-300 hover:text-white"
                        >
                          {copiedClabe ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedClabe ? 'Datos Copiados' : 'Copiar Cuenta / CLABE'}</span>
                        </button>
                      ) : reg.link ? (
                        <a
                          href={reg.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-800 py-1.5 text-xs text-amber-300 hover:bg-neutral-700"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Ver Mesa de Regalos</span>
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RSVP FORM & WHATSAPP CONFIRMATION */}
            {invitation.rsvpEnabled && (
              <div className="rounded-2xl border border-amber-500/30 bg-neutral-950/90 p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                    Confirmación de Asistencia
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                    RSVP
                  </h3>
                  {invitation.rsvpDeadline && (
                    <p className="text-xs text-neutral-400">
                      Favor de confirmar antes del{' '}
                      <span className="text-amber-300 font-semibold">{invitation.rsvpDeadline}</span>
                    </p>
                  )}
                </div>

                {rsvpSubmitted ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-6 text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-playfair text-lg font-bold text-neutral-100">
                        ¡Gracias por confirmar!
                      </h4>
                      <p className="text-xs text-neutral-300">
                        Tu respuesta ha sido registrada exitosamente.
                      </p>
                    </div>

                    {invitation.rsvpWhatsAppPhone && (
                      <a
                        href={getWhatsAppRsvpUrl(
                          invitation.rsvpWhatsAppPhone,
                          rsvpGuestName,
                          invitation.title,
                          rsvpAttending
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 transition-colors shadow"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Notificar por WhatsApp También</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleRSVPSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Nombre Completo del Invitado *
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpGuestName}
                        onChange={(e) => setRsvpGuestName(e.target.value)}
                        placeholder="Ej. Familia González Hernández o Mariana Morales"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Teléfono / WhatsApp (Opcional)
                      </label>
                      <input
                        type="tel"
                        value={rsvpGuestPhone}
                        onChange={(e) => setRsvpGuestPhone(e.target.value)}
                        placeholder="Ej. +52 55 1234 5678"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Attendance Radio */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(true)}
                        className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                          rsvpAttending
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        Sí, Asistiré con gusto
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(false)}
                        className={`rounded-xl border p-3 text-xs font-semibold transition-all ${
                          !rsvpAttending
                            ? 'border-neutral-500 bg-neutral-800 text-neutral-200 shadow-sm'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        No podré asistir
                      </button>
                    </div>

                    {rsvpAttending && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-medium text-neutral-300">
                              Número de Personas Asistentes
                            </label>
                            {guestParam.guestName && (
                              <span className="text-[10px] text-amber-300 font-mono">
                                (Máximo {guestParam.guestPasses} {guestParam.guestPasses === 1 ? 'pase asignado' : 'pases asignados'})
                              </span>
                            )}
                          </div>
                          <select
                            value={rsvpGuestsCount}
                            onChange={(e) => setRsvpGuestsCount(parseInt(e.target.value, 10))}
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                          >
                            {Array.from(
                              { length: guestParam.guestName ? Math.max(1, guestParam.guestPasses) : 6 },
                              (_, i) => i + 1
                            ).map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'Persona' : 'Personas'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">
                            Alergias o Restricciones Dietéticas
                          </label>
                          <input
                            type="text"
                            value={rsvpDietary}
                            onChange={(e) => setRsvpDietary(e.target.value)}
                            placeholder="Ej. Vegetariano, intolerancia a lácteos, sin mariscos..."
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Mensaje para los Anfitriones
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Escribe tus buenos deseos..."
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg"
                      >
                        <Send className="h-4 w-4" />
                        <span>Confirmar Asistencia</span>
                      </button>

                      {invitation.rsvpWhatsAppPhone && (
                        <a
                          href={getWhatsAppRsvpUrl(
                            invitation.rsvpWhatsAppPhone,
                            rsvpGuestName || 'Invitado',
                            invitation.title,
                            rsvpAttending
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* BRANDING FOOTER SEAL */}
            <div className="pt-8 text-center space-y-2 border-t border-neutral-800/60">
              <span className="font-cinzel text-xs font-bold tracking-widest text-neutral-400">
                LAV INVITATIONS
              </span>
              <p className="text-[10px] text-neutral-500">
                Diseño digital de alta costura por LAV Digital Marketing
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* PHOTO LIGHTBOX MODAL */}
      {activePhotoModal && (
        <div
          className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md cursor-pointer`}
          onClick={() => setActivePhotoModal(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={activePhotoModal}
              alt="Detalle"
              className="max-h-[85vh] w-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
