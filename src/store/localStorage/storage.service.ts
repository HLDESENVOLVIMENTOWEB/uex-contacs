import { User, Contact } from '../../types/common.types';

class LocalStorageService {
  private readonly USERS_KEY = 'users';

  public getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    if (!usersStr) return [];
    
    try {
      const users: User[] = JSON.parse(usersStr);
      return users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        contacts: user.contacts.map(contact => ({
          ...contact,
          createdAt: new Date(contact.createdAt)
        }))
      }));
    } catch {
      return [];
    }
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);

    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  public getContacts(userId: string): Contact[] {
    const user = this.getUsers().find(u => u.id === userId);
    return user?.contacts || [];
  }

  public addContact(userId: string, contact: Contact): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    users[userIndex].contacts.push(contact);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  public updateContact(userId: string, updatedContact: Contact): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const contactIndex = users[userIndex].contacts.findIndex(
      c => c.id === updatedContact.id
    );

    if (contactIndex === -1) {
      throw new Error('Contato não encontrado');
    }

    users[userIndex].contacts[contactIndex] = updatedContact;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  public removeContact(userId: string, contactId: string): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    users[userIndex].contacts = users[userIndex].contacts.filter(
      c => c.id !== contactId
    );

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}

export const storageService = new LocalStorageService();