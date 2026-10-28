import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: '¿Cómo reciben la invitación digital mis invitados?',
    answer: 'Reciben un enlace web personalizado y un código QR digital de alta resolución. Puedes enviarlo directamente por WhatsApp, Telegram, correo electrónico o redes sociales. Al tocar el enlace, se abre de inmediato en cualquier navegador móvil o de computadora, sin necesidad de descargar ninguna aplicación.',
  },
  {
    question: '¿Puedo modificar los datos de mi invitación después de publicarla?',
    answer: '¡Por supuesto! Tu enlace permanece idéntico. Si cambia algún horario, hotel sede, mesa de regalos o detalle del itinerario, puedes actualizarlo desde el editor y todos los invitados verán la versión actualizada al instante.',
  },
  {
    question: '¿Cómo funciona la confirmación de asistencia (RSVP)?',
    answer: 'Cada invitado puede ingresar su nombre, marcar si asistirá o no, indicar el número de acompañantes y agregar notas dietéticas o mensajes de felicitación. Los datos se guardan en tiempo real en tu panel administrativo, y además el invitado puede enviar una confirmación directa a tu WhatsApp con un mensaje pre-redactado en un solo toque.',
  },
  {
    question: '¿La música se reproduce automáticamente al abrir la invitación?',
    answer: 'Por normativas de privacidad y experiencia de usuario de navegadores modernos como iOS Safari y Google Chrome, el audio requiere una primera interacción táctil (como tocar el sello de cera para abrir el sobre o pulsar el botón de música). Esto garantiza que nunca suene de forma molesta o inapropiada.',
  },
  {
    question: '¿Cómo entrego la invitación impresa si también quiero papelería física?',
    answer: 'Cada invitación genera un código QR vectorial listo para imprimir. Puedes entregarlo a tu impresor para agregarlo a tus sobres o recuerdos físicos para que tus invitados disfruten la experiencia digital con un escaneo.',
  },
  {
    question: '¿Qué formas de pago están disponibles para contratar?',
    answer: 'Puedes solicitar y activar tu invitación mediante transferencia bancaria SPEI, tarjeta de débito/crédito y asesoría personalizada en WhatsApp con el equipo de LAV Digital.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-normal text-neutral-100">
            Resolvemos Todas tus Dudas
          </h2>
          <p className="text-sm text-neutral-400">
            Todo lo que necesitas saber sobre el funcionamiento, personalización y entrega de tus invitaciones digitales.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-neutral-200 hover:text-amber-300 transition-colors"
                >
                  <span className="font-playfair text-base">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
