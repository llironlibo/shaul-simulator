
import React from 'react';
import { Statement, PersonalityTrait } from '../types';

interface ItemPairProps {
  statementA: Statement;
  statementB: Statement;
  onSelect: (chosenStatementId: string, chosenTrait: PersonalityTrait) => void;
  disabled?: boolean;
}

const ChoiceCard: React.FC<{
  statement: Statement;
  onSelect: () => void;
  disabled?: boolean;
  label: string;
}> = ({ statement, onSelect, disabled, label }) => (
  <button
    type="button"
    onClick={onSelect}
    disabled={disabled}
    className={`w-full text-right p-5 sm:p-6 rounded-xl border-2 transition-all duration-200
      ${disabled
        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
        : 'bg-white border-slate-200 hover:border-brand-400 hover:shadow-md hover:bg-brand-50/30 active:scale-[0.98] cursor-pointer'
      }`}
    aria-label={`${label}: ${statement.text}`}
  >
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    <p className="text-lg text-slate-800 mt-1 leading-relaxed">{statement.text}</p>
  </button>
);

const ItemPair: React.FC<ItemPairProps> = ({ statementA, statementB, onSelect, disabled }) => {
  return (
    <div className="space-y-4 w-full">
      <p className="text-base text-slate-500 font-medium text-center mb-2">
        בחר את המשפט שמתאר אותך טוב יותר:
      </p>
      <ChoiceCard
        statement={statementA}
        onSelect={() => !disabled && onSelect(statementA.id, statementA.trait)}
        disabled={disabled}
        label="א"
      />
      <div className="flex items-center gap-3 px-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-sm text-slate-400 font-medium">או</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <ChoiceCard
        statement={statementB}
        onSelect={() => !disabled && onSelect(statementB.id, statementB.trait)}
        disabled={disabled}
        label="ב"
      />
    </div>
  );
};

export default ItemPair;
