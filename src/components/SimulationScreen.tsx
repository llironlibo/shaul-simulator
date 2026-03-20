
import React, { useState, useEffect, useRef } from 'react';
import { ItemPair as ItemPairType, UserChoice, PersonalityTrait } from '../types';
import ItemPair from './ItemPair';

interface SimulationScreenProps {
  items: ItemPairType[];
  onSubmit: (choices: UserChoice[]) => void;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SimulationScreen: React.FC<SimulationScreenProps> = ({ items, onSubmit }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalItems = items.length;
  const estimatedMinutes = Math.max(3, Math.round(totalItems * 10 / 60));

  useEffect(() => {
    setUserChoices([]);
    setCurrentItemIndex(0);
    setShowIntro(true);
    setElapsedSeconds(0);
  }, [items]);

  // Start timer when intro is dismissed
  useEffect(() => {
    if (!showIntro && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showIntro]);

  const handleSelect = (chosenStatementId: string, chosenTrait: PersonalityTrait) => {
    setIsTransitioning(true);
    const currentPair = items[currentItemIndex];
    setUserChoices(prevChoices => [
      ...prevChoices,
      { pairId: currentPair.id, chosenStatementId, chosenTrait },
    ]);

    setTimeout(() => {
      if (currentItemIndex < totalItems - 1) {
        setCurrentItemIndex(prevIndex => prevIndex + 1);
      } else {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onSubmit([...userChoices, { pairId: currentPair.id, chosenStatementId, chosenTrait }]);
      }
      setIsTransitioning(false);
    }, 250);
  };

  if (totalItems === 0) {
    return <p className="text-center text-slate-600 p-8">...</p>;
  }

  if (showIntro) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">סימולציה של מבחן שאו"ל</h2>
          <p className="text-slate-600 mb-2">
            הסימולציה מכילה <strong>{totalItems} זוגות</strong> של משפטים.
          </p>
          <p className="text-slate-500 text-sm mb-4">
            בכל שלב יוצגו שני משפטים מתחומים שונים באישיות.
            בחר את המשפט שמתאר אותך טוב יותר — גם אם שניהם נכונים.
            אין תשובות נכונות או שגויות.
          </p>
          <div className="bg-brand-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-brand-700">
              זמן משוער: כ-{estimatedMinutes} דקות | לא ניתן לחזור אחורה | ענה לפי תחושת הבטן
            </p>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
          >
            התחל סימולציה
          </button>
        </div>
      </div>
    );
  }

  const currentPair = items[currentItemIndex];
  const progress = ((currentItemIndex) / totalItems) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-slate-500">
              שאלה {currentItemIndex + 1} מתוך {totalItems}
            </span>
            <span className="text-xs text-slate-400">
              {formatTime(elapsedSeconds)} | {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <ItemPair
              statementA={currentPair.statementA}
              statementB={currentPair.statementB}
              onSelect={handleSelect}
              disabled={isTransitioning}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          לא ניתן לחזור אחורה או לדלג
        </p>
      </div>
    </div>
  );
};

export default SimulationScreen;
