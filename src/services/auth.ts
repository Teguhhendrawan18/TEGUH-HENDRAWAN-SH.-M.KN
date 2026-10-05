import { UserSession } from '../types';

export interface PredefinedAccount {
  email: string;
  password: string;
  session: UserSession;
}

export const PREDEFINED_ACCOUNTS: PredefinedAccount[] = [
  {
    email: 'teguhhendrawan03@gmail.com',
    password: 'password123',
    session: {
      id: 'usr-teguh-01',
      email: 'teguhhendrawan03@gmail.com',
      nama: 'Teguh Hendrawan, S.H., M.Kn.',
      role: 'NOTARIS_PPAT',
      jabatan: 'Notaris & Pejabat Pembuat Akta Tanah (PPAT)',
      nomorSk: 'SK Menkumham RI: AHU-00412.AH.02 & SK BPN: 52/KEP/PPAT'
    }
  },
  {
    email: 'staf.arsip@kantornotaris.id',
    password: 'password123',
    session: {
      id: 'usr-staf-02',
      email: 'staf.arsip@kantornotaris.id',
      nama: 'Rina Anggraini, S.H.',
      role: 'STAF_OPERASIONAL',
      jabatan: 'Staf Protokol & Pengelola Kearsipan Akta',
      nomorSk: 'ID Staf: STF-2024-008'
    }
  }
];

const AUTH_STORAGE_KEY = 'notaris_ppat_auth_session';

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch (e) {
    console.error('Error reading auth session from storage', e);
    return null;
  }
}

export function saveSession(user: UserSession): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving session', e);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing session', e);
  }
}

export function authenticateUser(email: string, password: string): { success: boolean; user?: UserSession; message?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const found = PREDEFINED_ACCOUNTS.find(
    acc => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPass
  );

  if (found) {
    saveSession(found.session);
    return { success: true, user: found.session };
  }

  // Fallback for custom staff login
  if (cleanEmail && cleanPass.length >= 6) {
    const customUser: UserSession = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      nama: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      role: cleanEmail.includes('notaris') || cleanEmail.includes('ppat') ? 'NOTARIS_PPAT' : 'STAF_OPERASIONAL',
      jabatan: 'Petugas Register Kantor'
    };
    saveSession(customUser);
    return { success: true, user: customUser };
  }

  return { 
    success: false, 
    message: 'Email atau kata sandi tidak cocok. Gunakan akun kantor atau klik tombol login instan di bawah.' 
  };
}
