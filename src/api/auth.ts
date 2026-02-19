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
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return response.json();
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
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

/**
 * Verify user email with token
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/user/verify?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Email verification failed');
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
 * Get current user from localStorage
 */
export function getCurrentUser(): any {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
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
