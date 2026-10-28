import React from 'react';
import { Mail, Music, MapPin, CheckCircle, Gift, CalendarCheck, ShieldCheck, Smartphone } from 'lucide-react';

export const FeaturesBento: React.FC = () => {
  return (
    <section className="py-24 border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Innovación & Tecnología Web</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-100">
            Todo lo que una Invitación Digital Debe Ser
          </h2>
          <p className="text-base text-neutral-400">
            Diseñadas con los estándares más exigentes de la web moderna. Cada invitado vive una experiencia interactiva sin fricciones, sin publicidad molesta y sin descargas.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Bento Card 1: Envelope & Seal (Span 2) */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-all group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Mail className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-amber-400">01. Ceremonia de Apertura</span>
              <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                Sobre Digital & Sello de Cera Interactivo
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
                Al abrir el enlace, tus invitados interactúan con una animación cinematográfica de un sobre con monograma en lacre dorado que se desprende con un toque suave.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-xs text-neutral-500">
              <span>Efecto háptico</span>
              <span aria-hidden="true">·</span>
              <span>Personalización heráldica</span>
            </div>
          </div>

          {/* Bento Card 2: Realtime RSVP */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-all group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-emerald-400">02. Control de Asistencia</span>
              <h3 className="font-playfair text-xl font-bold text-neutral-100">
                Confirmación RSVP & WhatsApp
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tus invitados confirman número de acompañantes y restricciones dietéticas en segundos con respaldo directo a tu WhatsApp.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-500">
              Exportación a CSV en 1 clic
            </div>
          </div>

          {/* Bento Card 3: Ambient Music */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-all group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Music className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-purple-400">03. Banda Sonora</span>
              <h3 className="font-playfair text-xl font-bold text-neutral-100">
                Música Ambiental Integrada
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Reproducción de alta fidelidad con control de volumen flotante. Nunca se reproduce de forma intrusiva sin la interacción del invitado.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-500">
              Cero pausas de carga
            </div>
          </div>

          {/* Bento Card 4: Maps & Location */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-all group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-sky-400">04. Cómo Llegar</span>
              <h3 className="font-playfair text-xl font-bold text-neutral-100">
                Google Maps & Waze en 1 Toque
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ruta asistida directa hacia la hacienda, templo o salón de eventos para evitar retrasos y extravíos.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-500">
              Copiar dirección con un toque
            </div>
          </div>

          {/* Bento Card 5: Calendar Sync (Span 2) */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-all group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-rose-400">05. Recordatorio Automático</span>
              <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                Sincronización con Google Calendar & Apple iCal
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
                Tus invitados añaden tu fecha a su calendario con horario, ubicación y alertas automáticas previas para no olvidar ningún detalle.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-xs text-neutral-500">
              <span>Sin duplicar eventos</span>
              <span aria-hidden="true">·</span>
              <span>Archivo .ics universal incluido</span>
            </div>
          </div>

          {/* Bento Card 6: Gift Registry */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-all group">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Gift className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-amber-400">06. Mesa de Regalos</span>
              <h3 className="font-playfair text-xl font-bold text-neutral-100">
                Tiendas & Datos Bancarios
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enlaces a Liverpool, El Palacio de Hierro, Amazon o cuenta CLABE para transferencias con botón para copiar.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-500">
              Lluvia de sobres y datos seguros
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
