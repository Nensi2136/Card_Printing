import React from 'react';
import { CardData } from '../types';

interface CardPreviewProps {
  cardData: CardData;
  className?: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData, className = '' }) => {
  const cardStyle = {
    backgroundColor: cardData.backgroundColor,
    backgroundImage: cardData.backgroundImage ? `url(${cardData.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: cardData.textColor,
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        id="business-card"
        className="w-96 h-56 rounded-lg shadow-xl p-6 flex flex-col justify-between relative overflow-hidden"
        style={cardStyle}
      >
        {/* Background overlay for better text readability when background image is present */}
        {cardData.backgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}
          />
        )}
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1">{cardData.businessName || 'Your Business Name'}</h2>
          <p className="text-sm opacity-90">{cardData.title || 'Your Title'}</p>
        </div>
        
        <div className="relative z-10">
          <div className="space-y-1 text-sm">
            <p className="font-medium">{cardData.userName || 'Your Name'}</p>
            <p>{cardData.email || 'your.email@example.com'}</p>
            <p>{cardData.phone || '+1 (555) 123-4567'}</p>
            <p>{cardData.website || 'www.yourwebsite.com'}</p>
            <p className="text-xs">{cardData.address || 'Your Business Address'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;