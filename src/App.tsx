
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SimulationScreen from './components/SimulationScreen';
import ProfileScreen from './components/ProfileScreen';
import LoadingSpinner from './components/LoadingSpinner';
import Button from './components/Button';
import EducationalScreen from './components/EducationalScreen';
import GuidedReflectionScreen from './components/GuidedReflectionScreen';
import AdminScreen from './components/AdminScreen';
import AuthScreen from './components/AuthScreen'; // New AuthScreen
import { AppStage, ItemPair, UserChoice, PersonalityProfile, TraitExplanations, PersonalityTrait, ScoringResults, StoredSimulationRun, User } from './types';
import { getShuffledItems } from './services/personalityTestData';
import { getPersonalizedExplanations } from './services/geminiService';
import { calculateScoringResults } from './services/scoringService';
import { API_KEY_ERROR_MESSAGE, AVERAGE_APPLICANT_PROFILE } from './constants';
import { saveSimulationRun, generateRunId, calculateAverageProfileFromStoredRuns, getAllSimulationRuns, clearAllSimulationRuns } from './services/storageService';
import { initializeAccessCodes, registerUser, loginUser, logoutUser, getCurrentUser } from './services/authService'; // Auth service functions

// Helper function to check API key status safely
const isApiKeyAvailable = (): boolean => {
  return typeof process !== 'undefined' &&
         process.env &&
         typeof process.env.API_KEY === 'string' &&
         process.env.API_KEY.trim().length > 0;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.LoadingResults); // Initial loading state
  const [authError, setAuthError] = useState<string | null>(null);

  const [simulationItems, setSimulationItems] = useState<ItemPair[]>([]);
  const [userProfile, setUserProfile] = useState<PersonalityProfile | null>(null);
  const [traitExplanations, setTraitExplanations] = useState<TraitExplanations | null>(null);
  const [isLoadingExplanations, setIsLoadingExplanations] = useState<boolean>(false);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const [scoringResults, setScoringResults] = useState<ScoringResults | null>(null);
  const [previousStage, setPreviousStage] = useState<AppStage>(AppStage.Welcome);
  const [currentAverageProfile, setCurrentAverageProfile] = useState<PersonalityProfile>(AVERAGE_APPLICANT_PROFILE);
  const [allRunsForAdmin, setAllRunsForAdmin] = useState<StoredSimulationRun[]>([]);

  useEffect(() => {
    initializeAccessCodes(); // Ensure access codes are in localStorage
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentStage(AppStage.Welcome); // Go to Welcome if logged in
    } else {
      setCurrentStage(AppStage.Auth); // Go to Auth if not logged in
    }

    if (!isApiKeyAvailable()) {
      setApiKeyMissing(true);
      // The warning is already logged by geminiService.ts, but we can log it here too if needed
      // console.warn(API_KEY_ERROR_MESSAGE); 
    }
    setSimulationItems(getShuffledItems());
    updateDynamicAverageProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const updateDynamicAverageProfile = useCallback(() => {
    const dynamicAverage = calculateAverageProfileFromStoredRuns(AVERAGE_APPLICANT_PROFILE);
    setCurrentAverageProfile(dynamicAverage);
  }, []);

  // --- Auth Handlers ---
  const handleRegister = async (name: string, email: string, phone: string, accessCode: string, password: string) => {
    setAuthError(null);
    // Corrected argument order: password first, then accessCode for authService.registerUser
    const result = await registerUser(name, email, phone, password, accessCode);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setCurrentStage(AppStage.Welcome);
    } else {
      setAuthError(result.message);
    }
    return result;
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthError(null);
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setCurrentStage(AppStage.Welcome);
    } else {
      setAuthError(result.message);
    }
    return result;
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
    setTraitExplanations(null);
    setScoringResults(null);
    setCurrentStage(AppStage.Auth);
    setAuthError(null);
  };


  const calculateProfile = (choices: UserChoice[]): PersonalityProfile => {
    const profile: PersonalityProfile = {
      [PersonalityTrait.Conscientiousness]: 0,
      [PersonalityTrait.Agreeableness]: 0,
      [PersonalityTrait.EmotionalStability]: 0,
      [PersonalityTrait.Extraversion]: 0,
      [PersonalityTrait.Openness]: 0,
    };
    choices.forEach(choice => { profile[choice.chosenTrait]++; });
    return profile;
  };

  const handleSimulationSubmit = useCallback(async (choices: UserChoice[]) => {
    setCurrentStage(AppStage.LoadingResults);
    const profile = calculateProfile(choices);
    setUserProfile(profile);

    const results = calculateScoringResults(profile);
    setScoringResults(results);

    if (currentUser) { // Save run only if a user is logged in
        const newRun: StoredSimulationRun = {
          id: generateRunId(), // Potentially prefix with user ID if needed for filtering
          timestamp: Date.now(),
          userProfile: profile,
          scoringResults: results,
        };
        saveSimulationRun(newRun, currentUser.id); // Pass user ID for namespacing if desired
        updateDynamicAverageProfile();
    }


    if (isApiKeyAvailable()) {
      setIsLoadingExplanations(true);
      const explanations = await getPersonalizedExplanations(profile);
      setTraitExplanations(explanations);
      setIsLoadingExplanations(false);
    } else {
      // Fallback explanations if API key missing
       const fallbackExplanations: TraitExplanations = {};
        Object.values(PersonalityTrait).forEach(trait => {
            fallbackExplanations[trait] = {
                explanation: `הסבר מותאם אישית באמצעות AI אינו זמין. ${API_KEY_ERROR_MESSAGE}`,
                medicalRelevance: "תוכל עדיין לעיין בניתוח התכונות הבסיסי שלך ובציון ההתאמה.",
                advice: "שקול להגדיר מפתח API לקבלת תובנות מלאות."
            };
        });
        setTraitExplanations(fallbackExplanations);
        setIsLoadingExplanations(false);
    }
    setCurrentStage(AppStage.Results);
  }, [updateDynamicAverageProfile, currentUser]);

  const startSimulation = () => {
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    setSimulationItems(getShuffledItems());
    setUserProfile(null);
    setTraitExplanations(null);
    setScoringResults(null);
    setPreviousStage(AppStage.Welcome);
    setCurrentStage(AppStage.Simulation);
  };

  const navigateToEducationalScreen = () => {
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    setPreviousStage(currentStage);
    setCurrentStage(AppStage.Educational);
  };

  const navigateToGuidedReflection = () => {
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    setPreviousStage(AppStage.Results);
    setCurrentStage(AppStage.GuidedReflection);
  };

  const navigateToAdminScreen = () => {
    // Potentially add admin role check here if needed in future
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    setAllRunsForAdmin(getAllSimulationRuns(currentUser.id)); // Pass user ID if runs are namespaced
    setPreviousStage(currentStage);
    setCurrentStage(AppStage.Admin);
  };
  
  const returnToPreviousScreen = () => {
    if (!currentUser && previousStage !== AppStage.Auth) { setCurrentStage(AppStage.Auth); return; }
    setCurrentStage(previousStage);
  };
  
  const returnToWelcomeScreen = () => {
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    setCurrentStage(AppStage.Welcome);
  };

  const returnToResultsScreen = () => {
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    setCurrentStage(AppStage.Results);
  }
  
  const handleClearAllData = () => {
    if (!currentUser) { setCurrentStage(AppStage.Auth); return; }
    // Decide if this should be global or per-user. For now, assume global for admin.
    clearAllSimulationRuns(); // Consider if this needs user ID for namespacing
    setAllRunsForAdmin([]); 
    updateDynamicAverageProfile(); 
    alert("כל נתוני הסימולציות נמחקו.");
  };

  const renderContent = () => {
    if (currentStage === AppStage.LoadingResults && !currentUser) { // Initial load before user check
        return <LoadingSpinner message="טוען אפליקציה..." />;
    }
    if (!currentUser && currentStage !== AppStage.Auth) {
        // This case should ideally not be hit if initial useEffect sets stage to Auth.
        // But as a safeguard:
        return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} authError={authError} />;
    }

    switch (currentStage) {
      case AppStage.Auth:
        return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} authError={authError} />;
      case AppStage.Welcome:
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
            <div className="bg-white p-10 rounded-xl shadow-2xl max-w-4xl">
              <h2 className="text-4xl font-bold text-sky-700 mb-6">ברוכים הבאים {currentUser?.name}!</h2>
              <p className="text-lg text-slate-700 mb-4">
                סימולטור שאו"ל הוא כלי מתקדם להכנה מבוססת אישיות למבחן "שאו"ל" ללימודי רפואה ורפואת שיניים.
              </p>
              <p className="text-slate-600 mb-8">
                גלה את פרופיל האישיות שלך, תרגל קבלת החלטות, קבל ציון התאמה משוער והגע למבחן האמיתי רגוע ובטוח יותר.
              </p>
              {apiKeyMissing && (
                <div className="my-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                  <p className="font-bold">שימו לב:</p> <p>{API_KEY_ERROR_MESSAGE}</p>
                </div>
              )}
              <div className="flex flex-col xl:flex-row items-center justify-center gap-4 flex-wrap">
                <Button onClick={startSimulation} size="md" variant="primary" className="w-full sm:flex-1">
                  התחל סימולציה
                </Button>
                <Button onClick={navigateToEducationalScreen} size="md" variant="secondary" className="w-full sm:flex-1">
                  למד על חמש התכונות הגדולות
                </Button>
                 <Button onClick={navigateToAdminScreen} size="md" variant="secondary" className="w-full sm:flex-1 !bg-slate-600 hover:!bg-slate-700 !text-white">
                  פאנל ניהול (ריצות)
                </Button>
              </div>
            </div>
          </div>
        );
      case AppStage.Simulation:
        return <SimulationScreen items={simulationItems} onSubmit={handleSimulationSubmit} />;
      case AppStage.LoadingResults:
        return <LoadingSpinner message="מנתח את בחירותיך, מחשב ציון התאמה, בודק דפוסי מענה ומכין את פרופיל האישיות שלך..." />;
      case AppStage.Results:
        return (
          <ProfileScreen
            profile={userProfile}
            explanations={traitExplanations}
            scoringResults={scoringResults}
            onRetake={startSimulation}
            isLoadingExplanations={isLoadingExplanations}
            onNavigateToGuidedReflection={navigateToGuidedReflection}
            averageProfileForDisplay={currentAverageProfile}
            apiKeyAvailable={isApiKeyAvailable()}
          />
        );
      case AppStage.Educational:
        return <EducationalScreen onBack={returnToPreviousScreen} />;
      case AppStage.GuidedReflection:
        return (
          <GuidedReflectionScreen
            profile={userProfile}
            scoringResults={scoringResults}
            onBackToResults={returnToResultsScreen}
            onRetakeSimulation={startSimulation}
          />
        );
      case AppStage.Admin:
        return (
          <AdminScreen
            allRuns={allRunsForAdmin}
            currentAverageProfile={currentAverageProfile}
            onClearAllData={handleClearAllData}
            onRecalculateAverage={updateDynamicAverageProfile}
            onBack={returnToWelcomeScreen}
            refreshRuns={() => setAllRunsForAdmin(getAllSimulationRuns(currentUser?.id))} // Pass user ID
            currentUser={currentUser} // Pass currentUser to AdminScreen
          />
        );
      default:
        return <LoadingSpinner message="טוען..." />; // Fallback for undefined states
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-2 py-4 sm:px-4 sm:py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
