// src/components/CardDisplay.tsx
import React from 'react';
import { getAssetUrl } from '../utils/assetLoader';

interface CardDisplayProps {
  cardName: string;
  characterClass: 'ironclad' | 'silent' | 'defect' | 'watcher' | 'colourless' | 'curses';
  isUpgraded?: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ 
  cardName, 
  characterClass,
  isUpgraded = false
}) => {
  // Append '+' to the name if the card is upgraded to match your file naming convention
  const exactName = isUpgraded ? `${cardName}+` : cardName;
  
  const imageSrc = getAssetUrl(characterClass, exactName);

  if (!imageSrc) {
    return (
      <div className="fallback-card">
        <p>Asset missing: {exactName}</p>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={exactName} 
      className="w-48 h-auto rounded-lg shadow-md hover:scale-105 transition-transform" 
    />
  );
};