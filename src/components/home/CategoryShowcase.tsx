import React from 'react';
import {
  Heart,
  Crown,
  Rocket,
  Sparkles,
  GraduationCap,
  Baby,
  Cross,
  Gift,
  PartyPopper,
  Gem,
  Briefcase,
  Building2,
  GlassWater,
  Users,
  Palette,
} from 'lucide-react';
import { EventCategory } from '../../types';

interface CategoryShowcaseProps {
  selectedCategory: string;
  onSelectCategory: (category: EventCategory | 'all') => void;
}

const CATEGORIES_DATA: Array<{
  id: EventCategory;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  count: number;
}> = [
  {
    id: 'boda',
    name: 'Bodas',
    subtitle: 'Lujo, romance & flores',
    icon: Heart,
    accentColor: 'from-amber-500/20 to-amber-900/10 text-amber-300',
    count: 5,
  },
  {
    id: 'xv_anos',
    name: 'XV Años',
    subtitle: 'Galas & realeza moderna',
    icon: Crown,
    accentColor: 'from-emerald-500/20 to-emerald-900/10 text-emerald-300',
    count: 4,
  },
  {
    id: 'cumpleanos',
    name: 'Cumpleaños',
    subtitle: 'Celebraciones de honor',
    icon: Sparkles,
    accentColor: 'from-purple-500/20 to-purple-900/10 text-purple-300',
    count: 2,
  },
  {
    id: 'graduacion',
    name: 'Graduaciones',
    subtitle: 'Magna cum laude',
    icon: GraduationCap,
    accentColor: 'from-blue-600/20 to-blue-900/10 text-blue-300',
    count: 1,
  },
  {
    id: 'bautizo',
    name: 'Bautizos',
    subtitle: 'Blanco marfil & celestial',
    icon: Baby,
    accentColor: 'from-amber-200/20 to-stone-800/10 text-amber-200',
    count: 1,
  },
  {
    id: 'primera_comunion',
    name: '1ª Comunión',
    subtitle: 'Eucaristía & bendición',
    icon: Cross,
    accentColor: 'from-yellow-500/20 to-amber-900/10 text-yellow-300',
    count: 1,
  },
  {
    id: 'baby_shower',
    name: 'Baby Showers',
    subtitle: 'Dulce espera & ternura',
    icon: Gift,
    accentColor: 'from-pink-500/20 to-rose-900/10 text-pink-300',
    count: 1,
  },
  {
    id: 'gender_reveal',
    name: 'Revelación Género',
    subtitle: '¿Niño o Niña? Sorpresa',
    icon: PartyPopper,
    accentColor: 'from-cyan-500/20 to-pink-900/10 text-pink-300',
    count: 1,
  },
  {
    id: 'aniversario',
    name: 'Aniversarios',
    subtitle: 'Bodas de Plata & Oro',
    icon: Gem,
    accentColor: 'from-yellow-400/20 to-amber-800/10 text-amber-300',
    count: 1,
  },
  {
    id: 'infantil',
    name: 'Infantiles',
    subtitle: 'Magia, espacio & safari',
    icon: Rocket,
    accentColor: 'from-sky-500/20 to-sky-900/10 text-sky-300',
    count: 3,
  },
  {
    id: 'corporativo',
    name: 'Corporativos',
    subtitle: 'Gala & Summit Anual',
    icon: Briefcase,
    accentColor: 'from-slate-500/20 to-slate-900/10 text-slate-300',
    count: 1,
  },
  {
    id: 'inauguracion',
    name: 'Inauguraciones',
    subtitle: 'Corte de listón & cóctel',
    icon: Building2,
    accentColor: 'from-amber-600/20 to-yellow-900/10 text-amber-400',
    count: 1,
  },
  {
    id: 'despedida',
    name: 'Despedidas',
    subtitle: 'Bachelorette & fiesta',
    icon: GlassWater,
    accentColor: 'from-fuchsia-500/20 to-rose-900/10 text-fuchsia-300',
    count: 1,
  },
  {
    id: 'reunion_familiar',
    name: 'Reunión Familiar',
    subtitle: 'Abrazos & raíces',
    icon: Users,
    accentColor: 'from-orange-500/20 to-amber-900/10 text-orange-300',
    count: 1,
  },
  {
    id: 'personalizado',
    name: 'Personalizados',
    subtitle: 'A tu medida exacta',
    icon: Palette,
    accentColor: 'from-indigo-500/20 to-purple-900/10 text-indigo-300',
    count: 1,
  },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-16 border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Colecciones Exclusivas
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-neutral-100 mt-1">
              Diseños Curados por Categoría de Evento (15 Categorías)
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              selectedCategory === 'all'
                ? 'text-amber-400 underline underline-offset-4'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ver todas las plantillas (24)
          </button>
        </div>

        {/* 15 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {CATEGORIES_DATA.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                  isSelected
                    ? 'border-amber-400 bg-neutral-900 shadow-lg shadow-amber-500/15 ring-1 ring-amber-400/40'
                    : 'border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accentColor} mb-2.5 transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-playfair text-sm font-bold text-neutral-100 group-hover:text-amber-200">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                <span className="mt-1.5 text-[9px] text-neutral-500 font-mono">
                  {cat.count} {cat.count === 1 ? 'diseño' : 'diseños'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
