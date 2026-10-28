import React, { useState } from 'react';
import { Sparkles, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'catalog' | 'demos' | 'pricing' | 'editor' | 'admin';
  onNavigate: (view: 'home' | 'catalog' | 'demos' | 'pricing' | 'editor' | 'admin', extra?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (view: 'home' | 'catalog' | 'demos' | 'pricing' | 'editor' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="group flex items-center gap-2.5 text-left text-neutral-100 transition-colors whitespace-nowrap shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-cinzel text-xl font-bold tracking-wider text-neutral-100 group-hover:text-amber-200 transition-colors">
              LAV INVITATIONS
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => handleLinkClick('home')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              currentView === 'home' ? 'text-amber-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleLinkClick('catalog')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              currentView === 'catalog' ? 'text-amber-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Catálogo de Diseños
          </button>
          <button
            onClick={() => handleLinkClick('demos')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              currentView === 'demos' ? 'text-amber-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Demostraciones en Vivo
          </button>
          <button
            onClick={() => handleLinkClick('pricing')}
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 ${
              currentView === 'pricing' ? 'text-amber-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Paquetes
          </button>
          <button
            onClick={() => handleLinkClick('admin')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 hover:text-neutral-200 ${
              currentView === 'admin' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
            }`}
            title="Panel de Administración"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-500" />
            <span>Admin Hub</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden items-center gap-4 md:flex shrink-0">
          <button
            onClick={() => handleLinkClick('editor')}
            className="rounded-lg border border-amber-400/40 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 shadow-lg shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 hover:shadow-amber-500/25 whitespace-nowrap shrink-0"
          >
            Crear mi Invitación
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-neutral-800 p-2 text-neutral-400 hover:text-neutral-100"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleLinkClick('home')}
              className="text-left text-sm font-medium text-neutral-200 hover:text-amber-300"
            >
              Inicio
            </button>
            <button
              onClick={() => handleLinkClick('catalog')}
              className="text-left text-sm font-medium text-neutral-200 hover:text-amber-300"
            >
              Catálogo de Diseños
            </button>
            <button
              onClick={() => handleLinkClick('demos')}
              className="text-left text-sm font-medium text-neutral-200 hover:text-amber-300"
            >
              Demostraciones en Vivo
            </button>
            <button
              onClick={() => handleLinkClick('pricing')}
              className="text-left text-sm font-medium text-neutral-200 hover:text-amber-300"
            >
              Paquetes y Precios
            </button>
            <button
              onClick={() => handleLinkClick('admin')}
              className="flex items-center gap-2 text-left text-sm font-medium text-neutral-400 hover:text-neutral-200"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Panel de Administración</span>
            </button>
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('editor')}
                className="w-full rounded-lg bg-amber-500 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-950"
              >
                Crear mi Invitación
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
