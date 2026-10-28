import React from 'react';
import { Check, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { PricingPlan } from '../../types';

interface PricingSectionProps {
  pricing: PricingPlan[];
  onSelectPlan: (tier: 'esencial' | 'premium' | 'exclusivo') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  pricing,
  onSelectPlan,
}) => {
  return (
    <section id="pricing" className="py-24 border-t border-neutral-900 bg-neutral-950/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Paquetes & Experiencias a Medida</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-100">
            Elige el Paquete Ideal para tu Evento
          </h2>
          <p className="text-base text-neutral-400">
            Cada paquete incluye diseño exclusivo, alojamiento web de alta velocidad y soporte técnico antes de tu fecha especial.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricing.map((plan) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 ${
                  isPopular
                    ? 'border-2 border-amber-400/80 bg-neutral-900/90 shadow-2xl shadow-amber-500/10 md:-translate-y-2'
                    : 'border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-950 shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="space-y-2">
                    <h3 className="font-playfair text-2xl font-bold text-neutral-100">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 min-h-[32px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Consultation Label (No specific price numbers) */}
                  <div className="mt-6 mb-8 flex items-baseline gap-2">
                    <span className="font-cinzel text-lg font-bold text-amber-300">
                      Cotización a Medida
                    </span>
                    <span className="text-xs text-neutral-500">· Plan {plan.name}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 border-t border-neutral-800/80 pt-6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Incluye:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-8 mt-6 border-t border-neutral-800/80">
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isPopular
                        ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                        : 'border border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-800 hover:border-amber-400/50 hover:text-white'
                    }`}
                  >
                    <span>Elegir Paquete {plan.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Quality guarantee */}
        <div className="mt-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-amber-400/70" />
          <span>Garantía de satisfacción LAV Digital Marketing · Ediciones ilimitadas previas al evento</span>
        </div>
      </div>
    </section>
  );
};
