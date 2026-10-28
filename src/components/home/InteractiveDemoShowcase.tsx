import React from 'react';
import { Play, Sparkles, ExternalLink, Calendar, MapPin, Music2 } from 'lucide-react';
import { Invitation } from '../../types';

interface InteractiveDemoShowcaseProps {
  demos: Invitation[];
  onOpenInvitation: (slug: string) => void;
  onCustomizeDemo: (demo: Invitation) => void;
}

export const InteractiveDemoShowcase: React.FC<InteractiveDemoShowcaseProps> = ({
  demos = [],
  onOpenInvitation,
  onCustomizeDemo,
}) => {
  if (!demos || demos.length === 0) return null;

  return (
    <section id="demos" className="py-24 border-t border-neutral-900 bg-neutral-950/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Experiencias Reales Interactivas</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-100">
            Descubre Nuestras Demostraciones Oficiales
          </h2>
          <p className="text-base text-neutral-400">
            Haz clic en cualquiera de nuestras experiencias terminadas. No necesitas registrarte para interactuar con la animación de sobre, música, itinerario y confirmación de asistencia.
          </p>
        </div>

        {/* Flagship Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demos.map((demo) => {
            const isWedding = demo.slug === 'demo-boda';
            const isQuince = demo.slug === 'demo-xv';
            const isBook = demo.slug === 'demo-erase-una-vez' || demo.style === 'premium_book';

            return (
              <div
                key={demo.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Image Cover container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={demo.coverImage}
                    alt={demo.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 rounded-md bg-neutral-950/80 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-md border border-neutral-800">
                    {isBook ? '📖 Libro Digital 3D' : isWedding ? 'Boda de Alta Costura' : isQuince ? 'XV Años Real' : 'Fiesta Infantil Temática'}
                  </div>

                  {/* Sound icon badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1 text-[11px] text-neutral-200 backdrop-blur-md">
                    <Music2 className="h-3 w-3 text-amber-400" />
                    <span>Sonido Activo</span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-playfair text-xl font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {demo.personalMessage}
                    </p>
                  </div>

                  {/* Clean unboxed event meta */}
                  <div className="pt-3 border-t border-neutral-800/80 space-y-1.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{demo.eventDate} · {demo.eventTime} hrs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{demo.venueName}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onOpenInvitation(demo.slug)}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-all shadow-md"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Ver Demo</span>
                    </button>

                    <button
                      onClick={() => onCustomizeDemo(demo)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 px-3 text-xs font-medium text-neutral-200 hover:border-amber-400/50 hover:text-white transition-all"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Personalizar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
