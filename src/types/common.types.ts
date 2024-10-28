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
    userId: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    address: Address;
    location: Location;
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
  
  // Form related types
  export interface ContactFormData {
    name: string;
    cpf: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  }
  
  // Input types
  export type ContactInput = Omit<Contact, 'id' | 'userId' | 'createdAt'>;
  export type UserInput = Omit<User, 'id' | 'createdAt' | 'contacts'>;
  
  // Storage related types
  export type StorageUser = User;
  export type StorageContact = Contact;
  
  export interface StorageState {
    users: StorageUser[];
  }
  
  // Service types
  export interface Coordinates {
    latitude: number;
    longitude: number;
  }