
import React from 'react';
import { EducationalTraitInfo } from '../types';
import { educationalContentData } from '../services/educationalContent';
import { TRAIT_COLORS_TAILWIND, BIG_FIVE_TRAITS } from '../constants';
import Button from './Button';

interface EducationalScreenProps {
  onBack: () => void;
}

const TraitCard: React.FC<{ traitInfo: EducationalTraitInfo }> = ({ traitInfo }) => {
  const bgColor = TRAIT_COLORS_TAILWIND[traitInfo.trait] || 'bg-slate-500';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className={`p-5 ${bgColor}`}>
        <h3 className="text-2xl font-bold text-white">{traitInfo.title}</h3>
      </div>
      <div className="p-6 space-y-4 flex-grow">
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-1">מהי התכונה?</h4>
          <p className="text-slate-600 text-sm leading-relaxed">{traitInfo.generalDescription}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-1">בהקשר הרפואי:</h4>
          <p className="text-slate-600 text-sm leading-relaxed">{traitInfo.medicalContext}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-1">נקודות למחשבה עצמית:</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm pl-4">
            {traitInfo.selfReflectionQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const EducationalScreen: React.FC<EducationalScreenProps> = ({ onBack }) => {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-sky-700">הכר את חמש תכונות האישיות הגדולות</h2>
        <p className="text-lg text-slate-600 mt-2 max-w-3xl mx-auto">
          מודל חמש התכונות הגדולות (Big Five) הוא אחד המודלים המקובלים והנחקרים ביותר בפסיכולוגיה לתיאור אישיות.
          הבנת התכונות הללו יכולה לעזור לך להבין טוב יותר את עצמך ואת האופן בו אתה עשוי להתאים לדרישות המקצוע הרפואי.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
        {BIG_FIVE_TRAITS.map(traitKey => {
            const traitInfo = educationalContentData[traitKey];
            return traitInfo ? <TraitCard key={traitKey} traitInfo={traitInfo} /> : null;
        })}
      </div>

      <div className="text-center mt-12">
        <Button onClick={onBack} size="lg" variant="secondary">
          חזור למסך הראשי
        </Button>
      </div>
    </div>
  );
};

export default EducationalScreen;
