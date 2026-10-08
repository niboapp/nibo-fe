export interface Organization {
  _id: string;
  name?: string;
  email?: string;
  username?: string;
  industry?: string;
  status?: string;
  is_verified?: boolean;
}

export interface AuthUser {
  _id: string;
  email: string;
  full_name: string;
  user_type: string;
  organization_id?: string;
  organization?: Organization;
  verified: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  metadata?: unknown;
}

export type AuthResponse = ApiResponse<AuthUser>;
