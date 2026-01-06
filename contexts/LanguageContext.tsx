
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'es' | 'de';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.courses': 'Formations',
    'nav.news': 'Actualités',
    'nav.community': 'Communauté',
    'nav.live': 'Direct',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Mon Espace',
    'nav.studio': 'Studio Vendeur',
    'nav.admin': 'Super Admin',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',
    'nav.youtube': 'YouTube',
    'lang.select': 'Langue',
    'hero.badge': 'Leadership & Excellence',
    'hero.title': 'L\'Art de l\'Excellence et du Leadership',
    'hero.desc': 'Accédez aux stratégies exclusives de Kadjolo Basile pour transformer votre vision en succès tangible. Mentorat, formations et communauté d\'élite.',
    'hero.cta.primary': 'Découvrir les programmes',
    'hero.cta.secondary': 'Rejoindre la communauté',
    'stats.members': 'Membres',
    'stats.programs': 'Programmes',
    'stats.success': 'Succès',
    'stats.countries': 'Pays',
    'studio.visit_shop': 'Visiter ma boutique',
    'studio.share_shop': 'Partager ma boutique',
    'studio.copy_link': 'Copier le lien',
    'studio.link_copied': 'Lien copié !',
    'studio.share_wa': 'WhatsApp',
    'studio.share_fb': 'Facebook',
    'studio.share_li': 'LinkedIn',
    'studio.share_tg': 'Telegram',
    'studio.share_tw': 'Twitter',
    'studio.denied': 'ACCÈS RÉSERVÉ',
    'studio.tab.home': 'Tableau de bord',
    'studio.tab.sales': 'Ventes',
    'studio.tab.products': 'Produits',
    'studio.tab.customers': 'Clients',
    'studio.tab.revenue': 'Revenus',
    'studio.tab.analytics': 'Analytiques',
    'studio.tab.reviews': 'Avis',
    'studio.tab.marketing': 'Marketing',
    'studio.tab.automation': 'Automatisations',
    'studio.tab.settings': 'Paramètres',
    'studio.home.balance': 'Solde disponible',
    'studio.home.sales_30d': 'Ventes (30 jours)',
    'studio.home.new_clients': 'Nouveaux clients',
    'studio.home.performance': 'Performance commerciale',
    'studio.search': 'Rechercher...',
    'studio.new_product': 'Nouveau Produit',
    'btn.save': 'Enregistrer',
    'btn.cancel': 'Annuler',
    'btn.edit': 'Modifier',
    'common.loading': 'Chargement...',
    'common.back': 'Retour'
  },
  en: {
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.news': 'News',
    'nav.community': 'Community',
    'nav.live': 'Live',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.dashboard': 'My Space',
    'nav.studio': 'Seller Studio',
    'nav.admin': 'Super Admin',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.youtube': 'YouTube',
    'lang.select': 'Language',
    'hero.badge': 'Leadership & Excellence',
    'hero.title': 'The Art of Excellence and Leadership',
    'hero.desc': 'Access exclusive strategies from Kadjolo Basile to turn your vision into tangible success. Mentorship, courses, and elite community.',
    'hero.cta.primary': 'Discover programs',
    'hero.cta.secondary': 'Join community',
    'stats.members': 'Members',
    'stats.programs': 'Programs',
    'stats.success': 'Success',
    'stats.countries': 'Countries',
    'studio.visit_shop': 'Visit my store',
    'studio.share_shop': 'Share my shop',
    'studio.copy_link': 'Copy link',
    'studio.link_copied': 'Link copied!',
    'studio.share_wa': 'WhatsApp',
    'studio.share_fb': 'Facebook',
    'studio.share_li': 'LinkedIn',
    'studio.share_tg': 'Telegram',
    'studio.share_tw': 'Twitter',
    'studio.denied': 'ACCESS RESTRICTED',
    'studio.tab.home': 'Dashboard',
    'studio.tab.sales': 'Sales',
    'studio.tab.products': 'Products',
    'studio.tab.customers': 'Customers',
    'studio.tab.revenue': 'Revenue',
    'studio.tab.analytics': 'Analytics',
    'studio.tab.reviews': 'Reviews',
    'studio.tab.marketing': 'Marketing',
    'studio.tab.automation': 'Automations',
    'studio.tab.settings': 'Settings',
    'studio.home.balance': 'Available Balance',
    'studio.home.sales_30d': 'Sales (30 days)',
    'studio.home.new_clients': 'New Clients',
    'studio.home.performance': 'Sales Performance',
    'studio.search': 'Search...',
    'studio.new_product': 'New Product',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.back': 'Back'
  },
  es: {
    'nav.home': 'Inicio',
    'hero.title': 'El Arte de la Excelencia y el Liderazgo',
    'studio.visit_shop': 'Visitar mi tienda',
    'studio.share_shop': 'Compartir mi tienda',
    'studio.copy_link': 'Copiar enlace',
    'studio.tab.home': 'Tablero',
    'btn.save': 'Guardar',
    'common.loading': 'Cargando...'
  },
  de: {
    'nav.home': 'Startseite',
    'hero.title': 'Die Kunst der Exzellenz und Führung',
    'studio.visit_shop': 'Meinen Shop besuchen',
    'studio.share_shop': 'Meinen Shop teilen',
    'studio.copy_link': 'Link kopieren',
    'studio.tab.home': 'Übersicht',
    'btn.save': 'Speichern',
    'common.loading': 'Laden...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kadjolo_lang') as Language;
    return saved || 'fr';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('kadjolo_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        translation = translation.replace(`{${k}}`, v);
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
