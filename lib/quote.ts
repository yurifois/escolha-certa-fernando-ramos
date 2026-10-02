// Lógica do formulário de cotação → WhatsApp.
// Escrito pelo Jev (OpenRouter · typesafe/jev-router) e revisado/integrado pelo Claude.

export type ServiceSlug =
  | 'automovel'
  | 'residencial'
  | 'empresarial'
  | 'vida'
  | 'viagem'
  | 'condominial'
  | 'fianca'
  | 'saude'
  | 'odonto';

export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'chips'
  | 'multichips'
  | 'date'
  | 'textarea';

export type QuoteValues = Record<string, string | string[]>;

export type QuoteField = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
  inputMode?: 'text' | 'numeric' | 'tel';
  autoComplete?: string;
  showIf?: (v: QuoteValues) => boolean;
  validate?: (value: string, all: QuoteValues) => string | null;
  transform?: (value: string) => string;
  messageLabel?: string;
};

const TIME_ZONE = 'America/Sao_Paulo';
const MESSAGE_LIMIT = 1500;

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const VALID_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
]);

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const zonedFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function zonedParts(date: Date): ZonedParts {
  if (!Number.isFinite(date.getTime())) {
    throw new RangeError('Data inválida.');
  }

  const parts = zonedFormatter.formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const value = parts.find((part) => part.type === type)?.value;
    if (value === undefined) {
      throw new Error(`Parte da data indisponível: ${type}.`);
    }
    return Number(value);
  };

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function todayISO(now = new Date()): string {
  const { year, month, day } = zonedParts(now);
  return `${year}-${pad(month)}-${pad(day)}`;
}

function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function formatISODate(value: string): string {
  if (!isValidISODate(value)) return value;
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function stringValue(values: QuoteValues, id: string): string {
  const value = values[id];
  return typeof value === 'string' ? value : '';
}

function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[\s-]/g, '');
}

function validatePlate(value: string): string | null {
  const plate = normalizePlate(value);
  if (!plate) return null;
  return /^[A-Z]{3}(?:\d{4}|\d[A-Z]\d{2})$/.test(plate)
    ? null
    : 'Placa inválida. Use ABC1234 ou ABC1D23.';
}

function validateInteger(value: string): string | null {
  return /^\d+$/.test(value)
    ? null
    : 'Valor inválido. Informe um número inteiro.';
}

function validateAges(value: string): string | null {
  const ages = value.split(/[,;\n]/).map((age) => age.trim());

  if (
    ages.length === 0 ||
    ages.some((age) => !/^\d{1,3}$/.test(age) || Number(age) > 110)
  ) {
    return 'Idades inválidas. Separe idades de 0 a 110 por vírgulas.';
  }

  return null;
}

function validatePeopleAges(value: string, all: QuoteValues): string | null {
  const error = validateAges(value);
  if (error) return error;

  const count = stringValue(all, 'quantidade_pessoas').trim();
  if (!/^\d+$/.test(count)) return null;

  const ages = value.split(/[,;\n]/);
  return ages.length === Number(count)
    ? null
    : 'Quantidade diferente das idades. Informe uma idade por pessoa.';
}

// Valores monetários são números em reais, sem separador de milhar.
function normalizeMoney(value: string): string {
  return value.trim().replace(',', '.');
}

function validateDeparture(value: string): string | null {
  if (!isValidISODate(value)) {
    return 'Data inválida. Selecione uma data válida.';
  }

  return value >= todayISO()
    ? null
    : 'A ida já passou. Selecione hoje ou uma data futura.';
}

function validateReturn(value: string, all: QuoteValues): string | null {
  if (!isValidISODate(value)) {
    return 'Data inválida. Selecione uma data válida.';
  }

  const departure = stringValue(all, 'data_ida');
  if (isValidISODate(departure) && value < departure) {
    return 'A volta está antes da ida. Escolha a mesma data ou uma posterior.';
  }

  return null;
}

function peopleFields(): QuoteField[] {
  return [
    {
      id: 'quantidade_pessoas',
      label: 'Quantas pessoas?',
      type: 'number',
      required: true,
      placeholder: '3',
      min: 1,
      max: 10000,
      inputMode: 'numeric',
      validate: validateInteger,
      messageLabel: 'Pessoas',
    },
    {
      id: 'idades',
      label: 'Idades de cada pessoa',
      type: 'text',
      required: true,
      placeholder: '34, 32, 8',
      helper: 'Separe por vírgulas. Para bebês com menos de 1 ano, use 0.',
      maxLength: 200,
      validate: validatePeopleAges,
      messageLabel: 'Idades',
    },
  ];
}

function renewalMonth(showIf: (values: QuoteValues) => boolean): QuoteField {
  return {
    id: 'mes_vencimento',
    label: 'Mês de vencimento',
    type: 'select',
    required: true,
    options: MONTHS,
    showIf,
    messageLabel: 'Vencimento',
  };
}

export const QUOTE_FIELDS: Record<ServiceSlug, QuoteField[]> = {
  automovel: [
    {
      id: 'veiculo',
      label: 'Marca, modelo e ano',
      type: 'text',
      required: true,
      placeholder: 'Honda Civic 2021',
      maxLength: 100,
      messageLabel: 'Veículo',
    },
    {
      id: 'placa',
      label: 'Placa',
      type: 'text',
      placeholder: 'ABC1D23',
      helper: 'Opcional. Pode informar depois na conversa.',
      maxLength: 8,
      autoComplete: 'off',
      transform: normalizePlate,
      validate: validatePlate,
    },
    {
      id: 'pernoite',
      label: 'Onde o carro dorme?',
      type: 'text',
      required: true,
      placeholder: 'Asa Norte ou 70710-000',
      helper: 'Informe o bairro ou CEP.',
      maxLength: 100,
      messageLabel: 'Pernoite',
    },
    {
      id: 'idade_condutor',
      label: 'Idade do condutor principal',
      type: 'number',
      required: true,
      placeholder: '34',
      min: 0,
      max: 110,
      inputMode: 'numeric',
      validate: validateInteger,
      messageLabel: 'Idade do condutor principal',
    },
    {
      id: 'situacao',
      label: 'É um seguro novo ou renovação?',
      type: 'chips',
      required: true,
      options: ['Seguro novo', 'Renovação'],
      messageLabel: 'Situação',
    },
    renewalMonth((values) => values.situacao === 'Renovação'),
  ],

  residencial: [
    {
      id: 'tipo_imovel',
      label: 'Tipo de imóvel',
      type: 'chips',
      required: true,
      options: ['Casa', 'Apartamento', 'Casa em condomínio fechado'],
      messageLabel: 'Imóvel',
    },
    {
      id: 'ocupacao',
      label: 'Próprio ou alugado?',
      type: 'chips',
      required: true,
      options: ['Próprio', 'Alugado'],
      messageLabel: 'Ocupação',
    },
    {
      id: 'local_imovel',
      label: 'Bairro ou CEP do imóvel',
      type: 'text',
      required: true,
      placeholder: 'Águas Claras ou 71900-000',
      maxLength: 100,
      messageLabel: 'Local do imóvel',
    },
    {
      id: 'valor_imovel',
      label: 'Valor aproximado do imóvel',
      type: 'select',
      required: true,
      options: [
        'Até R$ 200 mil',
        'Acima de R$ 200 mil até R$ 400 mil',
        'Acima de R$ 400 mil até R$ 700 mil',
        'Acima de R$ 700 mil até R$ 1 milhão',
        'Acima de R$ 1 milhão até R$ 2 milhões',
        'Acima de R$ 2 milhões',
        'Não sei, quero orientação',
      ],
      helper: 'É uma referência inicial, não o capital final da apólice.',
      messageLabel: 'Valor do imóvel',
    },
    {
      id: 'coberturas',
      label: 'O que gostaria de incluir?',
      type: 'multichips',
      options: [
        'Roubo',
        'Danos elétricos',
        'Responsabilidade civil',
        'Outras coberturas',
        'Quero orientação',
      ],
      messageLabel: 'Coberturas de interesse',
    },
  ],

  empresarial: [
    {
      id: 'atividade',
      label: 'Ramo de atividade',
      type: 'text',
      required: true,
      placeholder: 'Restaurante, loja de roupas, escritório',
      maxLength: 100,
      messageLabel: 'Atividade',
    },
    {
      id: 'ocupacao',
      label: 'Imóvel próprio ou alugado?',
      type: 'chips',
      required: true,
      options: ['Próprio', 'Alugado'],
      messageLabel: 'Imóvel',
    },
    {
      id: 'faturamento',
      label: 'Faturamento mensal aproximado',
      type: 'select',
      options: [
        'Até R$ 30 mil',
        'Acima de R$ 30 mil até R$ 100 mil',
        'Acima de R$ 100 mil até R$ 300 mil',
        'Acima de R$ 300 mil até R$ 1 milhão',
        'Acima de R$ 1 milhão',
        'Prefiro informar na conversa',
      ],
      messageLabel: 'Faturamento mensal',
    },
    {
      id: 'protecao',
      label: 'O que quer proteger?',
      type: 'multichips',
      options: [
        'Imóvel',
        'Estoque e equipamentos',
        'Lucros cessantes',
        'Responsabilidade civil',
        'Frota',
        'Quero orientação',
      ],
      messageLabel: 'Proteções de interesse',
    },
  ],

  vida: [
    {
      id: 'idade',
      label: 'Sua idade',
      type: 'number',
      required: true,
      placeholder: '34',
      min: 0,
      max: 110,
      inputMode: 'numeric',
      validate: validateInteger,
      messageLabel: 'Idade',
    },
    {
      id: 'profissao',
      label: 'Profissão',
      type: 'text',
      required: true,
      placeholder: 'Professor, analista, empresário',
      maxLength: 100,
    },
    {
      id: 'capital',
      label: 'Valor de proteção desejado',
      type: 'select',
      required: true,
      options: [
        'Até R$ 100 mil',
        'Acima de R$ 100 mil até R$ 250 mil',
        'Acima de R$ 250 mil até R$ 500 mil',
        'Acima de R$ 500 mil até R$ 1 milhão',
        'Acima de R$ 1 milhão',
        'Não sei, quero orientação',
      ],
      messageLabel: 'Capital desejado',
    },
    {
      id: 'dependentes',
      label: 'Quem depende de você?',
      type: 'multichips',
      required: true,
      options: ['Cônjuge', 'Filhos', 'Pais', 'Outras pessoas', 'Ninguém'],
      validate: (value) =>
        value.split(', ').includes('Ninguém') && value !== 'Ninguém'
          ? 'Escolhas incompatíveis. Marque “Ninguém” sozinho ou selecione os dependentes.'
          : null,
      messageLabel: 'Dependentes',
    },
    {
      id: 'seguro_atual',
      label: 'Já possui seguro de vida?',
      type: 'chips',
      options: ['Sim', 'Não', 'Não sei'],
      messageLabel: 'Seguro de vida atual',
    },
  ],

  viagem: [
    {
      id: 'destino',
      label: 'País ou região de destino',
      type: 'text',
      required: true,
      placeholder: 'Portugal e Espanha',
      maxLength: 100,
      messageLabel: 'Destino',
    },
    {
      id: 'data_ida',
      label: 'Data de ida',
      type: 'date',
      required: true,
      validate: validateDeparture,
      messageLabel: 'Ida',
    },
    {
      id: 'data_volta',
      label: 'Data de volta',
      type: 'date',
      required: true,
      validate: validateReturn,
      messageLabel: 'Volta',
    },
    ...peopleFields(),
    {
      id: 'motivo',
      label: 'Motivo da viagem',
      type: 'chips',
      required: true,
      options: ['Lazer', 'Trabalho', 'Estudo', 'Intercâmbio'],
      messageLabel: 'Motivo',
    },
    {
      id: 'atividades_risco',
      label: 'Esportes ou atividades de risco?',
      type: 'chips',
      options: ['Sim', 'Não', 'Ainda não sei'],
      messageLabel: 'Atividades de risco',
    },
  ],

  condominial: [
    {
      id: 'nome_condominio',
      label: 'Nome do condomínio',
      type: 'text',
      placeholder: 'Residencial Parque das Flores',
      maxLength: 100,
      messageLabel: 'Condomínio',
    },
    {
      id: 'local_condominio',
      label: 'Bairro ou CEP',
      type: 'text',
      required: true,
      placeholder: 'Sudoeste ou 70680-000',
      maxLength: 100,
      messageLabel: 'Local do condomínio',
    },
    {
      id: 'unidades',
      label: 'Número de unidades',
      type: 'number',
      required: true,
      placeholder: '48',
      min: 1,
      max: 10000,
      inputMode: 'numeric',
      validate: validateInteger,
      messageLabel: 'Unidades',
    },
    {
      id: 'tipo_condominio',
      label: 'Tipo de condomínio',
      type: 'chips',
      required: true,
      options: ['Residencial', 'Comercial', 'Misto'],
      messageLabel: 'Tipo',
    },
    {
      id: 'apolice_vigente',
      label: 'Tem apólice vigente?',
      type: 'chips',
      options: ['Sim', 'Não', 'Não sei'],
      messageLabel: 'Apólice vigente',
    },
    renewalMonth((values) => values.apolice_vigente === 'Sim'),
  ],

  fianca: [
    {
      id: 'papel',
      label: 'Você é',
      type: 'chips',
      required: true,
      options: ['Inquilino', 'Proprietário', 'Imobiliária'],
      messageLabel: 'Solicitante',
    },
    {
      id: 'aluguel',
      label: 'Valor mensal do aluguel (R$)',
      type: 'number',
      required: true,
      placeholder: '2500',
      helper: 'Sem separador de milhar. Ex.: 2500 ou 2500,50.',
      min: 0.01,
      max: 100000000,
      transform: normalizeMoney,
      messageLabel: 'Aluguel mensal (R$)',
    },
    {
      id: 'encargos',
      label: 'Condomínio + IPTU mensal (R$)',
      type: 'number',
      placeholder: '650',
      helper: 'Opcional. Informe o total mensal, sem separador de milhar.',
      min: 0,
      max: 100000000,
      transform: normalizeMoney,
      messageLabel: 'Condomínio + IPTU mensal (R$)',
    },
    {
      id: 'cidade_imovel',
      label: 'Cidade do imóvel',
      type: 'text',
      required: true,
      placeholder: 'Brasília',
      maxLength: 100,
      messageLabel: 'Cidade do imóvel',
    },
    {
      id: 'prazo',
      label: 'Quando pretende fechar?',
      type: 'chips',
      options: ['Urgente', 'Até 15 dias', 'Sem pressa'],
      messageLabel: 'Prazo',
    },
  ],

  saude: [
    {
      id: 'tipo_plano',
      label: 'Tipo de contratação',
      type: 'chips',
      required: true,
      options: [
        'Individual',
        'Familiar',
        'Empresarial (PME)',
        'Por adesão',
      ],
      messageLabel: 'Contratação',
    },
    {
      id: 'cnpj',
      label: 'CNPJ',
      type: 'text',
      placeholder: '12.345.678/0001-90',
      helper: 'Opcional. Pode informar na conversa.',
      maxLength: 18,
      autoComplete: 'off',
      showIf: (values) => values.tipo_plano === 'Empresarial (PME)',
      messageLabel: 'CNPJ informado',
    },
    ...peopleFields(),
    {
      id: 'cidade_residencia',
      label: 'Cidade de residência',
      type: 'text',
      required: true,
      placeholder: 'Brasília',
      maxLength: 100,
      messageLabel: 'Cidade de residência',
    },
    {
      id: 'plano_atual',
      label: 'Já tem plano de saúde?',
      type: 'chips',
      options: ['Sim', 'Não'],
      messageLabel: 'Plano atual',
    },
    {
      id: 'operadora_atual',
      label: 'Operadora atual',
      type: 'text',
      placeholder: 'Amil, Unimed, SulAmérica',
      maxLength: 80,
      showIf: (values) => values.plano_atual === 'Sim',
      messageLabel: 'Operadora atual',
    },
    {
      id: 'preferencia',
      label: 'Sua principal preferência',
      type: 'chips',
      options: ['Melhor custo', 'Hospital ou rede específica', 'Quero orientação'],
      messageLabel: 'Preferência',
    },
    {
      id: 'rede_preferida',
      label: 'Qual hospital ou rede?',
      type: 'text',
      placeholder: 'Hospital Santa Lúcia',
      maxLength: 100,
      showIf: (values) => values.preferencia === 'Hospital ou rede específica',
      messageLabel: 'Rede desejada',
    },
  ],

  odonto: [
    ...peopleFields(),
    {
      id: 'tipo_plano',
      label: 'Tipo de contratação',
      type: 'chips',
      required: true,
      options: ['Individual', 'Familiar', 'Empresarial'],
      messageLabel: 'Contratação',
    },
    {
      id: 'cidade_atendimento',
      label: 'Cidade de atendimento',
      type: 'text',
      required: true,
      placeholder: 'Brasília',
      maxLength: 100,
      messageLabel: 'Cidade de atendimento',
    },
    {
      id: 'plano_atual',
      label: 'Já tem plano odontológico?',
      type: 'chips',
      options: ['Sim', 'Não'],
      messageLabel: 'Plano atual',
    },
    {
      id: 'ortodontia',
      label: 'Precisa de ortodontia?',
      type: 'chips',
      options: ['Sim', 'Não', 'Não sei'],
      messageLabel: 'Ortodontia',
    },
  ],
};

export const CONTACT_FIELDS: QuoteField[] = [
  {
    id: 'nome',
    label: 'Seu nome',
    type: 'text',
    required: true,
    placeholder: 'Maria Souza',
    min: 2,
    maxLength: 100,
    autoComplete: 'name',
    transform: (value) => value.trim().replace(/\s+/g, ' '),
    validate: (value) =>
      /\p{N}/u.test(value)
        ? 'O nome contém números. Informe seu nome sem números.'
        : !/\p{L}/u.test(value)
          ? 'Nome inválido. Informe seu nome com letras.'
          : null,
    messageLabel: 'Nome',
  },
  {
    id: 'whatsapp',
    label: 'Seu WhatsApp',
    type: 'text',
    required: true,
    placeholder: '(61) 98765-4321',
    inputMode: 'tel',
    autoComplete: 'tel',
    transform: maskPhone,
    validate: (value) =>
      isValidPhone(value)
        ? null
        : 'WhatsApp inválido. Informe DDD válido e celular com 9 dígitos.',
    messageLabel: 'WhatsApp',
  },
  {
    id: 'cidade',
    label: 'Sua cidade',
    type: 'text',
    required: true,
    placeholder: 'Brasília',
    maxLength: 100,
    autoComplete: 'address-level2',
    messageLabel: 'Cidade',
  },
  {
    id: 'observacoes',
    label: 'Algo mais que devo saber?',
    type: 'textarea',
    placeholder: 'Quero comparar franquias.',
    helper: 'Opcional. Não informe dados de saúde ou outros dados sensíveis.',
    maxLength: 300,
    messageLabel: 'Observações',
  },
];

// QuoteField não possui propriedade default; use na inicialização do estado.
export const CONTACT_DEFAULTS: QuoteValues = {
  nome: '',
  whatsapp: '',
  cidade: 'Brasília',
  observacoes: '',
};

function phoneDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  if (digits.startsWith('0055') && digits.length > 11) {
    digits = digits.slice(4);
  } else if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2);
  }

  return digits;
}

export function maskPhone(raw: string): string {
  const digits = phoneDigits(raw).slice(0, 11);

  if (!digits) return '';
  if (digits.length < 3) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const local = digits.slice(2);

  if (local.length <= 5) return `(${ddd}) ${local}`;
  return `(${ddd}) ${local.slice(0, 5)}-${local.slice(5)}`;
}

export function isValidPhone(masked: string): boolean {
  const digits = phoneDigits(masked);
  return (
    /^\d{2}9\d{8}$/.test(digits) &&
    VALID_DDDS.has(digits.slice(0, 2))
  );
}

export function sanitize(text: string): string {
  return text
    .replace(/[*_~]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizedValue(
  field: QuoteField,
  value: string | string[] | undefined,
): string | string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  const text = (value ?? '').trim();
  return field.transform ? field.transform(text).trim() : text;
}

export function validateField(
  field: QuoteField,
  value: string | string[] | undefined,
  all: QuoteValues,
): string | null {
  if (field.showIf && !field.showIf(all)) return null;

  const normalized = normalizedValue(field, value);
  const isArray = Array.isArray(normalized);
  const text = isArray ? normalized.join(', ') : normalized;

  if (!text) {
    return field.required
      ? field.type === 'multichips'
        ? 'Nenhuma opção selecionada. Escolha pelo menos uma.'
        : field.type === 'chips' || field.type === 'select'
          ? 'Nenhuma opção selecionada. Escolha uma opção.'
          : 'Campo não preenchido. Informe este dado para continuar.'
      : null;
  }

  if (field.type === 'multichips' && !isArray) {
    return 'Seleção inválida. Escolha as opções disponíveis.';
  }

  if (field.type !== 'multichips' && isArray) {
    return 'Valor inválido. Informe apenas um valor neste campo.';
  }

  if (field.maxLength !== undefined && text.length > field.maxLength) {
    return `Texto muito longo. Use até ${field.maxLength} caracteres.`;
  }

  if (field.options) {
    const selected = isArray ? normalized : [text];
    if (selected.some((option) => !field.options?.includes(option))) {
      return 'Opção inválida. Escolha uma das opções disponíveis.';
    }
  }

  if (field.type === 'number') {
    if (!/^[+-]?\d+(?:[.,]\d+)?$/.test(text)) {
      return 'Número inválido. Use apenas números, sem separador de milhar.';
    }

    const number = Number(text.replace(',', '.'));
    if (!Number.isFinite(number)) {
      return 'Número inválido. Informe um valor numérico válido.';
    }
    if (field.min !== undefined && number < field.min) {
      return `Valor abaixo do mínimo. Informe ${field.min} ou mais.`;
    }
    if (field.max !== undefined && number > field.max) {
      return `Valor acima do máximo. Informe até ${field.max}.`;
    }
  } else {
    if (field.min !== undefined && text.length < field.min) {
      return `Texto muito curto. Use pelo menos ${field.min} caracteres.`;
    }
    if (field.max !== undefined && text.length > field.max) {
      return `Texto muito longo. Use até ${field.max} caracteres.`;
    }
  }

  if (field.type === 'date' && !isValidISODate(text)) {
    return 'Data inválida. Selecione uma data válida.';
  }

  const transformedValues: QuoteValues = {
    ...all,
    [field.id]: normalized,
  };

  return field.validate?.(text, transformedValues) ?? null;
}

export function validateStep(
  fields: QuoteField[],
  values: QuoteValues,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const normalized: QuoteValues = { ...values };

  for (const field of fields) {
    normalized[field.id] = normalizedValue(field, values[field.id]);
  }

  for (const field of fields) {
    const error = validateField(field, normalized[field.id], normalized);
    if (error) errors[field.id] = error;
  }

  return errors;
}

export type WhatsAppMessageParams = {
  serviceLabel: string;
  serviceFields: QuoteField[];
  contactFields: QuoteField[];
  values: QuoteValues;
  profile?: string;
  now?: Date;
};

function fieldMessageValue(field: QuoteField, values: QuoteValues): string {
  if (field.showIf && !field.showIf(values)) return '';

  const value = normalizedValue(field, values[field.id]);
  if (Array.isArray(value)) {
    return value.map(sanitize).filter(Boolean).join(', ');
  }

  return sanitize(field.type === 'date' ? formatISODate(value) : value);
}

function messageLine(label: string, value: string): string {
  return `*${sanitize(label)}:* ${value}`;
}

export function buildWhatsAppMessage({
  serviceLabel,
  serviceFields,
  contactFields,
  values,
  profile,
  now = new Date(),
}: WhatsAppMessageParams): string {
  const normalized: QuoteValues = { ...values };

  for (const field of [...serviceFields, ...contactFields]) {
    normalized[field.id] = normalizedValue(field, values[field.id]);
  }

  const serviceLines = [
    messageLine('Seguro', sanitize(serviceLabel)),
  ];

  if (profile && sanitize(profile)) {
    serviceLines.push(messageLine('Perfil', sanitize(profile)));
  }

  for (const field of serviceFields) {
    const value = fieldMessageValue(field, normalized);
    if (value) {
      serviceLines.push(messageLine(field.messageLabel ?? field.label, value));
    }
  }

  const contactLines: string[] = [];
  let observationLabel = 'Observações';
  let observations = '';

  for (const field of contactFields) {
    const value = fieldMessageValue(field, normalized);
    if (!value) continue;

    if (field.id === 'observacoes') {
      observationLabel = field.messageLabel ?? field.label;
      observations = value;
    } else {
      contactLines.push(messageLine(field.messageLabel ?? field.label, value));
    }
  }

  const { year, month, day, hour, minute } = zonedParts(now);
  const timestamp =
    `Enviado pelo site em ${pad(day)}/${pad(month)}/${year}, ` +
    `${pad(hour)}:${pad(minute)}`;

  const assemble = (observationText: string): string => {
    const blocks = [
      'Olá, Fernando! Vim pelo site da Escolha Certa e quero uma cotação.',
      serviceLines.join('\n'),
    ];

    if (contactLines.length) blocks.push(contactLines.join('\n'));
    if (observationText) {
      blocks.push(messageLine(observationLabel, observationText));
    }
    blocks.push(timestamp);

    return blocks.join('\n\n');
  };

  const fullMessage = assemble(observations);
  if (fullMessage.length <= MESSAGE_LIMIT) return fullMessage;

  if (observations) {
    const withoutObservations = assemble('');
    const overhead = messageLine(observationLabel, '').length + 2;
    const available = MESSAGE_LIMIT - withoutObservations.length - overhead;

    if (available >= 1) {
      const shortened = observations.slice(0, available - 1).trimEnd() + '…';
      return assemble(shortened);
    }
  }

  // Não apaga silenciosamente outros dados para caber no limite.
  const withoutObservations = assemble('');
  if (withoutObservations.length > MESSAGE_LIMIT) {
    throw new RangeError(
      'Mensagem muito longa. Reduza os detalhes para até 1500 caracteres.',
    );
  }

  return withoutObservations;
}

export function buildWhatsAppUrl(
  message: string,
  phone = '5561991740511',
): string {
  const digits = phone.replace(/\D/g, '');

  if (!/^[1-9]\d{6,14}$/.test(digits)) {
    throw new RangeError('Telefone de destino inválido. Inclua o código do país.');
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function isOpenNow(
  now = new Date(),
): { open: boolean; label: string } {
  const { year, month, day, hour, minute } = zonedParts(now);

  // UTC aqui representa apenas o calendário local, sem conversão de horário.
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = calendarDate.getUTCDay();
  const minutes = hour * 60 + minute;
  const closingHour = weekday === 6 ? 13 : 18;
  const workingDay = weekday >= 1 && weekday <= 6;

  if (workingDay && minutes >= 9 * 60 && minutes < closingHour * 60) {
    return {
      open: true,
      label: `Atendendo agora · até ${closingHour}h`,
    };
  }

  if (workingDay && minutes < 9 * 60) {
    return {
      open: false,
      label: 'Fechado agora · volto hoje às 9h',
    };
  }

  const weekdayNames = [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado',
  ];

  for (let offset = 1; offset <= 7; offset += 1) {
    const next = new Date(Date.UTC(year, month - 1, day + offset));
    const nextWeekday = next.getUTCDay();

    if (nextWeekday !== 0) {
      const nextName =
        offset === 1 ? 'amanhã' : (weekdayNames[nextWeekday] ?? 'no próximo dia útil');
      return {
        open: false,
        label: `Fechado agora · volto ${nextName} às 9h`,
      };
    }
  }

  return {
    open: false,
    label: 'Fechado agora · volto no próximo dia útil às 9h',
  };
}
