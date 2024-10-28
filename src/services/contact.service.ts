import { Contact } from '../types/contact.types';
import { storageService } from '../store/localStorage/storage.service';
import { validateCPF } from '../utils/cpf.validator';

class ContactService {
  private readonly CONTACTS_KEY = 'contacts';

  public async getContacts(userId: string): Promise<Contact[]> {
    try {
      const contacts = storageService.getContacts(userId);
      return contacts.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw new Error('Não foi possível carregar os contatos');
    }
  }

  public async getContactById(userId: string, contactId: string): Promise<Contact> {
    const contacts = await this.getContacts(userId);
    const contact = contacts.find(c => c.id === contactId);
    
    if (!contact) {
      throw new Error('Contato não encontrado');
    }

    return contact;
  }

  public async createContact(userId: string, contactData: Omit<Contact, 'id' | 'userId' | 'createdAt'>): Promise<Contact> {
    // Validar CPF
    if (!validateCPF(contactData.cpf)) {
      throw new Error('CPF inválido');
    }

    // Verificar CPF duplicado
    const contacts = await this.getContacts(userId);
    if (contacts.some(c => c.cpf === contactData.cpf)) {
      throw new Error('CPF já cadastrado');
    }

    const newContact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date()
    };

    storageService.addContact(userId, newContact);
    return newContact;
  }

  public async updateContact(
    userId: string, 
    contactId: string, 
    contactData: Partial<Contact>
  ): Promise<Contact> {
    const contacts = await this.getContacts(userId);
    const contactIndex = contacts.findIndex(c => c.id === contactId);

    if (contactIndex === -1) {
      throw new Error('Contato não encontrado');
    }

    // Verificar CPF duplicado se estiver sendo atualizado
    if (contactData.cpf && contactData.cpf !== contacts[contactIndex].cpf) {
      if (!validateCPF(contactData.cpf)) {
        throw new Error('CPF inválido');
      }
      
      if (contacts.some(c => c.cpf === contactData.cpf)) {
        throw new Error('CPF já cadastrado');
      }
    }

    const updatedContact = {
      ...contacts[contactIndex],
      ...contactData,
      id: contactId,
      userId
    };

    contacts[contactIndex] = updatedContact;
    localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));

    return updatedContact;
  }

  public async deleteContact(userId: string, contactId: string): Promise<void> {
    storageService.removeContact(userId, contactId);
  }

  public async searchContacts(userId: string, searchTerm: string): Promise<Contact[]> {
    const contacts = await this.getContacts(userId);
    const term = searchTerm.toLowerCase().trim();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(term) ||
      contact.cpf.replace(/\D/g, '').includes(term)
    );
  }
}

export const contactService = new ContactService();