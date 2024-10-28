import { User, SignUpData } from '../types/auth.types';
import { storageService } from '../store/localStorage/storage.service';

class AuthService {
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'authToken';

  public async signIn(email: string, password: string): Promise<User> {
    const users = storageService.getUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const token = btoa(user.id + ':' + new Date().getTime());
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
    
    return this.transformStorageUser(user);
  }

  public async signUp(userData: SignUpData): Promise<User> {
    const users = storageService.getUsers();
    
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      email: userData.email.toLowerCase(),
      contacts: []
    };

    const token = btoa(newUser.id + ':' + new Date().getTime());

    await storageService.saveUser(this.transformUserToStorage(newUser));
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(this.TOKEN_KEY, token);
    
    return newUser;
  }

  public async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (!userStr || !token) {
      this.signOut();
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return this.transformStorageUser(user);
    } catch {
      this.signOut();
      return null;
    }
  }

  public async signOut(): Promise<void> {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  public async deleteAccount(userId: string, password: string): Promise<void> {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user || user.password !== password) {
      throw new Error('Senha inválida');
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    this.signOut();
  }

  public async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const users = storageService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1 || users[userIndex].password !== currentPassword) {
      throw new Error('Senha atual inválida');
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = await this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
    }
  }

  public async updateUser(userData: Partial<User>): Promise<User> {
    if (!userData.id) {
      throw new Error('User ID is required for update');
    }

    const users = storageService.getUsers();
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const existingUser = this.transformStorageUser(users[userIndex]);
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      contacts: userData.contacts || existingUser.contacts
    };

    users[userIndex] = this.transformUserToStorage(updatedUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = await this.getCurrentUser();
    if (currentUser && currentUser.id === userData.id) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  private transformStorageUser(storageUser: any): User {
    return {
      ...storageUser,
      contacts: storageUser.contacts.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      }))
    };
  }

  private transformUserToStorage(user: User): any {
    return {
      ...user,
      contacts: user.contacts.map(contact => ({
        ...contact,
        userId: user.id,
        createdAt: contact.createdAt || new Date()
      }))
    };
  }
}

export const authService = new AuthService();