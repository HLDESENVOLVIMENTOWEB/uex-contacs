// Rotas da aplicação
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CONTACTS: '/contacts',
    PROFILE: '/profile',
  } as const;
  
  // Chaves de localStorage
  export const STORAGE_KEYS = {
    USERS: 'users',
    CURRENT_USER: 'currentUser',
    CONTACTS: 'contacts',
    THEME: 'theme',
  } as const;

  export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  
  // Estados brasileiros
  export const ESTADOS_BRASILEIROS = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' },
  ] as const;
  
  // Configurações de validação
  export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 3,
    PHONE_LENGTH: 11,
    CEP_LENGTH: 8,
  } as const;
  
  // Mensagens de erro
  export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'Campo obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PASSWORD: 'Senha deve ter no mínimo 6 caracteres',
    INVALID_CPF: 'CPF inválido',
    INVALID_PHONE: 'Telefone inválido',
    INVALID_CEP: 'CEP inválido',
    EMAIL_IN_USE: 'Email já cadastrado',
    WRONG_CREDENTIALS: 'Email ou senha incorretos',
    SERVER_ERROR: 'Erro no servidor',
    NETWORK_ERROR: 'Erro de conexão',
  } as const;
  
  // Configurações de paginação
  export const PAGINATION = {
    ITEMS_PER_PAGE: 10,
    MAX_PAGES_SHOWN: 5,
  } as const;
  
  // Configurações de mapa
  export const MAP_CONFIG = {
    DEFAULT_CENTER: {
      lat: -14.235004,
      lng: -51.92528,
    },
    DEFAULT_ZOOM: 4,
    MARKER_ZOOM: 15,
  } as const;
  
  // Regex patterns
  export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\(\d{2}\) \d{5}-\d{4}$/,
    CEP: /^\d{5}-\d{3}$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  } as const;
  
  // Temas da aplicação
  export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
  } as const;
  
  // Status de operações
  export const OPERATION_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading',
    IDLE: 'idle',
  } as const;
  
  // Tipos de ordenação
  export const SORT_TYPES = {
    NAME_ASC: { field: 'name', order: 'asc' as const },
    NAME_DESC: { field: 'name', order: 'desc' as const },
    DATE_ASC: { field: 'createdAt', order: 'asc' as const },
    DATE_DESC: { field: 'createdAt', order: 'desc' as const },
  } as const;
  
  // Configurações de API
  export const API_CONFIG = {
    VIACEP_BASE_URL: 'https://viacep.com.br/ws',
    TIMEOUT: 5000,
  } as const;