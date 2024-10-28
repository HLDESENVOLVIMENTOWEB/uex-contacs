import axios from 'axios';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface AddressData {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

class ViaCEPService {
  private readonly baseURL = 'https://viacep.com.br/ws';

  public async getAddressByCEP(cep: string): Promise<AddressData> {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      
      if (cleanCEP.length !== 8) {
        throw new Error('CEP inválido');
      }

      const response = await axios.get<ViaCEPResponse>(
        `${this.baseURL}/${cleanCEP}/json/`
      );

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return this.formatResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('CEP não encontrado');
        }
        throw new Error('Erro ao buscar CEP');
      }
      throw error;
    }
  }

  private formatResponse(data: ViaCEPResponse): AddressData {
    return {
      cep: data.cep,
      street: data.logradouro,
      complement: data.complemento,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  }

  public static formatCEP(cep: string): string {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  public static validateCEP(cep: string): boolean {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
  }
}

export const viaCepService = new ViaCEPService();