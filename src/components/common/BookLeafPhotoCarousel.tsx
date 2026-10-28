import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Grid,
} from 'lucide-react';
import { musicPlayer } from '../../utils/audioSynth';

export interface BookLeafPhotoCarouselProps {
  photos: string[];
  title?: string;
  subtitle?: string;
  className?: string;
  onOpenPhotoModal?: (photoUrl: string) => void;
  accentColor?: string;
}

export const BookLeafPhotoCarousel: React.FC<BookLeafPhotoCarouselProps> = ({
  photos,
  title = 'Álbum de Recuerdos',
  subtitle = 'Desliza las hojas con tu dedo o ratón',
  className = '',
  onOpenPhotoModal,
  accentColor = '#d4af37',
}) => {
  // Ensure we always have photos to display
  const validPhotos = photos && photos.length > 0
    ? photos
    : [
        '/src/assets/images/demo_wedding_portrait_1792595402081.jpg',
        '/src/assets/images/hero_invitations_showcase_1792595400987.jpg',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'leaf_turn' | 'quad' | 'duo'>('leaf_turn');

  // 3D Leaf Turn Flip State
  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);
  const [flipProgress, setFlipProgress] = useState(0); // 0 to 1

  // Dragging gesture state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);

  // Safe current, next, and previous indices
  const total = validPhotos.length;
  const currentPhoto = validPhotos[currentIndex] || validPhotos[0];
  const nextIndex = (currentIndex + 1) % total;
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextPhoto = validPhotos[nextIndex];
  const prevPhoto = validPhotos[prevIndex];

  // Turn to Next Leaf (Page-Flip)
  const flipToNext = () => {
    if (isFlipping || total <= 1) return;
    musicPlayer.playPaperFlip();
    setIsFlipping('next');
    setFlipProgress(1);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
      setIsFlipping(null);
      setFlipProgress(0);
    }, 380);
  };

  // Turn to Previous Leaf (Page-Flip)
  const flipToPrev = () => {
    if (isFlipping || total <= 1) return;
    musicPlayer.playPaperFlip();
    setIsFlipping('prev');
    setFlipProgress(1);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
      setIsFlipping(null);
      setFlipProgress(0);
    }, 380);
  };

  // Touch and Mouse Drag Gestures
  const handleDragStart = (clientX: number) => {
    if (isFlipping) return;
    dragStartX.current = clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStartX.current === null || isFlipping) return;
    const diff = clientX - dragStartX.current;
    // Limit drag to a natural book leaf range
    setDragOffset(Math.max(-180, Math.min(180, diff)));
  };

  const handleDragEnd = () => {
    if (!isDragging || dragStartX.current === null) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    // Past 35px threshold triggers page-flip
    if (dragOffset < -35) {
      flipToNext();
    } else if (dragOffset > 35) {
      flipToPrev();
    }

    setIsDragging(false);
    setDragOffset(0);
    dragStartX.current = null;
  };

  // Compute 3D rotation angle for dragging
  // If user drags left, rotateY around left spine: from 0 down to -75deg
  const liveAngle = isDragging
    ? dragOffset < 0
      ? Math.max(-80, (dragOffset / 140) * 80)
      : Math.min(80, (dragOffset / 140) * 80)
    : 0;

  return (
    <div className={`space-y-3 w-full select-none ${className}`}>
      {/* Header with Title and Layout Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase font-cinzel font-semibold tracking-widest text-amber-400 block">
            {title}
          </span>
          <p className="text-[11px] text-neutral-400">
            {subtitle}
          </p>
        </div>

        {/* Layout switch buttons */}
        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/80 p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setLayoutMode('leaf_turn')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
              layoutMode === 'leaf_turn'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>Hojas 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('quad')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
              layoutMode === 'quad'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Grid className="h-3 w-3" />
            <span>Mosaico</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('duo')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
              layoutMode === 'duo'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="h-3 w-3" />
            <span>Dúo</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. 3D BOOK LEAF-TURN CAROUSEL MODE (Default) */}
      {/* ------------------------------------------------------------- */}
      {layoutMode === 'leaf_turn' && (
        <div className="space-y-2">
          {/* Main 3D Book Leaf Stage with Perspective */}
          <div
            className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-stone-950 shadow-2xl cursor-grab active:cursor-grabbing touch-pan-y group"
            style={{ perspective: '1400px' }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* UNDERNEATH LAYER: Next/Prev Page waiting to be revealed */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
              <img
                src={isFlipping === 'prev' || dragOffset > 0 ? prevPhoto : nextPhoto}
                alt="Hoja siguiente"
                className="h-full w-full object-cover filter brightness-[0.88]"
                draggable={false}
              />
              {/* Paper cast shadow on the revealed page that clears as the page turns */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: isFlipping === 'prev' || dragOffset > 0
                    ? 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 40%)'
                    : 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 40%)',
                  opacity: isDragging ? Math.max(0, 1 - Math.abs(dragOffset) / 120) : isFlipping ? 0.3 : 0,
                }}
              />
            </div>

            {/* TURNING LEAF LAYER (Current page peeling and rotating like real paper) */}
            <div
              className="absolute inset-0 z-10 overflow-hidden bg-neutral-900 backface-hidden"
              style={{
                transformOrigin: isFlipping === 'prev' || dragOffset > 0 ? 'right center' : 'left center',
                transform: isDragging
                  ? `rotateY(${liveAngle}deg)`
                  : isFlipping === 'next'
                  ? 'rotateY(-180deg)'
                  : isFlipping === 'prev'
                  ? 'rotateY(180deg)'
                  : 'rotateY(0deg)',
                transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(0.25, 1, 0.5, 1)',
                boxShadow: isDragging || isFlipping ? '-20px 0 35px rgba(0,0,0,0.85)' : undefined,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <img
                src={currentPhoto}
                alt={`Recuerdo ${currentIndex + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
                onClick={() => {
                  if (!isDragging && Math.abs(dragOffset) < 5 && onOpenPhotoModal) {
                    onOpenPhotoModal(currentPhoto);
                  }
                }}
              />

              {/* Dynamic paper fold gradient shadow during flip */}
              {(isDragging || isFlipping) && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    background:
                      isFlipping === 'prev' || dragOffset > 0
                        ? 'linear-gradient(to right, rgba(0,0,0,0.7), transparent 60%)'
                        : 'linear-gradient(to left, rgba(0,0,0,0.7), transparent 60%)',
                    opacity: isDragging ? Math.min(1, Math.abs(dragOffset) / 80) : 0.8,
                  }}
                />
              )}

              {/* Book Spine Depth on left edge */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none border-r border-amber-500/20" />

              {/* Decorative Photo Corners (Golden mount accents) */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

              {/* Page Curl Dog-Ear Hint in bottom right corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-b-[24px] border-r-[24px] border-b-amber-500/80 border-r-stone-900 shadow-md" />
              </div>
            </div>

            {/* Top Badges (Hoja X de Y) */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
              <span className="rounded-full bg-black/85 border border-amber-400/50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 backdrop-blur-md shadow-lg">
                📖 Hoja {currentIndex + 1} de {total}
              </span>
              <span className="rounded-full bg-black/65 px-2 py-0.5 text-[9px] text-neutral-300 backdrop-blur-md hidden sm:inline">
                Toca para ampliar 🔍
              </span>
            </div>

            {/* Turn Page Arrow Paddles (Left & Right) */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    flipToPrev();
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 hover:bg-amber-500 text-white hover:text-neutral-950 border border-amber-400/40 shadow-xl backdrop-blur-md transition-all group-hover:scale-110 active:scale-95"
                  title="Pasar a la hoja anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    flipToNext();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 hover:bg-amber-500 text-white hover:text-neutral-950 border border-amber-400/40 shadow-xl backdrop-blur-md transition-all group-hover:scale-110 active:scale-95"
                  title="Pasar a la siguiente hoja"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Bottom Dots */}
            <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
              {validPhotos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? 'w-6 bg-amber-400 shadow-md shadow-amber-500/50'
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Tactile Bar: Previous / Next & Hint */}
          <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
            <button
              type="button"
              onClick={flipToPrev}
              disabled={total <= 1 || isFlipping !== null}
              className="flex items-center gap-1 text-[11px] font-semibold text-neutral-300 hover:text-amber-300 transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-amber-400" />
              <span>Hoja Anterior</span>
            </button>

            <span className="text-[10px] text-amber-400/90 font-mono flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Desliza para hojear el álbum</span>
            </span>

            <button
              type="button"
              onClick={flipToNext}
              disabled={total <= 1 || isFlipping !== null}
              className="flex items-center gap-1 text-[11px] font-semibold text-neutral-300 hover:text-amber-300 transition-colors disabled:opacity-40"
            >
              <span>Siguiente Hoja</span>
              <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
            </button>
          </div>

          {/* Interactive Thumbnails Filmstrip */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none max-w-full">
              {validPhotos.map((thumb, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => {
                    if (tIdx !== currentIndex) {
                      musicPlayer.playPaperFlip();
                      setCurrentIndex(tIdx);
                    }
                  }}
                  className={`relative aspect-square w-11 sm:w-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    currentIndex === tIdx
                      ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                      : 'border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-600'
                  }`}
                  title={`Ver hoja ${tIdx + 1}`}
                >
                  <img
                    draggable={false}
                    src={thumb}
                    alt={`Miniatura ${tIdx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MOSAIC 4 PHOTOS MODE */}
      {/* ------------------------------------------------------------- */}
      {layoutMode === 'quad' && (
        <div className="grid grid-cols-2 gap-2">
          {validPhotos.slice(0, 4).map((p, pIdx) => (
            <div
              key={pIdx}
              onClick={() => onOpenPhotoModal?.(p)}
              className="relative aspect-square rounded-xl overflow-hidden border border-amber-500/30 cursor-pointer shadow-md group"
            >
              <img
                src={p}
                alt={`Recuerdo ${pIdx + 1}`}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-amber-300">
                #{pIdx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. DUO EDITORIAL MODE */}
      {/* ------------------------------------------------------------- */}
      {layoutMode === 'duo' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {validPhotos.slice(0, 2).map((p, pIdx) => (
            <div
              key={pIdx}
              onClick={() => onOpenPhotoModal?.(p)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-amber-500/30 cursor-pointer shadow-md group"
            >
              <img
                src={p}
                alt={`Recuerdo ${pIdx + 1}`}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
