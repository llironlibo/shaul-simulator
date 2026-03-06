
import { User, AccessCode } from '../types';
import { 
  USERS_STORAGE_KEY, 
  ACCESS_CODES_STORAGE_KEY, 
  CURRENT_USER_EMAIL_STORAGE_KEY,
  INITIAL_ACCESS_CODES 
} from '../constants';

// --- LocalStorage Helper Functions ---

const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

// --- Password "Hashing" (Obfuscation) ---
// IMPORTANT: This is NOT a secure hashing method. It's a simple obfuscation
// for client-side storage where true security isn't feasible without a backend.
// DO NOT use this for any production system requiring real security.
const simpleObfuscatePassword = (password: string): string => {
  try {
    // Multiple btoa for slightly more obfuscation than a single one. Still easily reversible.
    return btoa(btoa(password).split("").reverse().join(""));
  } catch (e) {
    // Fallback for environments where btoa might not be available or fails (e.g. non-ASCII chars without proper handling)
    console.error("Password obfuscation failed:", e);
    return `OBFUSCATION_FAILED_${password}`; 
  }
};

const compareObfuscatedPassword = (plainPassword: string, obfuscatedPassword?: string): boolean => {
  if (!obfuscatedPassword) return false;
  if (obfuscatedPassword.startsWith('OBFUSCATION_FAILED_')) { // Handle fallback case
      return obfuscatedPassword === `OBFUSCATION_FAILED_${plainPassword}`;
  }
  return simpleObfuscatePassword(plainPassword) === obfuscatedPassword;
};

// --- Access Code Management ---

export const initializeAccessCodes = (): void => {
  const existingCodes = getFromLocalStorage<AccessCode[]>(ACCESS_CODES_STORAGE_KEY, []);
  if (existingCodes.length === 0) {
    setToLocalStorage(ACCESS_CODES_STORAGE_KEY, INITIAL_ACCESS_CODES);
    console.log("Initialized access codes in localStorage.");
  }
};

const getAllAccessCodes = (): AccessCode[] => {
  return getFromLocalStorage<AccessCode[]>(ACCESS_CODES_STORAGE_KEY, []);
};

const getAccessCode = (codeValue: string): AccessCode | undefined => {
  return getAllAccessCodes().find(ac => ac.code === codeValue);
};

const updateAccessCode = (updatedCode: AccessCode): void => {
  const allCodes = getAllAccessCodes();
  const index = allCodes.findIndex(ac => ac.code === updatedCode.code);
  if (index !== -1) {
    allCodes[index] = updatedCode;
    setToLocalStorage(ACCESS_CODES_STORAGE_KEY, allCodes);
  }
};

// --- User Management ---

const getAllUsers = (): User[] => {
  return getFromLocalStorage<User[]>(USERS_STORAGE_KEY, []);
};

const getUserByEmail = (email: string): User | undefined => {
  return getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const registerUser = (
  name: string,
  email: string,
  phone: string,
  password: string,
  accessCodeValue: string
): { success: boolean; message: string; user?: User } => {
  if (!name || !email || !password || !accessCodeValue) {
    return { success: false, message: "אנא מלא את כל שדות החובה." };
  }
  if (getUserByEmail(email)) {
    return { success: false, message: "כתובת אימייל זו כבר רשומה." };
  }

  const accessCode = getAccessCode(accessCodeValue);
  if (!accessCode) {
    return { success: false, message: "קוד גישה לא תקין." };
  }
  if (accessCode.isUsed) {
    return { success: false, message: "קוד גישה זה כבר נוצל." };
  }

  const newUser: User = {
    id: email.toLowerCase(),
    name,
    email: email.toLowerCase(),
    phone,
    hashedPassword: simpleObfuscatePassword(password),
    registeredAt: Date.now(),
  };

  const users = getAllUsers();
  users.push(newUser);
  setToLocalStorage(USERS_STORAGE_KEY, users);

  accessCode.isUsed = true;
  accessCode.usedByEmail = newUser.email;
  accessCode.usedAt = Date.now();
  updateAccessCode(accessCode);
  
  setToLocalStorage(CURRENT_USER_EMAIL_STORAGE_KEY, newUser.email);

  return { success: true, message: "ההרשמה הושלמה בהצלחה!", user: newUser };
};

export const loginUser = (
  email: string,
  password: string
): { success: boolean; message: string; user?: User } => {
  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, message: "אימייל או סיסמה שגויים." };
  }

  if (!compareObfuscatedPassword(password, user.hashedPassword)) {
    return { success: false, message: "אימייל או סיסמה שגויים." };
  }
  
  setToLocalStorage(CURRENT_USER_EMAIL_STORAGE_KEY, user.email);
  return { success: true, message: "התחברת בהצלחה!", user };
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_EMAIL_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const currentUserEmail = getFromLocalStorage<string | null>(CURRENT_USER_EMAIL_STORAGE_KEY, null);
  if (!currentUserEmail) {
    return null;
  }
  return getUserByEmail(currentUserEmail) || null;
};

// For Admin Panel (Future use)
export const adminGetAllUsers = (): User[] => getAllUsers();
export const adminGetAllAccessCodes = (): AccessCode[] => getAllAccessCodes();
export const adminAddAccessCodes = (newCodes: string[]): {success: boolean, message: string} => {
  if (!newCodes || newCodes.length === 0) {
    return {success: false, message: "לא סופקו קודים."};
  }
  const existingCodes = getAllAccessCodes();
  const codesToAdd: AccessCode[] = [];
  let addedCount = 0;
  let skippedCount = 0;

  for (const rawCode of newCodes) {
    const code = rawCode.trim();
    if (code && !existingCodes.some(ec => ec.code === code) && !codesToAdd.some(ac => ac.code === code)) {
      codesToAdd.push({ code, isUsed: false, usedByEmail: null, usedAt: null });
      addedCount++;
    } else {
      skippedCount++;
    }
  }
  
  if (codesToAdd.length > 0) {
    setToLocalStorage(ACCESS_CODES_STORAGE_KEY, [...existingCodes, ...codesToAdd]);
  }
  let message = `נוספו ${addedCount} קודים חדשים.`;
  if (skippedCount > 0) {
    message += ` ${skippedCount} קודים דולגו (כפולים או ריקים).`;
  }
  return {success: addedCount > 0, message};
}
