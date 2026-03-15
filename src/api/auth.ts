// Authentication API calls for login and register

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_BASE_URL = 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fname: string;
  lname: string;
  email: string;
  password: string;
  contact_number: string;
  location: string;
  gender: string;
  role: string;
  dob?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    user_id: string;
    email: string;
    fname: string;
    lname: string;
    role?: string;
    user_type?: string;
  };
}

export interface SignupResponse {
  message: string;
  user_id: number;
  email: string;
}

/** Normalize API error detail (string, array of validation errors, or object) to a single string */
function parseDetail(detail: unknown, fallback: string): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const messages = detail.map((d: { msg?: string; loc?: unknown[] }) =>
      d.msg || (Array.isArray(d.loc) ? `${d.loc.join('.')}: invalid` : '')
    ).filter(Boolean)
    return messages.length ? messages.join('. ') : fallback
  }
  if (detail && typeof detail === 'object' && 'message' in detail) {
    return String((detail as { message: unknown }).message)
  }
  return fallback
}

/**
 * Register new user
 */
export async function signup(data: RegisterRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = parseDetail(body.detail, 'Registration failed')
    throw new Error(message)
  }

  return response.json()
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = parseDetail(body.detail, 'Login failed')
    throw new Error(message)
  }

  return response.json()
}

/**
 * Verify email with token (works for both donor and NGO)
 */
export async function verifyEmail(token: string): Promise<{ message: string; pending_admin_approval?: boolean }> {
  const response = await fetch(`${API_BASE_URL}/verify?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = typeof err.detail === 'string' ? err.detail : 'Email verification failed';
    throw new Error(msg);
  }

  return response.json();
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

/**
 * Get current user from localStorage (cached at login)
 */
export function getCurrentUser(): any {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export interface UserProfile {
  user_id: number;
  fname: string;
  lname: string;
  email: string;
  contact_number: number;
  location: string;
  gender: string;
  role: string;
  is_verified: boolean;
  created_at: string | null;
}

/**
 * Change password for the authenticated user (requires auth).
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/user/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = typeof err.detail === 'string' ? err.detail : 'Failed to change password';
    throw new Error(msg);
  }
  return res.json();
}

/**
 * Fetch current user profile from API (requires auth)
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === 'string' ? err.detail : 'Failed to load profile');
  }
  return res.json();
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('access_token');
}

/**
 * Get user role from localStorage
 */
export function getUserRole(): string | null {
  const user = getCurrentUser();
  return user?.role || user?.user_type || null;
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('user');
}

// --- NGO auth (receive items) ---

export interface NGORegisterRequest {
  ngo_name: string;
  registration_number: string;
  ngo_type: string;
  email: string;
  website_url?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mission_statement: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  password: string;
}

export interface NGOLoginResponse {
  message: string;
  access_token: string;
}

function parseApiError(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail.map((d: { msg?: string; loc?: unknown[] }) => d.msg || (d.loc ? `${d.loc.join('.')}: invalid` : '')).filter(Boolean);
    return messages.length ? messages.join('. ') : 'Validation failed';
  }
  if (detail && typeof detail === 'object' && 'message' in detail) return String((detail as { message: string }).message);
  return 'NGO registration failed';
}

/**
 * Register new NGO (receive donations)
 */
export async function ngoRegister(data: NGORegisterRequest): Promise<{ ngo_id: number; email: string }> {
  const payload = {
    ...data,
    pincode: String(data.pincode ?? ''),
    account_number: String(data.account_number ?? ''),
    ifsc_code: String(data.ifsc_code ?? '').toUpperCase(),
    mission_statement: String(data.mission_statement ?? '').trim(),
  };
  const res = await fetch(`${API_BASE_URL}/ngo/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(parseApiError(err.detail));
  }
  return res.json();
}

/**
 * Login as NGO (receive items)
 */
export async function ngoLogin(credentials: LoginRequest): Promise<{ message: string; access_token: string }> {
  const res = await fetch(`${API_BASE_URL}/ngo/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'NGO login failed');
  }
  return res.json();
}
