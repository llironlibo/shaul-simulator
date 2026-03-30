
import { ItemPair, SimulationMode } from '../types';
import { getPoolConfig } from './configService';

const PAIRS_PER_MODE: Record<SimulationMode, number> = {
  [SimulationMode.Learning]: 30,
  [SimulationMode.Simulation]: 120,
};

// Fisher-Yates shuffle for unbiased randomization
function fisherYatesShuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function drawRandomPairs(mode: SimulationMode): ItemPair[] {
  const config = getPoolConfig(mode);
  const count = PAIRS_PER_MODE[mode];
  const shuffled = fisherYatesShuffle([...config.allPairs]);
  return shuffled.slice(0, count);
}
