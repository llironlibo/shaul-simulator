
import { ItemPair } from '../types';
import { allPairs } from './configService';

// All pairs are loaded from questions.json via configService
export const SIMULATION_ITEMS: ItemPair[] = allPairs;

// Fisher-Yates shuffle for unbiased randomization
export const getShuffledItems = (): ItemPair[] => {
  const arr = [...SIMULATION_ITEMS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
