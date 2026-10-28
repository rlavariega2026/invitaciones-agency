import React from 'react';
import { Sparkles, MessageCircle, Heart, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'catalog' | 'demos' | 'pricing' | 'editor' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-wider text-neutral-100">
                LAV INVITATIONS
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Plataforma premium de invitaciones digitales interactivas. Una creación de <span className="text-neutral-200 font-medium">LAV Digital Marketing</span>.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500">
              <span>Diseño de Vanguardia</span>
              <span aria-hidden="true">·</span>
              <span>Experiencias Memorables</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Categorías
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-amber-300 transition-colors">
                  Bodas de Ensueño
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-amber-300 transition-colors">
                  XV Años & Galas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-amber-300 transition-colors">
                  Fiestas Infantiles Temáticas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-amber-300 transition-colors">
                  Cumpleaños & Aniversarios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-amber-300 transition-colors">
                  Bautizos & Graduaciones
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('demos')} className="hover:text-amber-300 transition-colors">
                  Demostraciones en Vivo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editor')} className="hover:text-amber-300 transition-colors">
                  Editor de Invitaciones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-amber-300 transition-colors">
                  Paquetes y Tarifas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-amber-300 transition-colors">
                  Panel de Control Administrativo
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-neutral-200 mb-4">
              Atención & Ventas
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/5215500000000?text=Hola%2C%20quisiera%20informes%20sobre%20LAV%20Invitations"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-amber-300 hover:text-amber-200 transition-colors font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Asesoría directa en WhatsApp</span>
              </a>
              <div className="flex items-center gap-2.5 text-neutral-400">
                <Mail className="h-4 w-4 text-neutral-500" />
                <span>contacto@lavdigital.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-400">
                <Phone className="h-4 w-4 text-neutral-500" />
                <span>+52 (55) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-500 text-xs pt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>Servicio disponible para todo México y Latinoamérica</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} LAV Digital Marketing. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Hecho con devoción por el detalle</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>para tus eventos más especiales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
