/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Invitation,
  Template,
  EventCategory,
  PricingPlan,
  Coupon,
  RSVPRecord,
} from './types';
import {
  getStoredInvitations,
  getStoredTemplates,
  getStoredRSVPs,
  getStoredPricing,
  getStoredCoupons,
  getInvitationBySlug,
} from './utils/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { InteractiveDemoShowcase } from './components/home/InteractiveDemoShowcase';
import { TemplateCatalog } from './components/home/TemplateCatalog';
import { FeaturesBento } from './components/home/FeaturesBento';
import { PricingSection } from './components/home/PricingSection';
import { FAQSection } from './components/home/FAQSection';
import { InvitationViewer } from './components/invitation/InvitationViewer';
import { InvitationEditor } from './components/editor/InvitationEditor';
import { AdminHub } from './components/admin/AdminHub';

type ViewType = 'home' | 'catalog' | 'demos' | 'pricing' | 'editor' | 'admin' | 'invitation-view';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [invitations, setInvitations] = useState<Invitation[]>(() => getStoredInvitations());
  const [templates, setTemplates] = useState<Template[]>(() => getStoredTemplates());
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(() => getStoredRSVPs());
  const [pricing, setPricing] = useState<PricingPlan[]>(() => getStoredPricing());
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStoredCoupons());

  // Selected state for editor or viewer
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeInvitationSlug, setActiveInvitationSlug] = useState<string | null>(null);
  const [invitationToEdit, setInvitationToEdit] = useState<Invitation | null>(null);
  const [templateToCustomize, setTemplateToCustomize] = useState<Template | null>(null);
  const [chosenTier, setChosenTier] = useState<'esencial' | 'premium' | 'exclusivo'>('premium');

  // Load persistent data
  const loadData = () => {
    setInvitations(getStoredInvitations());
    setTemplates(getStoredTemplates());
    setRsvps(getStoredRSVPs());
    setPricing(getStoredPricing());
    setCoupons(getStoredCoupons());
  };

  useEffect(() => {
    loadData();

    // Check hash URL (e.g. #/invitation/demo-boda)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/invitation/')) {
        const slug = hash.replace('#/invitation/', '').trim();
        if (slug) {
          setActiveInvitationSlug(slug);
          setCurrentView('invitation-view');
        }
      } else if (hash === '#/admin') {
        setCurrentView('admin');
      } else if (hash === '#/editor') {
        setCurrentView('editor');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Top navigation handler
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'home' || view === 'catalog' || view === 'demos' || view === 'pricing') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open an invitation by slug in full interactive mode
  const handleOpenInvitation = (slug: string) => {
    setActiveInvitationSlug(slug);
    setCurrentView('invitation-view');
    window.location.hash = `#/invitation/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Customize from a template
  const handleCustomizeTemplate = (tmpl: Template) => {
    setTemplateToCustomize(tmpl);
    setInvitationToEdit(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Customize from an existing demo
  const handleCustomizeDemo = (demo: Invitation) => {
    setInvitationToEdit(demo);
    setTemplateToCustomize(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a pricing plan
  const handleSelectPlan = (tier: 'esencial' | 'premium' | 'exclusivo') => {
    setChosenTier(tier);
    setInvitationToEdit(null);
    setTemplateToCustomize(null);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Finish editing / publishing
  const handleFinishEditing = (published: Invitation) => {
    loadData();
    handleOpenInvitation(published.slug);
  };

  // Return to portal from viewer or editor
  const handleBackToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve currently active invitation for viewer
  const currentViewInvitation = activeInvitationSlug
    ? getInvitationBySlug(activeInvitationSlug) || invitations[0]
    : invitations[0];

  // -----------------------------------------------------------------
  // VIEW: Standalone Interactive Invitation
  // -----------------------------------------------------------------
  if (currentView === 'invitation-view' && currentViewInvitation) {
    return (
      <InvitationViewer
        invitation={currentViewInvitation}
        onBackToHome={handleBackToHome}
        onEditInvitation={(inv) => {
          setInvitationToEdit(inv);
          setTemplateToCustomize(null);
          setCurrentView('editor');
        }}
        isStandalone={true}
      />
    );
  }

  // -----------------------------------------------------------------
  // VIEW: Invitation Editor
  // -----------------------------------------------------------------
  if (currentView === 'editor') {
    return (
      <InvitationEditor
        initialInvitation={invitationToEdit}
        initialTemplate={templateToCustomize}
        initialTier={chosenTier}
        templates={templates}
        onFinish={handleFinishEditing}
        onCancel={handleBackToHome}
      />
    );
  }

  // -----------------------------------------------------------------
  // VIEW: Admin Hub
  // -----------------------------------------------------------------
  if (currentView === 'admin') {
    return (
      <AdminHub
        invitations={invitations}
        rsvps={rsvps}
        pricing={pricing}
        coupons={coupons}
        templates={templates}
        onRefreshData={loadData}
        onEditInvitation={(inv) => {
          setInvitationToEdit(inv);
          setCurrentView('editor');
        }}
        onViewInvitation={handleOpenInvitation}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // -----------------------------------------------------------------
  // DEFAULT VIEWS: Home / Catalog / Demos / Pricing
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        currentView={currentView as any}
        onNavigate={(v) => handleNavigate(v as ViewType)}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              demos={invitations.slice(0, 3)}
              onNavigate={(v) => handleNavigate(v as ViewType)}
              onOpenInvitation={handleOpenInvitation}
            />

            <CategoryShowcase
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => {
                setSelectedCategoryFilter(cat);
                const catalogEl = document.getElementById('catalog');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            <InteractiveDemoShowcase
              demos={invitations.slice(0, 3)}
              onOpenInvitation={handleOpenInvitation}
              onCustomizeDemo={handleCustomizeDemo}
            />

            <TemplateCatalog
              templates={templates}
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              onSelectTemplateToCustomize={handleCustomizeTemplate}
            />

            <FeaturesBento />

            <PricingSection
              pricing={pricing}
              onSelectPlan={handleSelectPlan}
            />

            <FAQSection />
          </>
        )}

        {currentView === 'catalog' && (
          <div className="pt-8">
            <TemplateCatalog
              templates={templates}
              selectedCategory={selectedCategoryFilter}
              onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
              onSelectTemplateToCustomize={handleCustomizeTemplate}
            />
          </div>
        )}

        {currentView === 'demos' && (
          <div className="pt-8">
            <InteractiveDemoShowcase
              demos={invitations.slice(0, 3)}
              onOpenInvitation={handleOpenInvitation}
              onCustomizeDemo={handleCustomizeDemo}
            />
          </div>
        )}

        {currentView === 'pricing' && (
          <div className="pt-8">
            <PricingSection
              pricing={pricing}
              onSelectPlan={handleSelectPlan}
            />
            <FAQSection />
          </div>
        )}
      </main>

      <Footer onNavigate={(v) => handleNavigate(v as ViewType)} />
    </div>
  );
}
