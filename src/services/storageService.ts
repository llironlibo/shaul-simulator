
import { StoredSimulationRun, PersonalityProfile, PersonalityTrait } from '../types';
import { BIG_FIVE_TRAITS, MIN_RUNS_FOR_DYNAMIC_AVERAGE } from '../constants';

const SIMULATION_RUNS_STORAGE_KEY_PREFIX = 'shaulSimulatorRuns';

const getStorageKey = (_userId?: string): string => {
  // If a userId is provided, simulation runs could be namespaced.
  // For now, let's keep it simple and global, but this structure allows future user-specific data.
  // To keep current functionality for average calculation (global), we'll use a general key for that.
  // If we want user-specific run lists, the key would change.
  // For this iteration, all runs are stored under one key as before for simplicity of average calculation.
  // If user-specific admin views are needed later, this can be refined.
  return SIMULATION_RUNS_STORAGE_KEY_PREFIX; 
};


/**
 * Retrieves all stored simulation runs from localStorage.
 * If a userId is provided, it could in the future filter runs, but for now, it returns all.
 * @param userId Optional user ID for potential future namespacing/filtering.
 * @returns An array of StoredSimulationRun objects, or an empty array if none are found or an error occurs.
 */
export const getAllSimulationRuns = (_userId?: string): StoredSimulationRun[] => {
  try {
    const storageKey = getStorageKey(); // Uses global key for now
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const runs = JSON.parse(storedData) as StoredSimulationRun[];
      // If userId was used for namespacing, filtering would happen here.
      // e.g., if runs were stored as { [userId]: StoredSimulationRun[] }
      // or if each run had a userId property.
      // For now, returning all runs.
      return runs;
    }
  } catch (error) {
    console.error("Error retrieving simulation runs from localStorage:", error);
  }
  return [];
};

/**
 * Saves a new simulation run to localStorage.
 * Adds the new run to the existing array of runs.
 * @param newRun The StoredSimulationRun object to save.
 * @param userId Optional user ID for potential future namespacing.
 */
export const saveSimulationRun = (newRun: StoredSimulationRun, _userId?: string): void => {
  try {
    const storageKey = getStorageKey(); // Uses global key for now
    const existingRuns = getAllSimulationRuns(); // Get all runs
    const updatedRuns = [...existingRuns, newRun];
    localStorage.setItem(storageKey, JSON.stringify(updatedRuns));
  } catch (error) {
    console.error("Error saving simulation run to localStorage:", error);
  }
};

/**
 * Clears all stored simulation runs from localStorage.
 * This is a global clear operation.
 */
export const clearAllSimulationRuns = (): void => {
  try {
    const storageKey = getStorageKey(); // Uses global key for now
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Error clearing simulation runs from localStorage:", error);
  }
};

export const generateRunId = (): string => {
  return `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Calculates the average personality profile from all stored simulation runs.
 * This calculation remains global across all users' runs.
 * If the number of stored runs is less than MIN_RUNS_FOR_DYNAMIC_AVERAGE,
 * it returns the provided fallbackProfile.
 * @param fallbackProfile The profile to return if not enough data is available.
 * @returns The calculated average PersonalityProfile or the fallbackProfile.
 */
export const calculateAverageProfileFromStoredRuns = (fallbackProfile: PersonalityProfile): PersonalityProfile => {
  const allRuns = getAllSimulationRuns(); // Gets all runs globally

  if (allRuns.length < MIN_RUNS_FOR_DYNAMIC_AVERAGE) {
    console.log(`Not enough runs (${allRuns.length}) for dynamic average, using fallback.`);
    return fallbackProfile;
  }

  const sumProfile: PersonalityProfile = {
    [PersonalityTrait.Conscientiousness]: 0,
    [PersonalityTrait.Agreeableness]: 0,
    [PersonalityTrait.EmotionalStability]: 0,
    [PersonalityTrait.Extraversion]: 0,
    [PersonalityTrait.Openness]: 0,
  };

  allRuns.forEach(run => {
    BIG_FIVE_TRAITS.forEach(trait => {
      sumProfile[trait] += run.userProfile[trait];
    });
  });

  const averageProfile: PersonalityProfile = {
    [PersonalityTrait.Conscientiousness]: sumProfile[PersonalityTrait.Conscientiousness] / allRuns.length,
    [PersonalityTrait.Agreeableness]: sumProfile[PersonalityTrait.Agreeableness] / allRuns.length,
    [PersonalityTrait.EmotionalStability]: sumProfile[PersonalityTrait.EmotionalStability] / allRuns.length,
    [PersonalityTrait.Extraversion]: sumProfile[PersonalityTrait.Extraversion] / allRuns.length,
    [PersonalityTrait.Openness]: sumProfile[PersonalityTrait.Openness] / allRuns.length,
  };
  
  console.log("Calculated dynamic average profile (global):", averageProfile);
  return averageProfile;
};
