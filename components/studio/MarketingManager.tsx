
import React, { useState } from 'react';
import MarketingHome from './marketing/MarketingHome';
import DiscountsSection from './marketing/DiscountsSection';
import CampaignsSection from './marketing/CampaignsSection';
import PopupsSection from './marketing/PopupsSection';
import BannersSection from './marketing/BannersSection';

type MarketingSubView = 'home' | 'discounts' | 'popups' | 'banners' | 'campaigns';

const MarketingManager: React.FC = () => {
  const [activeView, setActiveView] = useState<MarketingSubView>('home');

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <MarketingHome onNavigate={setActiveView} />;
      case 'discounts':
        return <DiscountsSection onBack={() => setActiveView('home')} />;
      case 'popups':
        return <PopupsSection onBack={() => setActiveView('home')} />;
      case 'banners':
        return <BannersSection onBack={() => setActiveView('home')} />;
      case 'campaigns':
        return <CampaignsSection onBack={() => setActiveView('home')} />;
      default:
        return <MarketingHome onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="pb-24 pt-4">
      {renderContent()}
    </div>
  );
};

export default MarketingManager;
