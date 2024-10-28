export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userId?: string;
  cpf?: string;
  address?: string;
  location?: string;
  createdAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  contacts: Contact[];
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}