import React, { useState } from 'react';
import { Sparkles, Eye, ArrowRight, Play, CheckCircle2, Music, MapPin, Calendar } from 'lucide-react';
import { Invitation } from '../../types';

interface HeroSectionProps {
  demos: Invitation[];
  onNavigate: (view: 'home' | 'catalog' | 'demos' | 'pricing' | 'editor' | 'admin') => void;
  onOpenInvitation: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  demos = [],
  onNavigate,
  onOpenInvitation,
}) => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const safeDemos = demos && demos.length > 0 ? demos : [];
  const activeDemo = safeDemos[selectedDemoIndex] || safeDemos[0] || null;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-2/3 right-10 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <span className="h-px w-6 bg-amber-400/60" />
              <span>LAV Digital Marketing Presenta</span>
            </div>

            <h1 className="font-playfair text-4xl font-normal leading-[1.15] text-neutral-100 sm:text-5xl lg:text-6xl text-balance">
              Momentos únicos merecen{' '}
              <span className="italic font-cormorant font-semibold gold-gradient-text block sm:inline">
                invitaciones extraordinarias.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-300">
              Diseña una experiencia inolvidable para tus invitados. Invitaciones digitales con animación, música, fotografías y detalles que enamoran.
            </p>

            {/* 3 Prominent Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('editor')}
                className="group flex items-center gap-2.5 rounded-lg border border-amber-400/50 bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 whitespace-nowrap"
              >
                <span>Crear mi Invitación</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('catalog')}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900/80 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-200 transition-all duration-300 hover:border-amber-500/50 hover:bg-neutral-800 hover:text-white whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Explorar Diseños</span>
              </button>

              <button
                onClick={() => onNavigate('demos')}
                className="flex items-center gap-2 rounded-lg border border-transparent px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 transition-colors hover:text-amber-300 whitespace-nowrap"
              >
                <Eye className="h-4 w-4" />
                <span>Ver Demostraciones</span>
              </button>
            </div>

            {/* Value Proof Badges (Anti-slop: clean unboxed metadata) */}
            <div className="pt-6 border-t border-neutral-800/80">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Sin descargar aplicaciones</span>
                </div>
                <span className="hidden sm:inline text-neutral-700">·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Compatible 100% con WhatsApp</span>
                </div>
                <span className="hidden sm:inline text-neutral-700">·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>RSVP en tiempo real</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Interactive Phone Device Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Demo selector pill switchers */}
            {safeDemos.length > 0 && (
              <div className="mb-4 flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur-md">
                {safeDemos.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDemoIndex(idx)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedDemoIndex === idx
                        ? 'bg-amber-500 text-neutral-950 font-semibold shadow'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {d.id === 'demo-erase-una-vez-04' || d.slug === 'demo-erase-una-vez'
                      ? '📖 Érase una Vez'
                      : idx === 0
                      ? 'Boda Sofía & Mateo'
                      : idx === 1
                      ? 'XV Años Valentina'
                      : 'Misión Infantil Leo'}
                  </button>
                ))}
              </div>
            )}

            {/* Smartphone Mockup */}
            {activeDemo && (
              <div className="relative mx-auto w-full max-w-[320px] rounded-[42px] border-[6px] border-neutral-800 bg-neutral-950 p-2 shadow-2xl shadow-black">
                {/* Speaker notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 h-3.5 w-24 rounded-full bg-neutral-800 z-30" />

                {/* Screen container */}
                <div className="relative overflow-hidden rounded-[34px] border border-neutral-800/80 bg-neutral-900 aspect-[9/18]">
                  {/* Background image with subtle zoom */}
                  <img
                    src={activeDemo.coverImage}
                    alt={activeDemo.title}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/30" />

                  {/* Overlaid UI inside screen */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-5 pt-10 text-center">
                    {/* Top music / badge indicator */}
                    <div className="flex items-center justify-between text-[11px] text-amber-300/90 font-medium">
                      <span className="font-cinzel tracking-wider uppercase">{activeDemo.headline}</span>
                      <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                        <Music className="h-3 w-3 animate-pulse text-amber-400" />
                        <span className="text-[10px]">Música</span>
                      </div>
                    </div>

                    {/* Center Names */}
                    <div className="space-y-2 my-auto">
                      <p className="text-[11px] uppercase tracking-widest text-amber-200/80 font-medium">
                        Estás cordialmente invitado
                      </p>
                      <h3 className="font-playfair text-2xl font-bold text-white drop-shadow-md">
                        {activeDemo.hostNames}
                      </h3>
                      <div className="mx-auto h-0.5 w-12 bg-amber-400/80 my-2" />
                      <p className="text-[11px] text-neutral-200 line-clamp-2 px-2">
                        {activeDemo.venueName}
                      </p>
                    </div>

                    {/* Bottom details & launch button */}
                    <div className="space-y-3">
                      <div className="rounded-xl border border-white/10 bg-black/60 p-2.5 backdrop-blur-md">
                        <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{activeDemo.eventDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{activeDemo.eventTime} hrs</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenInvitation(activeDemo.slug)}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/60 bg-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-lg transition-all hover:bg-amber-400"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Abrir Demostración Real</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
