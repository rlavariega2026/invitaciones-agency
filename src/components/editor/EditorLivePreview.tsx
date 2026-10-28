import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Maximize2,
  X,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Lock,
  Wifi,
  Battery,
  Layers,
  BookOpen,
} from 'lucide-react';
import { Invitation, EntranceButtonDesign } from '../../types';
import { InvitationViewer } from '../invitation/InvitationViewer';
import { musicPlayer } from '../../utils/audioSynth';
import {
  ENTRANCE_BUTTON_OPTIONS,
  PRESET_BUTTON_TEXTS,
  BUTTON_GROUPS,
  EntranceButtonSelector,
} from '../invitation/EntranceButtonCollection';

interface EditorLivePreviewProps {
  invitation: Invitation;
  onOpenFullscreen?: () => void;
  className?: string;
  defaultDevice?: 'mobile' | 'desktop';
  onUpdateEntranceDesign?: (design: EntranceButtonDesign) => void;
  onUpdateEntranceText?: (text: string) => void;
}

export const EditorLivePreview: React.FC<EditorLivePreviewProps> = ({
  invitation,
  className = '',
  defaultDevice = 'mobile',
  onUpdateEntranceDesign,
  onUpdateEntranceText,
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>(defaultDevice);
  const [previewMode, setPreviewMode] = useState<'interactive' | 'quick'>('interactive');
  const [renderKey, setRenderKey] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [previewFilterGroup, setPreviewFilterGroup] = useState<string>('Todos');

  const isBookStyle =
    invitation.templateId === 'tmpl-erase-una-vez-book' ||
    invitation.style === 'premium_book' ||
    invitation.envelopeAnimation === 'book_open';

  // Sound test handler
  const handleToggleSound = () => {
    if (invitation.musicTrackId && invitation.musicTrackId !== 'none') {
      const state = musicPlayer.toggle(invitation.musicTrackId);
      setIsPlayingSound(state);
    }
  };

  // Reset entrance animation
  const handleResetEntrance = () => {
    setRenderKey((prev) => prev + 1);
  };

  return (
    <div className={`flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl backdrop-blur-md overflow-hidden ${className}`}>
      {/* Top Preview Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-950/80 px-4 py-3">
        {/* Left: Title & Live indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Tiempo Real</span>
          </div>

          <span className="text-xs font-semibold text-neutral-200 hidden sm:inline-flex items-center gap-1">
            {isBookStyle ? <BookOpen className="h-3.5 w-3.5 text-amber-400" /> : <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
            <span className="line-clamp-1 max-w-[150px] text-amber-300 font-mono text-[11px]">
              {isBookStyle ? 'Libro 3D' : 'Invitación Web'}
            </span>
          </span>
        </div>

        {/* Center: Interactive Mode Switcher */}
        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setPreviewMode('interactive')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              previewMode === 'interactive'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Interactúa con la apertura del sobre o las páginas del libro"
          >
            <Sparkles className="h-3 w-3" />
            <span>Interactivo</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('quick')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              previewMode === 'quick'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Ver la invitación ya abierta para inspeccionar textos y fotos de inmediato"
          >
            <Layers className="h-3 w-3" />
            <span>Vista Rápida</span>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Reset Entrance */}
          <button
            type="button"
            onClick={handleResetEntrance}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            title="Reiniciar Apertura / Sello"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Sound Preview */}
          {invitation.musicTrackId && invitation.musicTrackId !== 'none' && (
            <button
              type="button"
              onClick={handleToggleSound}
              className={`flex items-center gap-1 rounded-lg border p-1.5 text-xs transition-colors ${
                isPlayingSound
                  ? 'border-amber-400/80 bg-amber-500/20 text-amber-300'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
              }`}
              title={isPlayingSound ? 'Pausar banda sonora' : 'Probar banda sonora seleccionada'}
            >
              {isPlayingSound ? <Volume2 className="h-3.5 w-3.5 animate-pulse" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Device Frame Switcher */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5">
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                device === 'mobile' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Marco Móvil (Formato Smartphone)"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                device === 'desktop' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Marco Escritorio (Ventana de Navegador)"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Fullscreen Modal trigger */}
          <button
            type="button"
            onClick={() => setIsFullscreenModalOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-neutral-950 transition-colors"
            title="Probar en Pantalla Completa"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden xl:inline text-[11px]">Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* Quick Live Entrance Button Bar (With 100 button support & modal trigger) */}
      <div className="border-b border-neutral-800 bg-neutral-900/80 px-4 py-2.5 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white">Botón de Entrada:</span>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-mono border border-amber-500/30 text-amber-300 font-bold">
              {ENTRANCE_BUTTON_OPTIONS.find((o) => o.id === (invitation.entranceButtonDesign || 'wax_seal'))?.name || 'Sello de Cera'}
            </span>
            <button
              type="button"
              onClick={() => setIsCatalogModalOpen(true)}
              className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-3 w-3" />
              <span>Ver los 100 Diseños 🎨</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] text-neutral-400 font-medium">Texto del botón:</label>
            <input
              type="text"
              value={invitation.entranceButtonText || 'Tienes una invitación'}
              onChange={(e) => {
                onUpdateEntranceText?.(e.target.value);
                setPreviewMode('interactive');
                setRenderKey((k) => k + 1);
              }}
              placeholder="Tienes una invitación"
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none w-44 sm:w-52"
            />
          </div>
        </div>

        {/* Category Filter Tabs for Quick Row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-t border-neutral-800/80 pt-1.5">
          {BUTTON_GROUPS.map((grp) => {
            const isSelected = previewFilterGroup === grp;
            return (
              <button
                key={grp}
                type="button"
                onClick={() => setPreviewFilterGroup(grp)}
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {grp}
              </button>
            );
          })}
        </div>

        {/* Filtered Quick Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ENTRANCE_BUTTON_OPTIONS.filter((opt) => previewFilterGroup === 'Todos' || opt.group === previewFilterGroup).map((opt) => {
            const isSelected = (invitation.entranceButtonDesign || 'wax_seal') === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onUpdateEntranceDesign?.(opt.id);
                  setPreviewMode('interactive');
                  setRenderKey((k) => k + 1);
                }}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/50'
                }`}
                title={opt.tagline}
              >
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Preview Canvas Body */}
      <div className="p-4 sm:p-6 flex-1 flex items-center justify-center bg-neutral-950/90 overflow-hidden">
        {device === 'mobile' ? (
          /* ------------------------------------------------------------- */
          /* MOBILE SMARTPHONE DEVICE FRAME */
          /* ------------------------------------------------------------- */
          <div className="relative mx-auto w-full max-w-[340px] rounded-[44px] border-[7px] border-neutral-800 bg-neutral-950 shadow-2xl shadow-black p-2 flex flex-col">
            {/* Top Dynamic Island / Notch */}
            <div className="relative mx-auto mb-1.5 flex h-4 w-28 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 shadow-inner z-20">
              <div className="h-2 w-2 rounded-full bg-black mr-2" />
              <div className="h-1.5 w-1.5 rounded-full bg-neutral-800" />
            </div>

            {/* Mobile Status Bar */}
            <div className="flex items-center justify-between px-4 text-[10px] text-neutral-400 font-mono select-none mb-1">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-2.5 w-2.5 text-neutral-400" />
                <Battery className="h-3 w-3 text-neutral-400" />
              </div>
            </div>

            {/* Simulated Mobile Screen Container */}
            <div className="relative h-[600px] w-full overflow-hidden rounded-[30px] border border-neutral-800/80 bg-neutral-950">
              <InvitationViewer
                key={`mobile-${renderKey}-${previewMode}-${invitation.templateId}-${invitation.style}-${invitation.entranceButtonDesign || 'wax_seal'}-${invitation.entranceButtonText || 'default'}`}
                invitation={invitation}
                isEmbedded={true}
                forceOpened={previewMode === 'quick'}
                hideFloatingHeader={true}
              />
            </div>

            {/* iOS Bottom Navigation Bar Pill */}
            <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-neutral-700/60" />
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* DESKTOP BROWSER WINDOW FRAME */
          /* ------------------------------------------------------------- */
          <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl flex flex-col overflow-hidden">
            {/* Browser Window Titlebar */}
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-2.5 select-none">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Fake Address Bar */}
              <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs text-neutral-400 font-mono w-72 justify-center">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span className="text-[11px] truncate">
                  lavinvitaciones.com/i/{invitation.slug}
                </span>
              </div>

              <div className="w-10" />
            </div>

            {/* Browser Content Viewport */}
            <div className="relative h-[620px] w-full overflow-hidden bg-neutral-950">
              <InvitationViewer
                key={`desktop-${renderKey}-${previewMode}-${invitation.templateId}-${invitation.style}-${invitation.entranceButtonDesign || 'wax_seal'}-${invitation.entranceButtonText || 'default'}`}
                invitation={invitation}
                isEmbedded={true}
                forceOpened={previewMode === 'quick'}
                hideFloatingHeader={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------- */}
      {/* FULLSCREEN REAL-TIME INTERACTIVE MODAL */}
      {/* --------------------------------------------------------------- */}
      {isFullscreenModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/98 backdrop-blur-xl animate-fade-in">
          {/* Top Floating Fullscreen Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Simulador en Tiempo Real</span>
              </div>
              <h3 className="font-playfair text-sm font-bold text-white hidden sm:block">
                {invitation.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetEntrance}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reiniciar Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreenModalOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow"
              >
                <X className="h-4 w-4" />
                <span>Cerrar Vista Previa</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Interactive Canvas */}
          <div className="relative flex-1 overflow-hidden bg-neutral-950">
            <InvitationViewer
              key={`fullscreen-${renderKey}-${invitation.templateId}-${invitation.style}-${invitation.entranceButtonDesign || 'wax_seal'}-${invitation.entranceButtonText || 'default'}`}
              invitation={invitation}
              isEmbedded={false}
              forceOpened={false}
              hideFloatingHeader={false}
              onBackToHome={() => setIsFullscreenModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/* 100 ENTRANCE BUTTONS CATALOG MODAL */}
      {/* --------------------------------------------------------------- */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/98 backdrop-blur-2xl p-4 sm:p-8 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-neutral-950 font-bold">
                  100
                </span>
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                    Colección Completa de 100 Botones de Entrada
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Haz clic en cualquier botón para aplicarlo al instante y probarlo en vivo en tu invitación
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg"
              >
                <Check className="h-4 w-4" />
                <span>Aplicar & Volver a Vista Previa</span>
              </button>
            </div>

            <EntranceButtonSelector
              selectedDesign={invitation.entranceButtonDesign || 'wax_seal'}
              onSelectDesign={(design) => {
                onUpdateEntranceDesign?.(design);
                setPreviewMode('interactive');
                setRenderKey((k) => k + 1);
              }}
              buttonText={invitation.entranceButtonText || 'Tienes una invitación'}
              onChangeButtonText={(t) => {
                onUpdateEntranceText?.(t);
                setPreviewMode('interactive');
                setRenderKey((k) => k + 1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
