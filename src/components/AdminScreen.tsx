
import React, { useState, useEffect } from 'react';
import { StoredSimulationRun, PersonalityProfile, User, AccessCode } from '../types';
import Button from './Button';
import { BIG_FIVE_TRAITS } from '../constants';
import { adminGetAllUsers, adminGetAllAccessCodes, adminAddAccessCodes } from '../services/authService'; // Import admin functions

interface AdminScreenProps {
  allRuns: StoredSimulationRun[];
  currentAverageProfile: PersonalityProfile;
  onClearAllData: () => void;
  onRecalculateAverage: () => void;
  onBack: () => void;
  refreshRuns: () => void;
  currentUser: User | null; // For potential admin role checks or displaying info
}

const TraitScoreDisplay: React.FC<{ profile: PersonalityProfile }> = ({ profile }) => (
  <ul className="list-disc pl-5 text-xs">
    {BIG_FIVE_TRAITS.map(trait => (
      <li key={trait} className="text-slate-700">
        {trait}: {profile[trait]?.toFixed(2) ?? 'N/A'}
      </li>
    ))}
  </ul>
);

const ProfileFlagsDisplay: React.FC<{ flags: StoredSimulationRun['scoringResults']['profileFlags'] }> = ({ flags }) => {
  if (!flags || flags.length === 0) {
    return <span className="text-xs italic text-slate-500">אין דגלים</span>;
  }
  return (
    <ul className="list-disc pl-5 text-xs">
      {flags.map((flag, index) => (
        <li key={index} className={flag.severity === 'warning' ? 'text-amber-700' : 'text-sky-700'}>
          {flag.type}: {flag.message.substring(0,30)}...
        </li>
      ))}
    </ul>
  );
};


const AdminScreen: React.FC<AdminScreenProps> = ({
  allRuns,
  currentAverageProfile,
  onClearAllData,
  onRecalculateAverage,
  onBack,
  refreshRuns,
  currentUser: _currentUser
}) => {
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [newAccessCodesInput, setNewAccessCodesInput] = useState('');
  const [adminMessage, setAdminMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (showUserManagement) {
      setUsers(adminGetAllUsers());
      setAccessCodes(adminGetAllAccessCodes());
    }
  }, [showUserManagement]);

  const handleClearData = () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את כל נתוני הסימולציות השמורים? פעולה זו אינה הפיכה.")) {
      onClearAllData();
    }
  };

  const toggleRunDetails = (runId: string) => {
    setExpandedRunId(expandedRunId === runId ? null : runId);
  };
  
  const handleAddAccessCodes = () => {
    setAdminMessage(null);
    const codesArray = newAccessCodesInput.split(/[\n,]+/).map(code => code.trim()).filter(code => code);
    if (codesArray.length === 0) {
      setAdminMessage({type: 'error', text: 'אנא הזן קודי גישה.'});
      return;
    }
    const result = adminAddAccessCodes(codesArray);
    setAdminMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      setNewAccessCodesInput('');
      setAccessCodes(adminGetAllAccessCodes()); // Refresh list
    }
  };

  const refreshAdminData = () => {
    setUsers(adminGetAllUsers());
    setAccessCodes(adminGetAllAccessCodes());
    refreshRuns(); // Refresh simulation runs list
    setAdminMessage({ type: 'success', text: 'נתונים רועננו.' });
    setTimeout(() => setAdminMessage(null), 3000);
  }


  return (
    <div className="container mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-sky-700">פאנל ניהול</h2>
        <Button onClick={onBack} variant="primary" size="md">
            חזור
        </Button>
      </div>
      
      {adminMessage && (
        <div className={`p-3 mb-4 rounded-md text-sm ${adminMessage.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
          {adminMessage.text}
        </div>
      )}

      {/* Tab-like navigation for admin sections */}
      <div className="mb-6 border-b border-slate-300">
        <nav className="flex space-x-4 rtl:space-x-reverse">
          <button 
            onClick={() => setShowUserManagement(false)} 
            className={`py-2 px-4 font-medium text-sm ${!showUserManagement ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ניהול ריצות סימולציה
          </button>
          <button 
            onClick={() => setShowUserManagement(true)} 
            className={`py-2 px-4 font-medium text-sm ${showUserManagement ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ניהול משתמשים וקודי גישה
          </button>
        </nav>
      </div>


      {!showUserManagement && (
        <>
          <div className="mb-8 p-4 border rounded-md bg-slate-50">
            <h3 className="text-xl font-semibold text-slate-700 mb-3">בקרות ריצות</h3>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleClearData} variant="danger" size="sm">מחק נתוני ריצות</Button>
              <Button onClick={() => { onRecalculateAverage(); refreshRuns(); }} variant="secondary" size="sm">חשב מחדש ממוצע גלובלי</Button>
              <Button onClick={refreshRuns} variant="secondary" size="sm">רענן רשימת ריצות</Button>
            </div>
          </div>

          <div className="mb-8 p-4 border rounded-md bg-slate-50">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">פרופיל ממוצע גלובלי של נבחנים:</h3>
            {currentAverageProfile ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-sm">
                {BIG_FIVE_TRAITS.map(trait => (
                  <div key={trait} className="p-2 bg-slate-200 rounded text-slate-800">
                    <span className="font-medium">{trait}: </span>{currentAverageProfile[trait]?.toFixed(2)}
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-600">אין פרופיל ממוצע זמין.</p>}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">ריצות סימולציה שמורות ({allRuns.length}):</h3>
            {allRuns.length === 0 ? <p className="text-slate-600">לא נמצאו ריצות שמורות.</p> : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto p-2 border rounded-md">
                {allRuns.slice().reverse().map((run) => (
                  <div key={run.id} className="p-3 border rounded-md bg-white shadow-sm">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleRunDetails(run.id)}>
                      <div>
                        <p className="font-semibold text-slate-800">ID: <span className="font-normal text-xs">{run.id}</span></p>
                        <p className="text-xs text-slate-500">זמן: {new Date(run.timestamp).toLocaleString('he-IL')}</p>
                      </div>
                      <span className="text-sky-500 text-xl">{expandedRunId === run.id ? '▲' : '▼'}</span>
                    </div>
                    {expandedRunId === run.id && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-slate-600 mb-1">פרופיל משתמש:</p>
                        <TraitScoreDisplay profile={run.userProfile} />
                        <p className="text-sm font-medium text-slate-600 mt-2 mb-1">תוצאות ניקוד:</p>
                        <p className="text-xs text-slate-700">ציון התאמה: <span className="font-semibold">{run.scoringResults.fitScore}</span></p>
                        <p className="text-xs text-slate-700 mt-1">דגלי פרופיל:</p>
                        <ProfileFlagsDisplay flags={run.scoringResults.profileFlags} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showUserManagement && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">הוספת קודי גישה חדשים</h3>
            <div className="p-4 border rounded-md bg-slate-50">
              <textarea
                value={newAccessCodesInput}
                onChange={(e) => setNewAccessCodesInput(e.target.value)}
                placeholder="הזן קוד אחד בכל שורה, או מופרדים בפסיק..."
                rows={4}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              />
              <Button onClick={handleAddAccessCodes} variant="primary" size="sm" className="mt-2">הוסף קודים</Button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">רשימת משתמשים רשומים ({users.length})</h3>
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-2 bg-slate-50">
              {users.length === 0 ? <p className="text-slate-500 p-2">אין משתמשים רשומים.</p> : (
                <ul className="space-y-2">
                  {users.map(user => (
                    <li key={user.id} className="p-2 bg-white border rounded-md text-sm">
                      <strong className="text-slate-800">{user.name}</strong> <span className="text-slate-600">({user.email})</span> - <span className="text-slate-600">טל': {user.phone || 'לא צוין'}</span>
                      <span className="block text-xs text-slate-500">נרשם: {new Date(user.registeredAt).toLocaleDateString('he-IL')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">רשימת קודי גישה ({accessCodes.length})</h3>
            <div className="max-h-[400px] overflow-y-auto border rounded-md p-2 bg-slate-50">
               {accessCodes.length === 0 ? <p className="text-slate-500 p-2">אין קודי גישה.</p> : (
                <ul className="space-y-2">
                  {accessCodes.slice().reverse().map(ac => ( // Newest first
                    <li key={ac.code} className={`p-2 border rounded-md text-sm ${ac.isUsed ? 'bg-slate-200 text-slate-700' : 'bg-green-50 text-slate-800'}`}>
                      <strong className="text-slate-900">{ac.code}</strong> - {ac.isUsed ? 
                        `נוצל ע"י: ${ac.usedByEmail} (בתאריך: ${ac.usedAt ? new Date(ac.usedAt).toLocaleDateString('he-IL') : 'לא ידוע'})` : 
                        <span className="text-green-700 font-semibold">פנוי</span>
                      }
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
           <Button onClick={refreshAdminData} variant="secondary" size="sm" className="mt-4">רענן כל הנתונים בפאנל</Button>
        </div>
      )}
    </div>
  );
};

export default AdminScreen;
