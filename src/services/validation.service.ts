import { validateCPF } from '../utils/cpf.validator';

class ValidationService {
  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public validateCPF(cpf: string): boolean {
    return validateCPF(cpf);
  }

  public validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11;
  }

  public validateCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
  }

  public validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      };
    }

    return {
      isValid: true,
      message: ''
    };
  }

  public validateRequiredFields(fields: Record<string, any>): { isValid: boolean; message: string } {
    const emptyFields = Object.entries(fields)
      .filter(([_, value]) => !value || (typeof value === 'string' && !value.trim()))
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      return {
        isValid: false,
        message: `Os seguintes campos são obrigatórios: ${emptyFields.join(', ')}`
      };
    }

    return {
      isValid: true,
      message: ''
    };
  }
}

export const validationService = new ValidationService();