import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Heart,
  Crown,
  Gift,
  Mail,
  Stars,
  Flower2,
  Gem,
  Compass,
  Check,
  Baby,
  GraduationCap,
  Music,
  GlassWater,
  PartyPopper,
  Smile,
  Rocket,
  Cake,
  Trophy,
  Key,
  Scroll,
  Sun,
  Moon,
  Shield,
  Zap,
  Flame,
  Wine,
  Palmtree,
  Camera,
  BookOpen,
  Disc,
  Award,
  Search,
  Filter,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { EntranceButtonDesign } from '../../types';
import {
  ENTRANCE_BUTTONS_100,
  BUTTON_GROUPS,
  getButtonPresetById,
  EntranceButtonItem,
} from '../../data/entranceButtonsData';

export { ENTRANCE_BUTTONS_100, BUTTON_GROUPS };
export const ENTRANCE_BUTTON_OPTIONS = ENTRANCE_BUTTONS_100;

export interface EntranceButtonProps {
  design?: EntranceButtonDesign;
  text?: string;
  onClick?: () => void;
  className?: string;
  isCompact?: boolean;
}

export const PRESET_BUTTON_TEXTS = [
  'Tienes una invitación',
  '¡Estás invitado!',
  'Una invitación especial para ti',
  'Abre tu invitación',
  'Pase de Honor Exclusivo',
  'Celebremos Juntos',
  '¡Acompáñanos a Celebrar!',
  'Entrada de Gala VIP',
];

// Helper to render Lucide icon dynamically by name
const renderDynamicIcon = (name: string, className = 'h-5 w-5') => {
  switch (name) {
    case 'Heart':
      return <Heart className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'Stars':
      return <Stars className={className} />;
    case 'Flower2':
      return <Flower2 className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Baby':
      return <Baby className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'GlassWater':
      return <GlassWater className={className} />;
    case 'PartyPopper':
      return <PartyPopper className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    case 'Cake':
      return <Cake className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Key':
      return <Key className={className} />;
    case 'Scroll':
      return <Scroll className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Wine':
      return <Wine className={className} />;
    case 'Palmtree':
      return <Palmtree className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Disc':
      return <Disc className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Check':
      return <Check className={className} />;
    case 'Sparkles':
    default:
      return <Sparkles className={className} />;
  }
};

/**
 * Universal Entrance Button Renderer for all 100 designs
 */
export const EntranceButton: React.FC<EntranceButtonProps> = ({
  design = 'wax_seal',
  text = 'Tienes una invitación',
  onClick,
  className = '',
  isCompact = false,
}) => {
  const displayText = text?.trim() || 'Tienes una invitación';
  const preset = getButtonPresetById(design);

  // Dedicated, accessible entrance CTA for the Cinderella / crystal-ball template.
  if (design === 'royal_curtain') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`cinderella-entry-button ${className}`}
        aria-label={displayText}
      >
        <span className="cinderella-entry-gem" aria-hidden="true"><Gem className="h-5 w-5" /></span>
        <span className="cinderella-entry-copy">
          <span className="cinderella-entry-title">{displayText}</span>
          <span className="cinderella-entry-subtitle">Entrar al baile</span>
        </span>
        <Sparkles className="cinderella-entry-sparkle h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  // 1. ENVELOPE FLAP SHAPE
  if (preset.shape === 'envelope' || design === 'envelope_flap') {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
          isCompact ? 'w-full max-w-[270px]' : 'w-full max-w-sm'
        } ${className}`}
      >
        <div className={`relative rounded-2xl ${preset.borderClass} ${preset.bgClass} p-5 shadow-2xl text-center overflow-hidden`}>
          {/* Envelope flap folded geometric pattern */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-amber-900/30 via-neutral-900/80 to-transparent border-b border-amber-400/30 clip-triangle pointer-events-none" />

          {/* Central Wax Seal Emblem */}
          <div className={`relative z-10 mx-auto -mt-1 flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300/60 ${preset.iconBg} shadow-xl group-hover:rotate-6 transition-transform`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/50 bg-black/40 shadow-inner">
              {renderDynamicIcon(preset.iconName, `h-5 w-5 ${preset.iconColor}`)}
            </div>
          </div>

          <div className="mt-4 space-y-1 relative z-10">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-amber-400/90 font-bold block">
              {preset.kicker}
            </span>
            <p className="font-playfair text-base sm:text-lg font-bold text-white tracking-wide">
              {displayText}
            </p>
          </div>

          <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors shadow">
            <Sparkles className="h-3 w-3" />
            <span>{preset.actionText}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. WAX SEAL / EMBOSSED MEDALLION SHAPE
  if (preset.shape === 'seal') {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98] ${
          isCompact ? 'w-full max-w-[270px]' : 'w-full max-w-sm'
        } ${className}`}
      >
        <div className={`relative rounded-3xl ${preset.borderClass} ${preset.bgClass} p-6 shadow-2xl text-center space-y-4`}>
          {/* Medallion */}
          <div className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-400/60 ${preset.iconBg} shadow-2xl group-hover:scale-105 group-hover:rotate-12 transition-transform`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/30 shadow-inner">
              {renderDynamicIcon(preset.iconName, `h-7 w-7 ${preset.iconColor}`)}
            </div>
            {preset.ornament && (
              <span className="absolute -bottom-1 -right-1 text-sm bg-neutral-950 rounded-full px-1 border border-amber-400/40">
                {preset.ornament}
              </span>
            )}
            <div className="absolute top-2 left-3 h-2 w-3 rounded-full bg-white/40 blur-[1px]" />
          </div>

          <div className="space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
              {preset.kicker}
            </span>
            <p className="font-playfair text-lg sm:text-xl font-bold text-white tracking-wide">
              {displayText}
            </p>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{preset.actionText}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. RIBBON & GIFT BOX WRAP SHAPE
  if (preset.shape === 'ribbon') {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
          isCompact ? 'w-full max-w-[270px]' : 'w-full max-w-sm'
        } ${className}`}
      >
        <div className={`relative rounded-2xl ${preset.borderClass} ${preset.bgClass} p-6 shadow-2xl text-center space-y-3 overflow-hidden`}>
          {/* Vertical silk ribbon bar */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-amber-500/20 via-amber-400/30 to-amber-600/20 border-x border-amber-400/40 pointer-events-none" />

          {/* Ribbon Bow Emblema */}
          <div className={`relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${preset.innerBorderClass} ${preset.iconBg} shadow-xl group-hover:rotate-12 transition-transform`}>
            {renderDynamicIcon(preset.iconName, `h-7 w-7 ${preset.iconColor}`)}
          </div>

          <div className="relative z-10 space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-amber-300 font-semibold block">
              {preset.kicker}
            </span>
            <p className="font-playfair text-xl font-bold text-white tracking-wide">
              {displayText}
            </p>
          </div>

          <div className="relative z-10 pt-1">
            <span className="inline-block rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 group-hover:from-amber-400 group-hover:to-amber-500 transition-colors shadow-lg">
              {preset.actionText}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. VIP TICKET / TICKET STUB SHAPE
  if (preset.shape === 'ticket') {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
          isCompact ? 'w-full max-w-[270px]' : 'w-full max-w-sm'
        } ${className}`}
      >
        <div className={`relative rounded-2xl ${preset.borderClass} ${preset.bgClass} p-5 shadow-2xl text-center space-y-3 overflow-hidden border-dashed`}>
          {/* Left & Right Notch Cutouts for Ticket Stub look */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 h-6 w-6 rounded-full bg-neutral-950 border border-neutral-800" />
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 rounded-full bg-neutral-950 border border-neutral-800" />

          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[10px] text-amber-400 font-mono">
            <span>PASE DE ADMISIÓN</span>
            <span>★ VIP ★</span>
          </div>

          <div className="space-y-1 py-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block">
              {preset.kicker}
            </span>
            <p className="font-playfair text-xl font-bold text-white tracking-wide">
              {displayText}
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-500/20 px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
              <Check className="h-3.5 w-3.5" />
              <span>{preset.actionText}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 5. PILL / NEON CAPSULE SHAPE
  if (preset.shape === 'pill') {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98] ${
          isCompact ? 'w-full max-w-[280px]' : 'w-full max-w-md'
        } ${className}`}
      >
        <div className={`relative rounded-full ${preset.borderClass} ${preset.bgClass} px-6 py-4 shadow-2xl flex items-center justify-between gap-4 overflow-hidden`}>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${preset.innerBorderClass} ${preset.iconBg}`}>
            {renderDynamicIcon(preset.iconName, `h-6 w-6 ${preset.iconColor}`)}
          </div>

          <div className="flex-1 text-left min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 block truncate">
              {preset.kicker}
            </span>
            <p className="font-playfair text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {displayText}
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-white text-neutral-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider group-hover:scale-105 transition-transform shadow">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Abrir</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 6. FRAME / BAROQUE / ORNATE RECTANGLE
  if (preset.shape === 'frame') {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
          isCompact ? 'w-full max-w-[270px]' : 'w-full max-w-sm'
        } ${className}`}
      >
        <div className={`relative rounded-2xl ${preset.borderClass} ${preset.bgClass} p-6 shadow-2xl text-center space-y-3`}>
          {/* Baroque Corner Ornaments */}
          <div className="absolute top-2 left-2 text-xs text-amber-400/80 font-cinzel">❦</div>
          <div className="absolute top-2 right-2 text-xs text-amber-400/80 font-cinzel">❦</div>
          <div className="absolute bottom-2 left-2 text-xs text-amber-400/80 font-cinzel">❦</div>
          <div className="absolute bottom-2 right-2 text-xs text-amber-400/80 font-cinzel">❦</div>

          <div className="space-y-1 pt-1">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-amber-300 font-semibold block">
              {preset.kicker}
            </span>
            <div className="h-px w-12 bg-amber-400/40 mx-auto" />
          </div>

          <div className="my-2 py-1">
            <div className="flex justify-center mb-1.5">
              {renderDynamicIcon(preset.iconName, `h-7 w-7 ${preset.iconColor}`)}
            </div>
            <p className="font-playfair text-xl sm:text-2xl font-bold text-white tracking-wide">
              {displayText}
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-500/20 px-6 py-2 text-xs font-bold uppercase tracking-wider text-amber-200 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors shadow">
              <Sparkles className="h-3 w-3" />
              <span>{preset.actionText}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 7. DEFAULT / CARD / BADGE / GEM / OVAL SHAPE (Universal Luxury Card)
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer select-none mx-auto transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
        isCompact ? 'w-full max-w-[270px]' : 'w-full max-w-sm'
      } ${className}`}
    >
      <div className={`relative rounded-2xl ${preset.borderClass} ${preset.bgClass} p-5 sm:p-6 shadow-2xl text-center space-y-3 overflow-hidden`}>
        {/* Decorative inner inset border */}
        <div className={`rounded-xl ${preset.innerBorderClass} p-4 space-y-3 bg-black/25 backdrop-blur-sm`}>
          {/* Emblem Icon */}
          <div className="flex justify-center items-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${preset.innerBorderClass} ${preset.iconBg} shadow-lg group-hover:rotate-6 transition-transform`}>
              {renderDynamicIcon(preset.iconName, `h-6 w-6 ${preset.iconColor}`)}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-amber-300/90 font-bold block">
              {preset.kicker}
            </span>
            <p className="font-playfair text-lg sm:text-xl font-bold text-white tracking-wide">
              {displayText}
            </p>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-950 shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="h-3 w-3" />
              <span>{preset.actionText}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface EntranceButtonSelectorProps {
  selectedDesign: EntranceButtonDesign;
  onSelectDesign: (design: EntranceButtonDesign) => void;
  buttonText: string;
  onChangeButtonText: (text: string) => void;
  initialCategory?: string;
}

/**
 * Full Interactive Selector with Search & Category Filters for all 100 Designs
 */
export const EntranceButtonSelector: React.FC<EntranceButtonSelectorProps> = ({
  selectedDesign,
  onSelectDesign,
  buttonText,
  onChangeButtonText,
  initialCategory,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered list of 100 buttons
  const filteredButtons = useMemo(() => {
    return ENTRANCE_BUTTONS_100.filter((item) => {
      const matchesGroup = selectedGroup === 'Todos' || item.group === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.kicker.toLowerCase().includes(q) ||
        item.actionText.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchQuery]);

  const activePreset = getButtonPresetById(selectedDesign);
  const activeIndex = ENTRANCE_BUTTONS_100.findIndex((b) => b.id === selectedDesign);

  return (
    <div className="space-y-6">
      {/* 1. BUTTON TEXT CUSTOMIZATION */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
              Texto del Botón de Entrada («Tienes una invitación»)
            </label>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Personaliza la frase con la que recibirás a tus invitados antes de abrir el sobre o libro.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-300 font-mono">
            <span>Diseño #{activeIndex >= 0 ? activeIndex + 1 : 1} de 100</span>
          </div>
        </div>

        {/* Text input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={buttonText}
            onChange={(e) => onChangeButtonText(e.target.value)}
            placeholder="Ej. Tienes una invitación"
            maxLength={45}
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
          />
          {buttonText !== 'Tienes una invitación' && (
            <button
              type="button"
              onClick={() => onChangeButtonText('Tienes una invitación')}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-xs text-neutral-400 hover:text-white"
              title="Restablecer a 'Tienes una invitación'"
            >
              Restablecer
            </button>
          )}
        </div>

        {/* Preset quick chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-neutral-500 mr-1">Sugerencias:</span>
          {PRESET_BUTTON_TEXTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChangeButtonText(preset)}
              className={`rounded-lg px-2.5 py-1 text-[11px] transition-colors ${
                buttonText === preset
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CATALOG OF 100 BOTONES CON FILTROS Y BÚSQUEDA */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-950">
                100 Estilos Disponibles
              </span>
              <h3 className="font-playfair text-lg font-bold text-neutral-100">
                Catálogo de Botones & Sellos de Entrada
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Selecciona cualquier diseño para aplicarlo en vivo a tu invitación.
            </p>
          </div>

          {/* Active selection summary badge */}
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-2.5 text-right hidden sm:block">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Botón Activo:</span>
            <span className="text-xs font-bold text-amber-300 truncate max-w-[200px] block">
              {activePreset.name}
            </span>
          </div>
        </div>

        {/* Search bar & Category filter tabs */}
        <div className="space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar entre los 100 botones (ej. cera, corona, mariposa, cohete, cáliz, neón, diploma, vinilo...)"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Group Tabs (Horizontal scrollable chips) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BUTTON_GROUPS.map((grp) => {
              const count = grp === 'Todos' ? 100 : ENTRANCE_BUTTONS_100.filter((b) => b.group === grp).length;
              const isSelected = selectedGroup === grp;
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedGroup(grp)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/25'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <span>{grp}</span>
                  <span className={`ml-1.5 text-[10px] ${isSelected ? 'text-neutral-950 font-black' : 'text-neutral-500'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter of matching items */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
          <span>
            Mostrando <strong className="text-white">{filteredButtons.length}</strong> de 100 diseños
            {selectedGroup !== 'Todos' && ` en "${selectedGroup}"`}
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('Todos');
              }}
              className="text-amber-400 hover:underline"
            >
              Ver todos los 100
            </button>
          )}
        </div>

        {/* Grid of button cards (3 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[640px] overflow-y-auto pr-1">
          {filteredButtons.map((btn, idx) => {
            const isSelected = selectedDesign === btn.id;
            const globalIndex = ENTRANCE_BUTTONS_100.findIndex((b) => b.id === btn.id) + 1;

            return (
              <div
                key={btn.id}
                onClick={() => onSelectDesign(btn.id)}
                className={`group relative rounded-2xl border-2 p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10'
                    : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-950'
                }`}
              >
                {/* Header card with global index & group pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-mono font-bold text-amber-300">
                      {globalIndex}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-400 truncate max-w-[120px]">
                      {btn.group}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-950 shadow">
                      <Check className="h-2.5 w-2.5" />
                      <span>Activo</span>
                    </span>
                  ) : btn.isPopular ? (
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[9px] font-medium text-amber-300">
                      Popular ★
                    </span>
                  ) : null}
                </div>

                {/* Name */}
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-2">
                  {btn.name}
                </h4>

                {/* Live Miniature Preview of the Button */}
                <div className="my-2 py-1 flex items-center justify-center min-h-[110px]">
                  <EntranceButton
                    design={btn.id}
                    text={buttonText}
                    isCompact={true}
                  />
                </div>

                {/* Footer Tagline & Action prompt */}
                <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-neutral-400 line-clamp-1">{btn.tagline}</span>
                  <span className={`font-semibold shrink-0 ${isSelected ? 'text-amber-300' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                    {isSelected ? '✓ Activo' : 'Elegir'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
