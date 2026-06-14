export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    userID: string;
    userName: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}