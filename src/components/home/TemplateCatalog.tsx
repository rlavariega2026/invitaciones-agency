import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Eye,
  Palette,
  Music,
  Check,
  Filter,
  Search,
  Heart,
  X,
  BookOpen,
} from 'lucide-react';
import { Template, EventCategory, TemplateStyle } from '../../types';

interface TemplateCatalogProps {
  templates: Template[];
  selectedCategory: string;
  onSelectCategory: (cat: EventCategory | 'all') => void;
  onSelectTemplateToCustomize: (template: Template) => void;
}

const FAVORITES_STORAGE_KEY = 'lav_template_favorites_v1';

export const TemplateCatalog: React.FC<TemplateCatalogProps> = ({
  templates,
  selectedCategory,
  onSelectCategory,
  onSelectTemplateToCustomize,
}) => {
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<Template | null>(null);

  // Favorites state persisted in localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : ['tmpl-erase-una-vez-book', 'tmpl-boda-gold'];
    } catch {
      return ['tmpl-erase-una-vez-book', 'tmpl-boda-gold'];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      const matchCat = selectedCategory === 'all' || tmpl.category === selectedCategory;
      const matchStyle = styleFilter === 'all' || tmpl.style === styleFilter;
      const matchFav = !showOnlyFavorites || favoriteIds.includes(tmpl.id);
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        tmpl.name.toLowerCase().includes(query) ||
        tmpl.description.toLowerCase().includes(query) ||
        tmpl.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchCat && matchStyle && matchFav && matchSearch;
    });
  }, [templates, selectedCategory, styleFilter, showOnlyFavorites, favoriteIds, searchQuery]);

  // All 15 Category Tabs
  const categoryTabs: Array<{ id: EventCategory | 'all'; label: string }> = [
    { id: 'all', label: 'Todas las Colecciones' },
    { id: 'boda', label: 'Bodas' },
    { id: 'xv_anos', label: 'XV Años' },
    { id: 'cumpleanos', label: 'Cumpleaños' },
    { id: 'graduacion', label: 'Graduaciones' },
    { id: 'bautizo', label: 'Bautizos' },
    { id: 'primera_comunion', label: '1ª Comunión' },
    { id: 'baby_shower', label: 'Baby Shower' },
    { id: 'gender_reveal', label: 'Revelación Género' },
    { id: 'aniversario', label: 'Aniversarios' },
    { id: 'infantil', label: 'Infantiles' },
    { id: 'corporativo', label: 'Corporativos' },
    { id: 'inauguracion', label: 'Inauguraciones' },
    { id: 'despedida', label: 'Despedidas' },
    { id: 'reunion_familiar', label: 'Reunión Familiar' },
    { id: 'personalizado', label: 'Personalizados' },
  ];

  const styleTabs: Array<{ id: TemplateStyle | 'all'; label: string }> = [
    { id: 'all', label: 'Todos los Estilos' },
    { id: 'premium_book', label: '📖 Libro 3D' },
    { id: 'luxury_gold', label: 'Oro & Lujo' },
    { id: 'botanical_emerald', label: 'Botánico & Olivo' },
    { id: 'champagne_blush', label: 'Rosa & Champagne' },
    { id: 'royal_lavender', label: 'Princesa Lavanda' },
    { id: 'rose_gold', label: 'Rosa Oro Floral' },
    { id: 'midnight_black', label: 'Medianoche' },
    { id: 'celestial_white', label: 'Celestial Marfil' },
    { id: 'boho_terracotta', label: 'Boho Terracota' },
    { id: 'cosmic_fun', label: 'Aventura Cósmica' },
    { id: 'academic_navy', label: 'Académico Formal' },
  ];

  return (
    <section id="catalog" className="py-20 border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Palette className="h-3.5 w-3.5" />
              <span>Catálogo Completo · 15 Categorías</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-neutral-100">
              Catálogo de Plantillas Exclusivas
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl">
              Cada diseño cuenta con su propia dirección de arte, composición tipográfica, paleta cromática, libro 3D o apertura interactiva.
            </p>
          </div>

          {/* Search Input & Favorites Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Live Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por estilo, tema..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Favorite Filter Button */}
            <button
              onClick={() => setShowOnlyFavorites((prev) => !prev)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${
                showOnlyFavorites
                  ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 font-semibold'
                  : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-rose-400 text-rose-400' : 'text-neutral-400'}`} />
              <span>Favoritas ({favoriteIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Category Tabs (Scrollable for 15 categories) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 border border-neutral-800/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Style Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-500 whitespace-nowrap">
              <Filter className="h-3 w-3" />
              <span>Estilo:</span>
            </span>
            {styleTabs.map((style) => (
              <button
                key={style.id}
                onClick={() => setStyleFilter(style.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs transition-colors ${
                  styleFilter === style.id
                    ? 'bg-amber-500/20 border border-amber-400/60 text-amber-300 font-medium'
                    : 'text-neutral-400 hover:text-neutral-200 border border-neutral-800 bg-neutral-900/40'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
              <Palette className="h-6 w-6" />
            </div>
            <h4 className="font-playfair text-lg font-bold text-neutral-200">
              No encontramos plantillas con esos filtros
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Intenta seleccionar otra categoría o borrar el texto de búsqueda.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setStyleFilter('all');
                setSearchQuery('');
                setShowOnlyFavorites(false);
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const isFav = favoriteIds.includes(template.id);
              const isBook = template.id === 'tmpl-erase-una-vez-book' || template.style === 'premium_book';

              return (
                <article
                  key={template.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/80 transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      {isBook && (
                        <span className="rounded-md border border-amber-400/80 bg-gradient-to-r from-amber-600 to-amber-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>Libro 3D Exclusivo</span>
                        </span>
                      )}
                      {template.isPopular && !isBook && (
                        <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-950 shadow-md">
                          Más Solicitada
                        </span>
                      )}
                      {template.isNew && (
                        <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-950 shadow-md">
                          Nueva
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(template.id, e)}
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                          : 'bg-neutral-900/80 text-neutral-300 hover:text-rose-400 hover:bg-neutral-900'
                      }`}
                      title={isFav ? 'Quitar de favoritas' : 'Guardar en favoritas'}
                    >
                      <Heart className={`h-4 w-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>

                    {/* Hover Quick Preview Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <button
                        onClick={() => setSelectedPreviewTemplate(template)}
                        className="flex items-center gap-1.5 rounded-full border border-white/40 bg-neutral-900/90 px-4 py-2 text-xs font-semibold text-white shadow-xl hover:bg-white hover:text-neutral-950 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Vista Rápida</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="capitalize font-mono text-amber-400">
                          {template.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                          {template.style.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="font-playfair text-xl font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                        {template.name}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedPreviewTemplate(template)}
                        className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                      >
                        Ver Detalles
                      </button>

                      <button
                        onClick={() => onSelectTemplateToCustomize(template)}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Personalizar</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK PREVIEW MODAL */}
      {selectedPreviewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedPreviewTemplate(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl text-neutral-100 space-y-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  {selectedPreviewTemplate.category.replace('_', ' ')} · {selectedPreviewTemplate.style.replace('_', ' ')}
                </span>
                <h3 className="font-playfair text-2xl font-bold text-white mt-1">
                  {selectedPreviewTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewTemplate(null)}
                className="rounded-full bg-neutral-800 p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-neutral-800">
              <img
                src={selectedPreviewTemplate.previewImage}
                alt={selectedPreviewTemplate.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-neutral-300 leading-relaxed">
                {selectedPreviewTemplate.description}
              </p>
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Titular por defecto:</span>
                  <span className="text-neutral-200 font-semibold">{selectedPreviewTemplate.defaultHeadline}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Código de vestimenta sugerido:</span>
                  <span className="text-neutral-200 font-semibold">{selectedPreviewTemplate.defaultDressCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const tmpl = selectedPreviewTemplate;
                  setSelectedPreviewTemplate(null);
                  onSelectTemplateToCustomize(tmpl);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 shadow-lg"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Usar esta Plantilla</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
