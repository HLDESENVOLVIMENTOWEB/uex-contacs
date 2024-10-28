import { Address } from '../store/localStorage/storage.types';

class AddressFormatter {
  /**
   * Formata um endereço completo em uma única string
   */
  public static formatFullAddress(address: Address): string {
    const parts = [
      address.street,
      address.number,
      address.complement && `(${address.complement})`,
      address.neighborhood,
      address.city,
      address.state,
      this.formatCEP(address.cep)
    ];

    return parts.filter(Boolean).join(', ');
  }

  /**
   * Formata um endereço para exibição em múltiplas linhas
   */
  public static formatMultilineAddress(address: Address): string[] {
    return [
      `${address.street}, ${address.number}${address.complement ? ` (${address.complement})` : ''}`,
      `${address.neighborhood}`,
      `${address.city} - ${address.state}`,
      `CEP: ${this.formatCEP(address.cep)}`
    ];
  }

  /**
   * Formata um endereço para a API do Google Maps
   */
  public static formatForGeocoding(address: Address): string {
    return `${address.street}, ${address.number} - ${address.city}, ${address.state}, Brazil`;
  }

  /**
   * Formata um CEP (00000-000)
   */
  public static formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Formata um endereço para exibição em lista
   */
  public static formatAddressForList(address: Address): string {
    return `${address.street}, ${address.number}${address.complement ? ` (${address.complement})` : ''} - ${address.city}/${address.state}`;
  }

  /**
   * Remove formatação do CEP
   */
  public static cleanCEP(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  /**
   * Verifica se um CEP é válido
   */
  public static isValidCEP(cep: string): boolean {
    const cleanedCEP = this.cleanCEP(cep);
    return cleanedCEP.length === 8;
  }

  /**
   * Formata um estado para exibição (sigla)
   */
  public static formatState(state: string): string {
    return state.toUpperCase();
  }

  /**
   * Formata um endereço para salvar no banco de dados
   */
  public static formatForStorage(address: Address): Address {
    return {
      ...address,
      cep: this.cleanCEP(address.cep),
      state: this.formatState(address.state),
      complement: address.complement?.trim() || undefined
    };
  }
}

export default AddressFormatter;