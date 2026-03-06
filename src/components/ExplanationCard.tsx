
import React from 'react';
import { PersonalityTrait, TraitExplanationContent } from '../types';
import { TRAIT_COLORS_TAILWIND } from '../constants'; // Changed from TRAIT_COLORS

interface ExplanationCardProps {
  trait: PersonalityTrait;
  content?: TraitExplanationContent;
  isLoading: boolean;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ trait, content, isLoading }) => {
  const bgColor = TRAIT_COLORS_TAILWIND[trait] || 'bg-slate-500';
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className={`p-5 ${bgColor}`}>
        <h4 className="text-2xl font-bold text-white">{trait}</h4>
      </div>
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        ) : content ? (
          <>
            <div>
              <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">מה זה אומר?</h5>
              <p className="text-slate-700 mt-1">{content.explanation}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">רלוונטיות לרפואה</h5>
              <p className="text-slate-700 mt-1">{content.medicalRelevance}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">עצה/מחשבה</h5>
              <p className="text-slate-700 mt-1">{content.advice}</p>
            </div>
          </>
        ) : (
          <p className="text-slate-500">לא נטענו הסברים עבור תכונה זו.</p>
        )}
      </div>
    </div>
  );
};

export default ExplanationCard;
