export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type Location = Coordinates;

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

// Para o formulário
export interface ContactFormState {
  name: string;
  email: string;
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

export type ContactInput = Omit<Contact, 'id' | 'userId' | 'createdAt'>;

export interface Coordinates {
  latitude: number;
  longitude: number;
}



