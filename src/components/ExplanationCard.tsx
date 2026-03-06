
import React from 'react';
import { PersonalityTrait, TraitExplanationContent } from '../types';
import { TRAIT_COLORS_TAILWIND } from '../constants';

interface ExplanationCardProps {
  trait: PersonalityTrait;
  content?: TraitExplanationContent;
  isLoading: boolean;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ trait, content, isLoading }) => {
  const bgColor = TRAIT_COLORS_TAILWIND[trait] || 'bg-slate-500';

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className={`px-5 py-4 ${bgColor}`}>
        <h4 className="text-lg font-bold text-white">{trait}</h4>
      </div>
      <div className="p-5 space-y-4">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          </div>
        ) : content ? (
          <>
            <Section label="מה זה אומר?" text={content.explanation} />
            <Section label="רלוונטיות לרפואה" text={content.medicalRelevance} />
            <Section label="עצה" text={content.advice} />
          </>
        ) : (
          <p className="text-sm text-slate-400">לא נטענו הסברים עבור תכונה זו.</p>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div>
    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</h5>
    <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
  </div>
);

export default ExplanationCard;
