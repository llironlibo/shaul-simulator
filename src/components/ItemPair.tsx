
import React from 'react';
import { Statement, PersonalityTrait } from '../types'; // Added PersonalityTrait

interface ItemPairProps {
  statementA: Statement;
  statementB: Statement;
  onSelect: (chosenStatementId: string, chosenTrait: PersonalityTrait) => void;
  disabled?: boolean;
}

const ItemPair: React.FC<ItemPairProps> = ({ statementA, statementB, onSelect, disabled }) => {
  const handleSelect = (statement: Statement) => {
    if (!disabled) {
      onSelect(statement.id, statement.trait);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <p className="text-lg text-slate-700 font-medium mb-4 text-center">בחר את המשפט המתאר אותך טוב יותר:</p>
      <div
        className={`p-6 border-2 rounded-xl shadow-lg cursor-pointer transition-all duration-200 ease-in-out 
                    ${disabled ? 'bg-slate-100 opacity-70 cursor-not-allowed' : 'bg-white hover:border-blue-500 hover:shadow-blue-200 hover:shadow-md'}`}
        onClick={() => handleSelect(statementA)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`בחר: ${statementA.text}`}
      >
        <p className="text-xl text-slate-800">{statementA.text}</p>
      </div>
      <div className="text-center text-slate-500 font-semibold my-2">או</div>
      <div
        className={`p-6 border-2 rounded-xl shadow-lg cursor-pointer transition-all duration-200 ease-in-out 
                   ${disabled ? 'bg-slate-100 opacity-70 cursor-not-allowed' : 'bg-white hover:border-blue-500 hover:shadow-blue-200 hover:shadow-md'}`}
        onClick={() => handleSelect(statementB)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`בחר: ${statementB.text}`}
      >
        <p className="text-xl text-slate-800">{statementB.text}</p>
      </div>
    </div>
  );
};

export default ItemPair;
