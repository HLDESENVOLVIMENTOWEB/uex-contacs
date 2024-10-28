export type StorageContact = Contact;

export interface StorageState {
  users: StorageContact[];
}

export interface Address {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }

  
  
  export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    userId: string;
    cpf?: string;
    address?: string;
    location?: string;
    createdAt: Date;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    contacts: Contact[];
    createdAt: Date;
  }

  export interface StorageUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    contacts: Contact[];
  }
  
  export interface StorageKeys {
    USERS: 'users';
    CURRENT_USER: 'currentUser';
    CONTACTS: 'contacts';
  }
  
  export interface ContactFilters {
    searchTerm?: string;
    sortOrder?: 'asc' | 'desc';
    sortBy?: 'name' | 'createdAt';
  }
  
  export interface StorageData {
    users: User[];
    currentUser: User | null;
    contacts: { [userId: string]: Contact[] };
  }
  
  export interface ContactUpdateData extends Partial<Omit<Contact, 'id' | 'userId' | 'createdAt'>> {}
  
  export interface UserUpdateData extends Partial<Omit<User, 'id' | 'createdAt' | 'contacts'>> {}
  
  // Tipos para respostas de operações
  export interface StorageOperationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  // Tipos para validação
  export interface ValidationResult {
    isValid: boolean;
    message?: string;
  }
  
  // Enums para status de operações
  export enum StorageOperationStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    NOT_FOUND = 'not_found',
    DUPLICATE = 'duplicate',
    INVALID_DATA = 'invalid_data'
  }
  
  // Tipos para eventos de armazenamento
  export interface StorageEvent {
    type: 'create' | 'update' | 'delete';
    entity: 'user' | 'contact';
    data?: any;
    timestamp: Date;
  }
  
  // Tipos para queries de busca
  export interface SearchQuery {
    term: string;
    fields: string[];
    exact?: boolean;
  }
  
  // Interface para paginação
  export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  // Interface para resultado paginado
  export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  // Tipos para cache
  export interface CacheConfig {
    enabled: boolean;
    ttl: number; // Time to live em segundos
  }
  
  // Tipos para backup
  export interface BackupData {
    timestamp: Date;
    data: StorageData;
    version: string;
  }
  
  // Tipos de erro personalizados
  export class StorageError extends Error {
    constructor(
      public code: StorageOperationStatus,
      message: string
    ) {
      super(message);
      this.name = 'StorageError';
    }
  }
  
  // Tipos para migração de dados
  export interface MigrationData {
    version: string;
    timestamp: Date;
    changes: StorageEvent[];
  }
  
  // Helpers de tipo
  export type StorageKey = keyof StorageData;
  export type ContactFields = keyof Contact;
  export type UserFields = keyof User;
  
  // Tipos para observadores de mudança
  export type StorageObserver = (event: StorageEvent) => void;
  
  // Tipos para transações
  export interface Transaction {
    operations: StorageEvent[];
    timestamp: Date;
    status: 'pending' | 'committed' | 'rolled_back';
  }