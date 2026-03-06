
import React, { useState, useEffect } from 'react';
import { ItemPair as ItemPairType, UserChoice, PersonalityTrait } from '../types';
import ItemPair from './ItemPair';


interface SimulationScreenProps {
  items: ItemPairType[];
  onSubmit: (choices: UserChoice[]) => void;
}

const SimulationScreen: React.FC<SimulationScreenProps> = ({ items, onSubmit }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalItems = items.length;

  useEffect(() => {
    // Reset choices if items change (e.g., new simulation started)
    setUserChoices([]);
    setCurrentItemIndex(0);
  }, [items]);

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
        onSubmit([...userChoices, { pairId: currentPair.id, chosenStatementId, chosenTrait }]);
      }
      setIsTransitioning(false);
    }, 300); // Short delay for visual feedback or transition
  };

  if (totalItems === 0) {
    return <p className="text-center text-slate-700 p-8">לא נטענו שאלות לסימולציה.</p>;
  }

  const currentPair = items[currentItemIndex];

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-3xl bg-slate-50 p-6 sm:p-10 rounded-xl shadow-2xl">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-sky-700">
            שאלה {currentItemIndex + 1} מתוך {totalItems}
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3">
            <div
              className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentItemIndex + 1) / totalItems) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <ItemPair
            statementA={currentPair.statementA}
            statementB={currentPair.statementB}
            onSelect={handleSelect}
            disabled={isTransitioning}
          />
        </div>

        {/* Note: No back/skip buttons as per requirements */}
        <p className="text-xs text-slate-500 mt-8 text-center">
          בחר את המשפט המתאר אותך טוב יותר. לא ניתן לחזור אחורה או לדלג.
        </p>
      </div>
    </div>
  );
};

export default SimulationScreen;
