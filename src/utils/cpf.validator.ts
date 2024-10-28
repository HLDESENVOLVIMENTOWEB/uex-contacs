/**
 * Limpa o CPF removendo qualquer caractere que não seja número
 */
const cleanCPF = (cpf: string): string => {
    return cpf.replace(/\D/g, '');
  };
  
  /**
   * Verifica se o CPF tem 11 dígitos e não é uma sequência repetida
   */
  const isValidFormat = (cpf: string): boolean => {
    if (cpf.length !== 11) return false;
  
    // Verifica se não é uma sequência de números iguais
    const invalidSequences = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999'
    ];
  
    return !invalidSequences.includes(cpf);
  };
  
  /**
   * Calcula o dígito verificador do CPF
   */
  const calculateDigit = (slice: string): number => {
    let sum = 0;
    let multiplier = slice.length + 1;
  
    // Para cada dígito do CPF
    for (const digit of slice) {
      sum += parseInt(digit) * multiplier;
      multiplier--;
    }
  
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  
  /**
   * Valida os dígitos verificadores do CPF
   */
  const validateVerifierDigits = (cpf: string): boolean => {
    // Valida o primeiro dígito verificador
    const firstSlice = cpf.slice(0, 9);
    const firstVerifier = calculateDigit(firstSlice);
    if (parseInt(cpf[9]) !== firstVerifier) return false;
  
    // Valida o segundo dígito verificador
    const secondSlice = cpf.slice(0, 10);
    const secondVerifier = calculateDigit(secondSlice);
    if (parseInt(cpf[10]) !== secondVerifier) return false;
  
    return true;
  };
  
  /**
   * Formata um CPF para exibição (XXX.XXX.XXX-XX)
   */
  export const formatCPF = (cpf: string): string => {
    const cleaned = cleanCPF(cpf);
    if (cleaned.length !== 11) return cpf;
    
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  /**
   * Valida um CPF
   * @param cpf string - CPF a ser validado (pode incluir pontos e traços)
   * @returns boolean - true se o CPF é válido, false caso contrário
   */
  export const validateCPF = (cpf: string): boolean => {
    // Limpa o CPF, deixando apenas números
    const cleanedCPF = cleanCPF(cpf);
  
    // Verifica formato básico
    if (!isValidFormat(cleanedCPF)) {
      return false;
    }
  
    // Valida dígitos verificadores
    return validateVerifierDigits(cleanedCPF);
  };
  
  /**
   * Gera um CPF válido (útil para testes)
   * @returns string - CPF válido formatado
   */
  export const generateValidCPF = (): string => {
    // Gera 9 números aleatórios
    const numbers = Array.from({ length: 9 }, () => 
      Math.floor(Math.random() * 10)
    ).join('');
  
    // Calcula os dígitos verificadores
    const firstDigit = calculateDigit(numbers);
    const secondDigit = calculateDigit(numbers + firstDigit);
  
    // Monta o CPF completo
    const cpf = numbers + firstDigit + secondDigit;
  
    // Retorna formatado
    return formatCPF(cpf);
  };
  
  /**
   * Exemplo de uso:
   * 
   * // Validar CPF
   * const isValid = validateCPF('123.456.789-09');
   * 
   * // Formatar CPF
   * const formatted = formatCPF('12345678909');
   * 
   * // Gerar CPF válido
   * const newCPF = generateValidCPF();
   */