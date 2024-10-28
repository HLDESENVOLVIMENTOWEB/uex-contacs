import { useState, useCallback, useEffect } from 'react';
import { Contact } from '../types/contact.types';
import { useAuth } from './useAuth';
import { storageService } from '../store/localStorage/storage.service';

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  addContact: (contact: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateContact: (contactId: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  searchContacts: (term: string) => Contact[];
  sortContacts: (order: 'asc' | 'desc') => void;
  refreshContacts: () => Promise<void>;
}

export const useContacts = (): UseContactsReturn => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userContacts = storageService.getContacts(user.id);
      setContacts(userContacts.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError('Erro ao carregar contatos');
      console.error('Erro ao carregar contatos:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const addContact = async (newContact: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const contact: Contact = {
        ...newContact,
        id: crypto.randomUUID(),
        userId: user.id,
        createdAt: new Date()
      };

      // Verificar CPF duplicado
      const existingContact = contacts.find(c => c.cpf === contact.cpf);
      if (existingContact) {
        throw new Error('CPF já cadastrado');
      }

      storageService.addContact(user.id, contact);
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar contato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (contactId: string, updatedData: Partial<Contact>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const currentContact = contacts.find(c => c.id === contactId);
      if (!currentContact) {
        throw new Error('Contato não encontrado');
      }

      // Verificar CPF duplicado se estiver sendo atualizado
      if (updatedData.cpf && updatedData.cpf !== currentContact.cpf) {
        const existingContact = contacts.find(c => c.cpf === updatedData.cpf);
        if (existingContact) {
          throw new Error('CPF já cadastrado');
        }
      }

      const updatedContact = {
        ...currentContact,
        ...updatedData
      };

      storageService.updateContact(user.id, updatedContact);
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar contato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      storageService.removeContact(user.id, contactId);
      await loadContacts();
    } catch (err) {
      setError('Erro ao excluir contato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchContacts = (term: string): Contact[] => {
    const searchTerm = term.toLowerCase().trim();
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.cpf.replace(/\D/g, '').includes(searchTerm)
    );
  };

  const sortContacts = (order: 'asc' | 'desc') => {
    const sortedContacts = [...contacts].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    });
    setContacts(sortedContacts);
  };

  const refreshContacts = async () => {
    await loadContacts();
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    searchContacts,
    sortContacts,
    refreshContacts
  };
};