import React, { useState, useEffect, useRef } from 'react';
import demoKidsSpaceImage from '../../assets/images/demo_kids_space_1792595402717.jpg';
import demoQuincePortraitImage from '../../assets/images/demo_quince_portrait_1792595402137.jpg';
import demoWeddingPortraitImage from '../../assets/images/demo_wedding_portrait_1792595402081.jpg';
import eraseUnaVezBookImage from '../../assets/images/erase_una_vez_book_preview_1792605109334.jpg';
import heroInvitationsImage from '../../assets/images/hero_invitations_showcase_1792595400987.jpg';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  Clock,
  MapPin,
  Music,
  Heart,
  Image as ImageIcon,
  Palette,
  Send,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Share2,
  MessageCircle,
  Upload,
  Star,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  Invitation,
  Template,
  EventCategory,
  TemplateStyle,
  EnvelopeAnimationType,
  EntranceButtonDesign,
  ItineraryItem,
  GiftRegistryItem,
} from '../../types';
import { saveOrUpdateInvitation } from '../../utils/storage';
import { generateQrSvgDataUri } from '../../utils/calendarAndQr';
import { CelebrationParticles } from '../common/CelebrationParticles';
import { compressAndReadFile, compressMultipleFiles } from '../../utils/imageUpload';
import { EditorLivePreview } from './EditorLivePreview';
import { EntranceButtonSelector } from '../invitation/EntranceButtonCollection';

interface InvitationEditorProps {
  initialInvitation?: Invitation | null;
  initialTemplate?: Template | null;
  initialTier?: 'esencial' | 'premium' | 'exclusivo';
  templates: Template[];
  onFinish: (publishedInvitation: Invitation) => void;
  onCancel: () => void;
}

const CURATED_SAMPLE_IMAGES = [
  { label: 'Libro Érase una vez — Encuadernación', url: eraseUnaVezBookImage },
  { label: 'Boda Italiana al Atardecer', url: demoWeddingPortraitImage },
  { label: 'Papelería Nupcial de Lujo & Anillos', url: heroInvitationsImage },
  { label: 'XV Años Esmeralda Real', url: demoQuincePortraitImage },
  { label: 'Misión Espacial Infantil', url: demoKidsSpaceImage },
  { label: 'Banquete & Luces de Jardín', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flores Blancas & Champagne', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
];

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  initialInvitation,
  initialTemplate,
  initialTier = 'premium',
  templates,
  onFinish,
  onCancel,
}) => {
  // Current step (1 to 9)
  const [currentStep, setCurrentStep] = useState(1);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'form' | 'preview' | 'split'>('split');

  // Form State
  const [category, setCategory] = useState<EventCategory>(
    initialInvitation?.category || initialTemplate?.category || 'boda'
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialInvitation?.templateId || initialTemplate?.id || 'tmpl-boda-gold'
  );
  const [title, setTitle] = useState(
    initialInvitation?.title || (initialTemplate?.name ? `Invitación — ${initialTemplate.name}` : 'Nuestra Boda de Ensueño')
  );
  const [headline, setHeadline] = useState(
    initialInvitation?.headline || initialTemplate?.defaultHeadline || 'Nuestra Boda'
  );
  const [hostNames, setHostNames] = useState(initialInvitation?.hostNames || 'Sofía & Mateo');
  const [parentsNames, setParentsNames] = useState(initialInvitation?.parentsNames || '');
  const [godparentsNames, setGodparentsNames] = useState(initialInvitation?.godparentsNames || '');
  const [eventDate, setEventDate] = useState(initialInvitation?.eventDate || '2026-11-28');
  const [eventTime, setEventTime] = useState(initialInvitation?.eventTime || '18:00');
  const [venueName, setVenueName] = useState(initialInvitation?.venueName || 'Hacienda San José de las Palmas');
  const [venueAddress, setVenueAddress] = useState(initialInvitation?.venueAddress || 'Carretera Real del Monte Km 14.5, Valle Central');

  // Media
  const [coverImage, setCoverImage] = useState(
    initialInvitation?.coverImage ||
    initialTemplate?.previewImage ||
    demoWeddingPortraitImage
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialInvitation?.galleryImages || [
      demoWeddingPortraitImage,
      heroInvitationsImage,
    ]
  );

  // Image upload states & refs
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const dataUrl = await compressAndReadFile(file);
      setCoverImage(dataUrl);
      if (!galleryImages.includes(dataUrl)) {
        setGalleryImages((prev) => [dataUrl, ...prev]);
      }
    } catch (err) {
      console.error('Error al procesar foto de portada:', err);
    } finally {
      setIsUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCoverDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      setIsUploadingCover(true);
      const dataUrl = await compressAndReadFile(file);
      setCoverImage(dataUrl);
      if (!galleryImages.includes(dataUrl)) {
        setGalleryImages((prev) => [dataUrl, ...prev]);
      }
    } catch (err) {
      console.error('Error al procesar archivo soltado:', err);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const dataUrls = await compressMultipleFiles(files);
      setGalleryImages((prev) => [...prev, ...dataUrls]);
    } catch (err) {
      console.error('Error al procesar fotos de galería:', err);
    } finally {
      setIsUploadingGallery(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleGalleryDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setGalleryDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const dataUrls = await compressMultipleFiles(files);
      setGalleryImages((prev) => [...prev, ...dataUrls]);
    } catch (err) {
      console.error('Error al procesar archivos soltados:', err);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetImageAsCover = (imgUrl: string) => {
    setCoverImage(imgUrl);
  };

  const isInitialBook = initialInvitation?.templateId === 'tmpl-erase-una-vez-book' || initialInvitation?.style === 'premium_book' || initialTemplate?.id === 'tmpl-erase-una-vez-book' || initialTemplate?.style === 'premium_book';

  const [style, setStyle] = useState<TemplateStyle>(
    initialInvitation?.style || initialTemplate?.style || (isInitialBook ? 'premium_book' : 'luxury_gold')
  );
  const [primaryColor, setPrimaryColor] = useState(initialInvitation?.primaryColor || initialTemplate?.primaryColor || '#d4af37');
  const [fontHeading, setFontHeading] = useState<'Cinzel' | 'Playfair Display' | 'Cormorant Garamond' | 'Plus Jakarta Sans'>(
    initialInvitation?.fontHeading || initialTemplate?.fontHeading || (isInitialBook ? 'Cormorant Garamond' : 'Cinzel')
  );
  const [envelopeAnimation, setEnvelopeAnimation] = useState<EnvelopeAnimationType>(
    initialInvitation?.envelopeAnimation || initialTemplate?.envelopeAnimation || (isInitialBook ? 'book_open' : 'wax_seal')
  );
  const [bookCoverStyle, setBookCoverStyle] = useState<'romantic' | 'vintage' | 'editorial' | 'minimalist' | 'modern' | 'luxury_linen'>(
    initialInvitation?.bookCoverStyle || 'luxury_linen'
  );
  const [entranceButtonDesign, setEntranceButtonDesign] = useState<EntranceButtonDesign>(
    initialInvitation?.entranceButtonDesign || initialTemplate?.entranceButtonDesign || (isInitialBook ? 'gold_foil_card' : 'wax_seal')
  );
  const [entranceButtonText, setEntranceButtonText] = useState<string>(
    initialInvitation?.entranceButtonText || 'Tienes una invitación'
  );

  // Personalized Guest Link generator state
  const [guestLinkName, setGuestLinkName] = useState('');
  const [guestLinkPasses, setGuestLinkPasses] = useState<number>(2);
  const [copiedGuestLink, setCopiedGuestLink] = useState(false);

  const [musicTrackId, setMusicTrackId] = useState<'wedding_canon' | 'quince_waltz' | 'kids_cheerful' | 'acoustic_romance' | 'none'>(
    initialInvitation?.musicTrackId || (initialTemplate?.defaultMusic as any) || 'wedding_canon'
  );
  const [particlesEffect, setParticlesEffect] = useState<'petals' | 'sparkles' | 'confetti' | 'none'>(
    initialInvitation?.particlesEffect || 'petals'
  );

  // Itinerary & Dress code
  const [dressCode, setDressCode] = useState(initialInvitation?.dressCode || 'Rigurosa Etiqueta');
  const [dressCodeDetails, setDressCodeDetails] = useState(
    initialInvitation?.dressCodeDetails || 'Caballeros: Esmoquin o traje negro. Damas: Vestido largo.'
  );
  const [personalMessage, setPersonalMessage] = useState(
    initialInvitation?.personalMessage ||
      'Los momentos más hermosos de la vida merecen ser compartidos con las personas que más queremos. ¡Esperamos contar con tu presencia!'
  );
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(
    initialInvitation?.itinerary || [
      { time: '17:30', title: 'Ceremonia Religiosa', description: 'Capilla del lugar.', icon: 'Church' },
      { time: '19:00', title: 'Recepción & Cocktail', description: 'Jardines principales con música.', icon: 'GlassWater' },
      { time: '20:30', title: 'Cena de Gala & Brindis', description: 'Menú especial maridado.', icon: 'Utensils' },
      { time: '22:00', title: 'Apertura de Pista & Fiesta', description: 'Celebración y música con DJ.', icon: 'Sparkles' },
    ]
  );

  // RSVP & Gifts
  const [rsvpEnabled, setRsvpEnabled] = useState(initialInvitation?.rsvpEnabled !== false);
  const [rsvpDeadline, setRsvpDeadline] = useState(initialInvitation?.rsvpDeadline || '2026-11-10');
  const [rsvpWhatsAppPhone, setRsvpWhatsAppPhone] = useState(initialInvitation?.rsvpWhatsAppPhone || '+525512345678');
  const [giftRegistries, setGiftRegistries] = useState<GiftRegistryItem[]>(
    initialInvitation?.giftRegistries || [
      { type: 'store', title: 'Liverpool', detail: 'Evento Núm. 50928371' },
      { type: 'bank', title: 'Transferencia Bancaria', detail: 'CLABE: 0121 8001 5492 8839 21 · Banco BBVA' },
    ]
  );

  // Published result
  const [publishedData, setPublishedData] = useState<Invitation | null>(null);

  // Whenever template changes, auto-update defaults if user switches
  const handleTemplateSelect = (tmpl: Template) => {
    setSelectedTemplateId(tmpl.id);
    setCategory(tmpl.category);
    setStyle(tmpl.style);
    setHeadline(tmpl.defaultHeadline);
    setDressCode(tmpl.defaultDressCode);
    setMusicTrackId(tmpl.defaultMusic);

    if (tmpl.id === 'tmpl-erase-una-vez-book' || tmpl.style === 'premium_book') {
      setStyle('premium_book');
      setEnvelopeAnimation('book_open');
      setFontHeading('Cormorant Garamond');
      setCoverImage(eraseUnaVezBookImage);
      setParticlesEffect('petals');
      setBookCoverStyle('luxury_linen');
    } else if (tmpl.category === 'boda') {
      setParticlesEffect('petals');
      setFontHeading('Cinzel');
      setEnvelopeAnimation('wax_seal');
    } else if (tmpl.category === 'xv_anos') {
      setParticlesEffect('sparkles');
      setFontHeading('Playfair Display');
      setEnvelopeAnimation('royal_curtain');
    } else if (tmpl.category === 'infantil') {
      setParticlesEffect('confetti');
      setFontHeading('Plus Jakarta Sans');
      setEnvelopeAnimation('ribbon_box');
    }
  };

  // Add Itinerary Item
  const handleAddItineraryItem = () => {
    setItinerary([
      ...itinerary,
      { time: '21:00', title: 'Nuevo Momento', description: 'Descripción de la actividad', icon: 'Sparkles' },
    ]);
  };

  const handleRemoveItineraryItem = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  // Add Gift Registry Item
  const handleAddGift = () => {
    setGiftRegistries([
      ...giftRegistries,
      { type: 'store', title: 'El Palacio de Hierro', detail: 'Mesa de Regalos Núm. 123456' },
    ]);
  };

  const handleRemoveGift = (index: number) => {
    setGiftRegistries(giftRegistries.filter((_, i) => i !== index));
  };

  // Build the complete invitation object
  const buildCurrentInvitation = (): Invitation => {
    const slugBase = (hostNames || 'mi-evento')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = initialInvitation?.id || 'inv-' + Date.now();
    const slug = initialInvitation?.slug || `${slugBase}-${id.slice(-4)}`;

    return {
      id,
      slug,
      templateId: selectedTemplateId,
      category,
      title: title.trim() || 'Invitación Exclusiva',
      headline: headline.trim() || 'Nuestra Celebración',
      hostNames: hostNames.trim() || 'Los Anfitriones',
      parentsNames: parentsNames.trim() || undefined,
      godparentsNames: godparentsNames.trim() || undefined,
      eventDate,
      eventTime,
      venueName: venueName.trim() || 'Salón de Eventos',
      venueAddress: venueAddress.trim() || 'Dirección del Evento',
      coverImage,
      galleryImages,
      style,
      primaryColor,
      fontHeading,
      envelopeAnimation,
      bookCoverStyle,
      bookPages: initialInvitation?.bookPages,
      entranceButtonDesign,
      entranceButtonText: entranceButtonText.trim() || 'Tienes una invitación',
      musicTrackId,
      dressCode,
      dressCodeDetails,
      dressCodeColors: style === 'luxury_gold' ? ['#0A0A0A', '#1E3A8A', '#064E3B'] : ['#38bdf8', '#f43f5e', '#a855f7'],
      personalMessage,
      itinerary,
      giftRegistries,
      rsvpEnabled,
      rsvpDeadline,
      rsvpWhatsAppPhone,
      particlesEffect,
      packageTier: initialTier,
      status: 'activa',
      visitsCount: initialInvitation?.visitsCount || 1,
      rsvpsCount: initialInvitation?.rsvpsCount || 0,
      createdAt: initialInvitation?.createdAt || new Date().toISOString().split('T')[0],
    };
  };

  // Publish handler
  const handlePublish = () => {
    const finalInvite = buildCurrentInvitation();
    saveOrUpdateInvitation(finalInvite);
    setPublishedData(finalInvite);
    setCurrentStep(9);
  };

  const currentPreviewData = buildCurrentInvitation();
  const invitationBasePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const shareUrl = `${window.location.origin}${invitationBasePath}/i/${encodeURIComponent(publishedData?.slug || currentPreviewData.slug)}`;
  const qrSvgUri = generateQrSvgDataUri(shareUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24">
      {/* Top Wizard Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Salir al Menú</span>
            </button>
            <div className="hidden sm:block">
              <span className="font-cinzel text-sm font-bold text-white">Editor LAV Invitations</span>
              <span className="text-xs text-neutral-400 ml-2">Paso {currentStep} de 9</span>
            </div>
          </div>

          {/* Stepper Dots (1 to 9) */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setCurrentStep(step);
                  if (activeEditorTab === 'preview') setActiveEditorTab('form');
                }}
                className={`h-2.5 rounded-full transition-all ${
                  currentStep === step
                    ? 'w-7 bg-amber-500'
                    : step < currentStep
                    ? 'w-2.5 bg-amber-400/60'
                    : 'w-2.5 bg-neutral-800'
                }`}
                title={`Paso ${step}`}
              />
            ))}
          </div>

          {/* Desktop Layout Mode Switcher */}
          <div className="hidden lg:flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveEditorTab('split')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                activeEditorTab === 'split' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista Dividida (Formulario + Previa)"
            >
              Dividida
            </button>
            <button
              type="button"
              onClick={() => setActiveEditorTab('form')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                activeEditorTab === 'form' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="Solo Formulario de Edición"
            >
              Solo Formulario
            </button>
            <button
              type="button"
              onClick={() => setActiveEditorTab('preview')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                activeEditorTab === 'preview' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="Solo Vista Previa en Vivo"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>Vista Previa</span>
            </button>
          </div>

          {/* Next / Previous Controls */}
          <div className="flex items-center gap-2">
            {currentStep > 1 && currentStep < 9 && (
              <button
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  if (activeEditorTab === 'preview') setActiveEditorTab('form');
                }}
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
              >
                Anterior
              </button>
            )}
            {currentStep < 8 && (
              <button
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                  if (activeEditorTab === 'preview') setActiveEditorTab('form');
                }}
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400"
              >
                <span>Siguiente</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            {currentStep === 8 && (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Publicar Invitación</span>
              </button>
            )}
            {currentStep === 9 && (
              <button
                onClick={() => onFinish(publishedData || currentPreviewData)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-emerald-400"
              >
                <Check className="h-4 w-4" />
                <span>Ir a mi Invitación</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Viewport Tab Switcher (Visible on screens < lg) */}
        <div className="flex lg:hidden items-center justify-between gap-2 pt-3 mt-3 border-t border-neutral-800/80">
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 p-1 w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveEditorTab('form')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeEditorTab !== 'preview'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Paso {currentStep}: Formulario</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab('preview')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeEditorTab === 'preview'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Eye className="h-3.5 w-3.5" />
              <span>Vista Previa en Vivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Editor Form (Left) & Real-time Live Preview (Right) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className={`grid grid-cols-1 ${activeEditorTab === 'split' ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-8 items-start`}>

          {/* LEFT: Step Content Form */}
          {(activeEditorTab === 'form' || activeEditorTab === 'split' || activeEditorTab !== 'preview') && (
            <div className={`${activeEditorTab === 'split' ? 'lg:col-span-7' : 'max-w-3xl mx-auto w-full'} space-y-6`}>

            {/* ------------------------------------------------------------- */}
            {/* PASO 1: Elegir Tipo de Evento */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 1 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    ¿Qué tipo de evento estás celebrando?
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Esto adaptará las recomendaciones de tipografía, animaciones y música ambiental.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                  {[
                    { id: 'boda', label: 'Boda', desc: 'Romance y alta etiqueta' },
                    { id: 'xv_anos', label: 'XV Años', desc: 'Gala y glamour' },
                    { id: 'cumpleanos', label: 'Cumpleaños', desc: 'Celebración de honor' },
                    { id: 'graduacion', label: 'Graduación', desc: 'Magna cum laude' },
                    { id: 'bautizo', label: 'Bautizo', desc: 'Celestial y puro' },
                    { id: 'primera_comunion', label: '1ª Comunión', desc: 'Eucaristía y bendición' },
                    { id: 'baby_shower', label: 'Baby Shower', desc: 'Dulce espera y ternura' },
                    { id: 'gender_reveal', label: 'Revelación Género', desc: '¿Niño o niña? Sorpresa' },
                    { id: 'aniversario', label: 'Aniversario', desc: 'Bodas de plata y oro' },
                    { id: 'infantil', label: 'Fiesta Infantil', desc: 'Aventura y alegría' },
                    { id: 'corporativo', label: 'Corporativo', desc: 'Gala anual y summit' },
                    { id: 'inauguracion', label: 'Inauguración', desc: 'Corte de listón y cóctel' },
                    { id: 'despedida', label: 'Despedida', desc: 'Bachelorette y sunset' },
                    { id: 'reunion_familiar', label: 'Reunión Familiar', desc: 'Unión y raíces familiares' },
                    { id: 'personalizado', label: 'Personalizado', desc: 'Diseño a tu medida de autor' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCategory(item.id as EventCategory)}
                      className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                        category === item.id
                          ? 'border-amber-400 bg-amber-500/15 text-white shadow-md ring-1 ring-amber-400/40'
                          : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span className="font-playfair text-sm font-bold text-white">{item.label}</span>
                      <span className="text-[10px] text-neutral-400 mt-1 line-clamp-1">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 2: Seleccionar Plantilla */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 2 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    Selecciona una Plantilla de Inspiración
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Puedes personalizar todos los textos, colores y fotos más adelante.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {templates.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleTemplateSelect(tmpl)}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-neutral-800 shadow-md shadow-amber-500/10'
                            : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                        }`}
                      >
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-950 mb-3 relative">
                          <img
                            src={tmpl.previewImage}
                            alt={tmpl.name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-neutral-950 font-bold">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-playfair text-sm font-bold text-white">{tmpl.name}</h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{tmpl.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 3: Nombres, Fecha, Hora y Lugar */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 3 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    Datos del Evento y Anfitriones
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Los datos que se mostrarán en la portada y en los botones de calendario.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Título Principal de la Invitación
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Boda de Sofía & Mateo"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Encabezado / Kicker
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Ej. Nuestra Boda / Mis XV Años"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Nombres de los Festejados o Anfitriones *
                      </label>
                      <input
                        type="text"
                        value={hostNames}
                        onChange={(e) => setHostNames(e.target.value)}
                        placeholder="Ej. Sofía Valenzuela & Mateo Arismendi"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Fecha del Evento
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Hora del Evento
                      </label>
                      <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Nombre del Recinto / Hacienda / Salón
                    </label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="Ej. Hacienda San José de las Palmas"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Dirección Completa (Para Google Maps y Waze)
                    </label>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="Ej. Carretera Real del Monte Km 14.5, Valle Central"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-300 mb-1">
                      Mención de Padres / Padrinos (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={parentsNames}
                      onChange={(e) => setParentsNames(e.target.value)}
                      placeholder="Ej. Con la bendición de nuestros padres: Roberto y Claudia..."
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 4: Subir Fotografías Directamente a la App */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 4 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    Fotografías de Portada y Galería
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Sube tus fotos directamente desde tu teléfono, tableta o computadora. No requieres enlaces externos: se optimizan y guardan de inmediato en la aplicación.
                  </p>
                </div>

                {/* 1. SECCIÓN: FOTO DE PORTADA */}
                <div className="space-y-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                        1. Fotografía de Portada de la Invitación
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Esta imagen se presentará en la cubierta del libro o portada principal de tu evento.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      disabled={isUploadingCover}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploadingCover ? 'Procesando...' : 'Subir desde mi Dispositivo'}</span>
                    </button>
                  </div>

                  {/* Hidden cover file input */}
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />

                  {/* Drag and Drop Zone or Current Preview */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setCoverDragOver(true);
                    }}
                    onDragLeave={() => setCoverDragOver(false)}
                    onDrop={handleCoverDrop}
                    className={`relative rounded-xl border-2 border-dashed p-4 transition-all ${
                      coverDragOver
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* Active cover photo thumbnail */}
                      <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-xl bg-neutral-950 shrink-0">
                        <img
                          src={coverImage}
                          alt="Portada seleccionada"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1 right-1 rounded-full bg-amber-500 p-1 text-neutral-950">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>

                      {/* Info & action buttons */}
                      <div className="space-y-3 text-center sm:text-left flex-1">
                        <div>
                          <span className="inline-block rounded-md bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                            Portada Activa
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-200 mt-1">
                            Foto Principal Lista
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Puedes arrastrar aquí cualquier foto desde tus archivos o hacer clic en el botón para reemplazarla.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            onClick={() => coverFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700 hover:text-white"
                          >
                            <RefreshCw className="h-3 w-3 text-amber-400" />
                            <span>Cambiar por otra foto</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Curated Sample Images Option */}
                  <div className="pt-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-2">
                      O selecciona una de nuestras portadas de muestra:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {CURATED_SAMPLE_IMAGES.map((img, idx) => {
                        const isCover = coverImage === img.url;
                        return (
                          <div
                            key={idx}
                            onClick={() => setCoverImage(img.url)}
                            className={`group relative aspect-[3/4] rounded-xl overflow-hidden border cursor-pointer transition-all ${
                              isCover
                                ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                                : 'border-neutral-800 opacity-75 hover:opacity-100 hover:border-neutral-700'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.label}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] text-white leading-tight line-clamp-1">{img.label}</span>
                            </div>
                            {isCover && (
                              <div className="absolute top-1.5 right-1.5 rounded-full bg-amber-500 p-1 text-neutral-950">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. SECCIÓN: ÁLBUM Y GALERÍA (MÚLTIPLES FOTOS) */}
                <div className="space-y-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                        2. Álbum Fotográfico & Presentación Deslizable
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Sube las fotos de tu sesión o momentos especiales. Tus invitados podrán deslizarlas interactivamente en el libro.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={isUploadingGallery}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/50 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-300 hover:bg-amber-500 hover:text-neutral-950 transition-colors shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isUploadingGallery ? 'Cargando fotos...' : 'Subir Fotos al Álbum'}</span>
                    </button>
                  </div>

                  {/* Hidden gallery file input with multiple support */}
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilesUpload}
                    className="hidden"
                  />

                  {/* Drag and Drop Zone for multiple photos */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setGalleryDragOver(true);
                    }}
                    onDragLeave={() => setGalleryDragOver(false)}
                    onDrop={handleGalleryDrop}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                      galleryDragOver
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-neutral-800 bg-neutral-900/40 hover:border-amber-400/40 hover:bg-neutral-900/70'
                    }`}
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-amber-400 mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-200">
                      Toca o arrastra aquí varias fotos a la vez
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Soporta JPG, PNG y WEBP. Se comprimen de forma automática para máxima velocidad.
                    </p>
                  </div>

                  {/* Gallery Photos Grid */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono">
                        Fotos en la galería: <strong className="text-amber-400">{galleryImages.length}</strong>
                      </span>
                      {galleryImages.length > 0 && (
                        <span className="text-[11px] text-neutral-500">
                          Toca ★ para convertir cualquier foto en portada
                        </span>
                      )}
                    </div>

                    {galleryImages.length === 0 ? (
                      <div className="p-6 text-center rounded-xl border border-neutral-800 text-xs text-neutral-500">
                        Aún no has agregado fotos a la galería. Sube tus primeras fotos arriba.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {galleryImages.map((img, idx) => {
                          const isCurrentCover = coverImage === img;
                          return (
                            <div
                              key={idx}
                              className={`group relative aspect-[3/4] rounded-xl overflow-hidden border bg-neutral-950 transition-all ${
                                isCurrentCover ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-neutral-800 hover:border-neutral-700'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Foto ${idx + 1}`}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />

                              {/* Cover badge if active */}
                              {isCurrentCover && (
                                <div className="absolute top-1.5 left-1.5 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-950 shadow">
                                  Portada
                                </div>
                              )}

                              {/* Hover Action Buttons */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveGalleryImage(idx);
                                    }}
                                    className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 shadow"
                                    title="Eliminar foto de la galería"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetImageAsCover(img);
                                  }}
                                  className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow ${
                                    isCurrentCover
                                      ? 'bg-amber-500 text-neutral-950'
                                      : 'bg-neutral-900/90 text-amber-300 hover:bg-amber-500 hover:text-neutral-950'
                                  }`}
                                >
                                  <Star className="h-3 w-3 fill-current" />
                                  <span>{isCurrentCover ? 'Es la Portada' : 'Hacer Portada'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. SECCIÓN SECUNDARIA: ENLACE URL EXTERNO (OPCIONAL) */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <details className="group">
                    <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors list-none flex items-center justify-between">
                      <span>¿Prefieres ingresar una URL externa de imagen? (Opcional)</span>
                      <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/mi-sesion-fotos.jpg"
                        className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customImageUrl.trim()) {
                            setCoverImage(customImageUrl.trim());
                            setGalleryImages([...galleryImages, customImageUrl.trim()]);
                            setCustomImageUrl('');
                          }
                        }}
                        className="rounded-xl bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
                      >
                        Agregar
                      </button>
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 5: Colores y Tipografías */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 5 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 5 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    Estilo Visual & Tipografía
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Elige la personalidad tipográfica y la paleta de acentos de tu invitación.
                  </p>
                </div>

                <div className="space-y-6 text-xs">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-3">
                      Familia Tipográfica para Títulos
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'Cinzel', label: 'Cinzel', desc: 'Imperial, clásica y mayúscula' },
                        { id: 'Playfair Display', label: 'Playfair Display', desc: 'Elegancia editorial de alta costura' },
                        { id: 'Cormorant Garamond', label: 'Cormorant Garamond', desc: 'Romántica, delicada e itálica' },
                        { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', desc: 'Moderna, geométrica y limpia' },
                      ].map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setFontHeading(font.id as any)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            fontHeading === font.id
                              ? 'border-amber-400 bg-amber-500/10 text-white shadow-sm'
                              : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <span
                            className="text-lg font-bold block"
                            style={{ fontFamily: font.id }}
                          >
                            {font.label}
                          </span>
                          <span className="text-[11px] text-neutral-400 mt-1 block">{font.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-3">
                      Color de Acento Principal
                    </label>
                    <div className="flex items-center gap-3">
                      {[
                        { color: '#d4af37', label: 'Oro Real' },
                        { color: '#059669', label: 'Verde Esmeralda' },
                        { color: '#e11d48', label: 'Rosa Champagne' },
                        { color: '#0284c7', label: 'Azul Real' },
                        { color: '#9333ea', label: 'Lavanda' },
                        { color: '#ea580c', label: 'Terracota' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          onClick={() => setPrimaryColor(c.color)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                            primaryColor === c.color ? 'border-white bg-neutral-800' : 'border-transparent'
                          }`}
                        >
                          <div
                            className="h-8 w-8 rounded-full border border-neutral-700 shadow"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="text-[10px] text-neutral-400">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 6: Música, Animaciones y Efectos */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 6 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 6 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    Música Ambiental & Animación de Apertura
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Elige cómo se presenta la invitación al interactuar por primera vez.
                  </p>
                </div>

                <div className="space-y-8 text-xs">
                  {/* 1. SELECCIÓN DE PROPUESTAS DE BOTÓN 'TIENES UNA INVITACIÓN' (12 DISEÑOS) */}
                  <EntranceButtonSelector
                    selectedDesign={entranceButtonDesign}
                    onSelectDesign={(design) => setEntranceButtonDesign(design)}
                    buttonText={entranceButtonText}
                    onChangeButtonText={(t) => setEntranceButtonText(t)}
                  />

                  {/* 2. Opening envelope animation */}
                  <div className="pt-6 border-t border-neutral-800">
                    <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-3">
                      Animación de Apertura
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {[
                        { id: 'wax_seal', label: 'Sello de Cera', desc: 'Monograma heráldico' },
                        { id: 'royal_curtain', label: 'Cortina Real', desc: 'Apertura de teatro' },
                        { id: 'ribbon_box', label: 'Lazo de Regalo', desc: 'Desempaque festivo' },
                        { id: 'minimalist_fold', label: 'Pliegue Minimal', desc: 'Despliegue sobrio' },
                        { id: 'book_open', label: 'Libro 3D', desc: 'Páginas que se pasan' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setEnvelopeAnimation(item.id as EnvelopeAnimationType)}
                          className={`p-3.5 rounded-xl border text-center transition-all ${
                            envelopeAnimation === item.id
                              ? 'border-amber-400 bg-amber-500/10 text-white font-semibold'
                              : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span className="block text-xs">{item.label}</span>
                          <span className="block text-[10px] text-neutral-500 mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Book Cover Style selector when 3D book animation or template is active */}
                    {(envelopeAnimation === 'book_open' || style === 'premium_book') && (
                      <div className="mt-4 pt-4 border-t border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block font-semibold uppercase tracking-wider text-amber-400">
                            Estilo de Encuadernación / Portada del Libro
                          </label>
                          <span className="text-[11px] text-amber-300 font-mono">Exclusivo Libro 3D</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'luxury_linen', label: 'Lino de Lujo & Oro', desc: 'Textura azul marino profundo con grabados dorados' },
                            { id: 'romantic', label: 'Romántico & Flores', desc: 'Tonos rosa empolvado y filigranas botánicas' },
                            { id: 'vintage', label: 'Vintage Clásico', desc: 'Cuero envejecido, orlas renacentistas y pátina de época' },
                            { id: 'editorial', label: 'Editorial Fine Art', desc: 'Diseño sobrio de galería, tipografía de alta costura' },
                            { id: 'minimalist', label: 'Minimalista Contemporáneo', desc: 'Líneas limpias marfil, relieve sutil en seco' },
                            { id: 'modern', label: 'Moderno Glam', desc: 'Negro mate con acentos metalizados vanguardistas' },
                          ].map((cStyle) => (
                            <button
                              key={cStyle.id}
                              type="button"
                              onClick={() => setBookCoverStyle(cStyle.id as any)}
                              className={`p-3.5 rounded-xl border text-left transition-all ${
                                bookCoverStyle === cStyle.id
                                  ? 'border-amber-400 bg-amber-500/15 text-white shadow-md shadow-amber-500/10'
                                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700'
                              }`}
                            >
                              <span className="block text-xs font-semibold text-neutral-100">{cStyle.label}</span>
                              <span className="block text-[10px] text-neutral-400 mt-1 leading-snug">{cStyle.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Soundtracks */}
                  <div className="pt-4 border-t border-neutral-800">
                    <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-3">
                      Banda Sonora de Fondo
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'wedding_canon', label: 'Canon Nupcial Romántico', desc: 'Arpegios suaves de piano y cuerdas' },
                        { id: 'quince_waltz', label: 'Vals de Quinceañera', desc: 'Ritmo ternario elegante de baile' },
                        { id: 'kids_cheerful', label: 'Melodía Feliz & Aventura', desc: 'Campanas y xilófono juguetón' },
                        { id: 'acoustic_romance', label: 'Acústica Suave', desc: 'Guitarra ambiental y serenata' },
                        { id: 'none', label: 'Sin Música', desc: 'Experiencia silenciosa' },
                      ].map((track) => (
                        <button
                          key={track.id}
                          onClick={() => setMusicTrackId(track.id as any)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            musicTrackId === track.id
                              ? 'border-amber-400 bg-amber-500/10 text-white'
                              : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-xs block text-neutral-100">{track.label}</span>
                            <span className="text-[11px] text-neutral-500">{track.desc}</span>
                          </div>
                          {musicTrackId === track.id && <Check className="h-4 w-4 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Particles */}
                  <div className="pt-4 border-t border-neutral-800">
                    <label className="block font-semibold uppercase tracking-wider text-amber-400 mb-3">
                      Efectos Visuales Flotantes
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'petals', label: 'Pétalos de Rosa' },
                        { id: 'sparkles', label: 'Destellos Dorados' },
                        { id: 'confetti', label: 'Confeti Festivo' },
                        { id: 'none', label: 'Desactivado' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setParticlesEffect(p.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            particlesEffect === p.id
                              ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                              : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                          }`}
                        >
                          <span className="text-xs">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 7: Itinerario y Código de Vestimenta */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 7 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 7 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    Itinerario y Código de Vestimenta
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Orienta a tus invitados sobre los momentos clave y la vestimenta adecuada.
                  </p>
                </div>

                <div className="space-y-6 text-xs">
                  {/* Dress code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Código de Vestimenta Principal
                      </label>
                      <input
                        type="text"
                        value={dressCode}
                        onChange={(e) => setDressCode(e.target.value)}
                        placeholder="Ej. Rigurosa Etiqueta / Black Tie"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-300 mb-1">
                        Detalles o Colores Reservados
                      </label>
                      <input
                        type="text"
                        value={dressCodeDetails}
                        onChange={(e) => setDressCodeDetails(e.target.value)}
                        placeholder="Ej. Caballeros con esmoquin. El color blanco se reserva a la novia."
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Itinerary points */}
                  <div className="pt-4 border-t border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider text-amber-400">
                        Puntos del Itinerario
                      </span>
                      <button
                        onClick={handleAddItineraryItem}
                        className="flex items-center gap-1 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-amber-300 hover:bg-neutral-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Agregar Momento</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {itinerary.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3"
                        >
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => {
                              const copy = [...itinerary];
                              copy[idx].time = e.target.value;
                              setItinerary(copy);
                            }}
                            className="w-20 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs font-mono text-amber-400"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const copy = [...itinerary];
                              copy[idx].title = e.target.value;
                              setItinerary(copy);
                            }}
                            placeholder="Título"
                            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleRemoveItineraryItem(idx)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 8: Confirmación de Asistencia & Mesa de Regalos */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 8 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Paso 8 de 9</span>
                  <h2 className="font-playfair text-2xl font-bold text-neutral-100 mt-1">
                    RSVP y Mesa de Regalos
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Configura el formulario para recibir confirmaciones y tus datos para regalos.
                  </p>
                </div>

                <div className="space-y-6 text-xs">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900">
                    <div>
                      <span className="font-semibold text-white block">Habilitar Formulario de RSVP</span>
                      <span className="text-neutral-400 text-[11px]">Permite a los invitados confirmar acompañantes y dietas</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={rsvpEnabled}
                      onChange={(e) => setRsvpEnabled(e.target.checked)}
                      className="h-5 w-5 accent-amber-500 rounded"
                    />
                  </div>

                  {rsvpEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-neutral-300 mb-1">
                          Fecha Límite para Confirmar
                        </label>
                        <input
                          type="date"
                          value={rsvpDeadline}
                          onChange={(e) => setRsvpDeadline(e.target.value)}
                          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-neutral-300 mb-1">
                          Número de WhatsApp para Notificaciones
                        </label>
                        <input
                          type="tel"
                          value={rsvpWhatsAppPhone}
                          onChange={(e) => setRsvpWhatsAppPhone(e.target.value)}
                          placeholder="+52 55 1234 5678"
                          className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gift options */}
                  <div className="pt-4 border-t border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider text-amber-400">
                        Opciones de Mesa de Regalos / Datos Bancarios
                      </span>
                      <button
                        onClick={handleAddGift}
                        className="flex items-center gap-1 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-amber-300 hover:bg-neutral-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Agregar Opción</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {giftRegistries.map((gift, gIdx) => (
                        <div
                          key={gIdx}
                          className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3"
                        >
                          <input
                            type="text"
                            value={gift.title}
                            onChange={(e) => {
                              const copy = [...giftRegistries];
                              copy[gIdx].title = e.target.value;
                              setGiftRegistries(copy);
                            }}
                            placeholder="Título (ej. Liverpool, BBVA)"
                            className="w-32 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={gift.detail}
                            onChange={(e) => {
                              const copy = [...giftRegistries];
                              copy[gIdx].detail = e.target.value;
                              setGiftRegistries(copy);
                            }}
                            placeholder="Detalle o CLABE"
                            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleRemoveGift(gIdx)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* PASO 9: Publicación y Enlace Compartible */}
            {/* ------------------------------------------------------------- */}
            {currentStep === 9 && (
              <div className="rounded-2xl border border-amber-500/40 bg-neutral-900/90 p-6 sm:p-8 space-y-8 shadow-2xl">
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">¡Todo Listo!</span>
                  <h2 className="font-playfair text-3xl font-bold text-neutral-100">
                    Tu Invitación Ha Sido Publicada
                  </h2>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto">
                    Ya puedes compartir tu enlace por WhatsApp o descargar tu código QR para imprimirlo en recuerdos y papelería.
                  </p>
                </div>

                {/* Share Link Box */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                    Enlace Único de la Invitación
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-amber-300 font-mono select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow"
                    >
                      {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `¡Hola! Te comparto con mucho cariño nuestra invitación digital interactiva: ${shareUrl}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Compartir en WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onFinish(publishedData || currentPreviewData)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 py-3 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Ver Invitación en Vivo</span>
                    </button>
                  </div>
                </div>

                {/* Personalized Guest Link Generator with Passes */}
                <div className="rounded-2xl border border-amber-500/30 bg-neutral-950 p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                      Generador de Enlaces Personalizados con Pases de Honor
                    </span>
                    <p className="text-xs text-neutral-400">
                      Crea un enlace único con el nombre de cada familia o invitado. Al abrirlo, verán su saludo exclusivo y su límite exacto de pases para el RSVP.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-neutral-400 mb-1">Nombre o Familia del Invitado</label>
                      <input
                        type="text"
                        value={guestLinkName}
                        onChange={(e) => setGuestLinkName(e.target.value)}
                        placeholder="Ej. Familia Morales Fuentes o Lic. Carlos Arismendi"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Pases Asignados</label>
                      <select
                        value={guestLinkPasses}
                        onChange={(e) => setGuestLinkPasses(parseInt(e.target.value, 10))}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Pase de honor' : 'Pases de honor'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Generated Personalized Link Result */}
                  {guestLinkName.trim() && (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-200 font-semibold truncate">
                          Invitación para: <span className="text-amber-300 font-bold">{guestLinkName.trim()}</span> ({guestLinkPasses} {guestLinkPasses === 1 ? 'pase' : 'pases'})
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`${shareUrl}?guest=${encodeURIComponent(guestLinkName.trim())}&pases=${guestLinkPasses}`}
                          className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-mono text-amber-300"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const url = `${shareUrl}?guest=${encodeURIComponent(guestLinkName.trim())}&pases=${guestLinkPasses}`;
                            navigator.clipboard.writeText(url);
                            setCopiedGuestLink(true);
                            setTimeout(() => setCopiedGuestLink(false), 2000);
                          }}
                          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400 transition-colors shadow flex items-center justify-center gap-1.5"
                        >
                          {copiedGuestLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedGuestLink ? 'Copiado' : 'Copiar'}</span>
                        </button>

                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `¡Hola ${guestLinkName.trim()}! Con muchísimo cariño te compartimos tu invitación exclusiva para nuestra celebración (${guestLinkPasses} ${guestLinkPasses === 1 ? 'pase reservado' : 'pases reservados'}): ${shareUrl}?guest=${encodeURIComponent(guestLinkName.trim())}&pases=${guestLinkPasses} \n\n¡Esperamos contar con tu grata presencia!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Enviar WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Code Printable Section */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-3 bg-white rounded-2xl shadow-lg shrink-0">
                    <img src={qrSvgUri} alt="Código QR" className="h-32 w-32 object-contain" />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="font-playfair text-lg font-bold text-white">
                      Código QR para Impresión
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Llévalo a tu imprenta para que lo agreguen en tus sobres físicos, invitaciones de papel o tarjetas de agradecimiento.
                    </p>
                    <a
                      href={qrSvgUri}
                      download={`QR_${currentPreviewData.slug}.svg`}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:text-amber-300 pt-1"
                    >
                      <span>Descargar archivo vectorial SVG</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* RIGHT: Real-time Live Preview Device */}
          {(activeEditorTab === 'preview' || activeEditorTab === 'split') && (
            <div className={`${activeEditorTab === 'split' ? 'lg:col-span-5 sticky top-24' : 'max-w-4xl mx-auto w-full'} space-y-4`}>
              {/* Back to form banner when in single preview tab */}
              {activeEditorTab === 'preview' && (
                <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-amber-300 font-medium">
                      Vista previa interactiva en tiempo real (Paso {currentStep} de 9)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('form')}
                    className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 shadow"
                  >
                    <span>Volver a Editar</span>
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </button>
                </div>
              )}

              <EditorLivePreview
                invitation={currentPreviewData}
                defaultDevice={previewDevice}
                onUpdateEntranceDesign={(design) => setEntranceButtonDesign(design)}
                onUpdateEntranceText={(text) => setEntranceButtonText(text)}
              />
            </div>
          )}

        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) to quickly preview invitation anytime */}
      {activeEditorTab !== 'preview' && (
        <button
          type="button"
          onClick={() => {
            setActiveEditorTab('preview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all border border-amber-300/40"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-950 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-950" />
          </span>
          <Eye className="h-4 w-4" />
          <span>Ver Previa en Vivo</span>
        </button>
      )}
    </div>
  );
};
