import type { ServiceSlug } from "./quote";

export type ProfileId = "tudo" | "mim" | "familia" | "negocio";
export type IconKey =
  | "car"
  | "home"
  | "briefcase"
  | "heart"
  | "plane"
  | "building"
  | "key"
  | "stethoscope"
  | "smile";

export type Service = {
  slug: ServiceSlug;
  title: string;
  short: string; // nome curto para chips e mensagens
  icon: IconKey;
  tagline: string; // frase de uma linha dos cards (copy do Jev)
  promise: string; // linha de promessa no hero da página do serviço
  intro: string;
  forWho: string[];
  covered: string[];
  usuallyOut: string[];
  faq: { q: string; a: string }[];
  insurers: string[]; // ids de lib/partners.ts
};

export const SERVICES: Service[] = [
  {
    slug: "automovel",
    title: "Seguro Automóvel",
    short: "Automóvel",
    icon: "car",
    tagline: "Cobertura de verdade, franquia que cabe no bolso.",
    promise: "Compare seguradoras e entenda franquia, cobertura e assistência antes de decidir.",
    intro:
      "O seguro do carro é o que mais pesa no dia ruim: batida, roubo, pane na estrada. Comparo propostas de várias seguradoras para o seu perfil e explico o que muda de uma para outra além do preço.",
    forWho: [
      "Quem acabou de comprar um carro, novo ou usado",
      "Quem vai renovar e quer saber se está pagando o justo",
      "Motoristas de aplicativo e uso profissional (consulte condições)",
      "Famílias com mais de um condutor",
    ],
    covered: [
      "Colisão, incêndio, roubo e furto",
      "Danos materiais e corporais a terceiros",
      "Assistência 24h: guincho, chaveiro, pane seca",
      "Carro reserva",
      "Vidros, faróis, lanternas e retrovisores",
      "Acidentes pessoais de passageiros",
    ],
    usuallyOut: [
      "Desgaste natural e manutenção",
      "Condutor sem habilitação ou sob efeito de álcool",
      "Uso diferente do declarado na contratação",
    ],
    faq: [
      {
        q: "O que é franquia?",
        a: "É a parte do prejuízo que fica com você quando o conserto é parcial. Franquia menor costuma deixar o seguro mais caro, e vice-versa. Mostro as opções lado a lado.",
      },
      {
        q: "Meu bônus vai junto se eu trocar de seguradora?",
        a: "Em geral, sim. A classe de bônus acompanha você na renovação, desde que não haja interrupção longa entre as apólices.",
      },
      {
        q: "Preciso da placa para cotar?",
        a: "Não é obrigatório. Com marca, modelo, ano e o CEP onde o carro dorme já dá para começar.",
      },
    ],
    insurers: ["porto-seguro", "azul-seguros", "hdi", "tokio-marine", "allianz", "bradesco-seguros", "itau", "msig", "sura"],
  },
  {
    slug: "residencial",
    title: "Seguro Residencial",
    short: "Residencial",
    icon: "home",
    tagline: "Do incêndio ao vazamento que ninguém esperava.",
    promise: "Proteção para a casa e o que está dentro dela, com assistência para o dia a dia.",
    intro:
      "É um dos seguros com melhor custo-benefício que existem, e um dos menos contratados. Além de proteger o imóvel e os bens, costuma incluir assistências úteis como chaveiro, encanador e eletricista.",
    forWho: [
      "Quem mora de aluguel e quer proteger os próprios bens",
      "Proprietários de casa ou apartamento",
      "Quem trabalha em casa com equipamentos de valor",
      "Casas de veraneio e imóveis com pouca ocupação",
    ],
    covered: [
      "Incêndio, raio e explosão",
      "Roubo e furto qualificado",
      "Danos elétricos",
      "Vendaval, ciclone e granizo",
      "Responsabilidade civil familiar",
      "Quebra de vidros",
      "Assistência 24h para a residência",
    ],
    usuallyOut: [
      "Desgaste e falta de manutenção",
      "Objetos de valor não declarados (joias, obras de arte)",
      "Danos causados de propósito",
    ],
    faq: [
      {
        q: "Moro de aluguel. Posso contratar?",
        a: "Pode. Você protege os seus bens e a responsabilidade civil, mesmo sem ser dono do imóvel.",
      },
      {
        q: "O condomínio já não tem seguro?",
        a: "O seguro do condomínio cobre as áreas comuns e a estrutura. O que está dentro do seu apartamento fica de fora.",
      },
      {
        q: "As assistências valem a pena?",
        a: "Para muita gente, sim: chaveiro, encanador e eletricista costumam estar incluídos e são usados no dia a dia.",
      },
    ],
    insurers: ["porto-seguro", "bradesco-seguros", "sulamerica", "allianz", "tokio-marine", "hdi", "azul-seguros"],
  },
  {
    slug: "empresarial",
    title: "Seguro Empresarial",
    short: "Empresarial",
    icon: "briefcase",
    tagline: "Proteja o patrimônio e a continuidade do negócio.",
    promise: "Coberturas ajustadas ao seu ramo, do imóvel ao faturamento que para quando algo dá errado.",
    intro:
      "Um incêndio, um roubo ou um dano elétrico pode parar a operação por semanas. O seguro empresarial protege o patrimônio e, com lucros cessantes, ajuda a manter o caixa enquanto tudo volta ao normal.",
    forWho: [
      "Comércios, escritórios e consultórios",
      "Pequenas e médias indústrias",
      "Empresas com estoque ou equipamentos de valor",
      "Negócios que recebem clientes no local",
    ],
    covered: [
      "Incêndio, raio e explosão",
      "Roubo e furto qualificado",
      "Danos elétricos e equipamentos eletrônicos",
      "Vendaval, ciclone e granizo",
      "Responsabilidade civil de operações",
      "Lucros cessantes",
      "Quebra de vidros",
    ],
    usuallyOut: [
      "Atividades não declaradas na proposta",
      "Desgaste e falta de manutenção",
      "Perdas sem comprovação documental",
    ],
    faq: [
      {
        q: "O que é lucros cessantes?",
        a: "É a cobertura que indeniza o que a empresa deixa de faturar enquanto fica parada por um sinistro coberto.",
      },
      {
        q: "MEI pode contratar?",
        a: "Pode. Há produtos pensados para pequenos negócios, com coberturas enxutas e preço acessível.",
      },
      {
        q: "O imóvel é alugado. Faz sentido?",
        a: "Faz. Você protege o conteúdo, os equipamentos, o estoque e a responsabilidade civil do negócio.",
      },
    ],
    insurers: ["porto-seguro", "allianz", "tokio-marine", "hdi", "msig", "bradesco-seguros"],
  },
  {
    slug: "vida",
    title: "Seguro de Vida",
    short: "Vida",
    icon: "heart",
    tagline: "Tranquilidade para quem depende de você.",
    promise: "Um capital pensado para a sua família, com coberturas que também protegem você em vida.",
    intro:
      "Seguro de vida não é só para depois. Muitas apólices cobrem invalidez, doenças graves e diárias por incapacidade, ou seja, protegem você enquanto está aqui. Ajudo a calcular um capital que faça sentido.",
    forWho: [
      "Quem tem filhos, cônjuge ou pais que dependem da sua renda",
      "Autônomos e profissionais liberais",
      "Quem tem financiamento ou dívidas de longo prazo",
      "Sócios de empresas",
    ],
    covered: [
      "Morte natural e acidental",
      "Invalidez permanente por acidente",
      "Invalidez funcional por doença",
      "Diagnóstico de doenças graves",
      "Assistência funeral",
      "Diárias por incapacidade temporária",
    ],
    usuallyOut: [
      "Doenças preexistentes não declaradas",
      "Atos intencionais nos primeiros dois anos",
      "Esportes de risco não informados",
    ],
    faq: [
      {
        q: "Quanto de capital eu preciso?",
        a: "Uma referência comum é cobrir alguns anos da renda que sua família perderia. Fazemos essa conta juntos, sem fórmula pronta.",
      },
      {
        q: "O valor entra em inventário?",
        a: "Não. A indenização do seguro de vida vai direto para os beneficiários.",
      },
      {
        q: "Posso mudar os beneficiários depois?",
        a: "Pode, a qualquer momento, com uma solicitação à seguradora.",
      },
    ],
    insurers: ["bradesco-seguros", "itau", "sulamerica", "porto-seguro", "allianz", "tokio-marine"],
  },
  {
    slug: "viagem",
    title: "Seguro Viagem",
    short: "Viagem",
    icon: "plane",
    tagline: "Assistência médica fora de casa, sem susto.",
    promise: "Cobertura médica e assistência 24h, no Brasil e no exterior, do tamanho da sua viagem.",
    intro:
      "Uma consulta simples no exterior pode custar caro. O seguro viagem cobre despesas médicas, bagagem e imprevistos, e é exigido para entrar em vários países, inclusive na Europa.",
    forWho: [
      "Viagens a lazer, nacionais e internacionais",
      "Viagens a trabalho",
      "Intercâmbio e estudos",
      "Gestantes, idosos e quem pratica esportes (consulte condições)",
    ],
    covered: [
      "Despesas médicas e hospitalares",
      "Despesas odontológicas de emergência",
      "Traslado médico e regresso sanitário",
      "Extravio de bagagem",
      "Cancelamento de viagem",
      "Assistência 24h em português",
    ],
    usuallyOut: [
      "Tratamentos eletivos ou já planejados",
      "Doenças preexistentes sem cobertura contratada",
      "Esportes radicais não informados",
    ],
    faq: [
      {
        q: "É obrigatório para a Europa?",
        a: "Para os países do Espaço Schengen, sim, com cobertura médica mínima de 30 mil euros.",
      },
      {
        q: "Cartão de crédito já não cobre?",
        a: "Alguns cartões oferecem, mas com limites e regras específicas. Vale comparar antes de confiar só nele.",
      },
      {
        q: "Com quanta antecedência devo contratar?",
        a: "O ideal é logo após comprar a passagem, para incluir a cobertura de cancelamento.",
      },
    ],
    insurers: ["porto-seguro", "sulamerica", "allianz"],
  },
  {
    slug: "condominial",
    title: "Seguro Condominial",
    short: "Condominial",
    icon: "building",
    tagline: "Obrigatório por lei e essencial na prática.",
    promise: "Proteção para a estrutura e as áreas comuns, com responsabilidade civil do síndico.",
    intro:
      "Todo condomínio é obrigado por lei a ter seguro da edificação. A diferença está nas coberturas adicionais e no atendimento quando algo acontece. Ajudo síndicos e administradoras a comparar.",
    forWho: [
      "Síndicos e conselhos de condomínio",
      "Administradoras",
      "Condomínios residenciais, comerciais e mistos",
      "Condomínios horizontais",
    ],
    covered: [
      "Incêndio, raio e explosão",
      "Danos elétricos",
      "Vendaval, ciclone e granizo",
      "Responsabilidade civil do condomínio",
      "Responsabilidade civil do síndico",
      "Quebra de vidros",
      "Assistência 24h",
    ],
    usuallyOut: [
      "Bens dentro das unidades privativas",
      "Desgaste e falta de manutenção",
      "Obras sem projeto aprovado",
    ],
    faq: [
      {
        q: "O seguro condominial é obrigatório?",
        a: "Sim. O Código Civil e a Lei 4.591/64 exigem seguro contra incêndio ou destruição da edificação.",
      },
      {
        q: "Cobre o apartamento dos moradores?",
        a: "Não. Ele cobre a estrutura e as áreas comuns. Para o conteúdo de cada unidade, o ideal é o seguro residencial.",
      },
      {
        q: "O síndico responde pessoalmente por falhas?",
        a: "Pode responder. Por isso a cobertura de responsabilidade civil do síndico é tão importante.",
      },
    ],
    insurers: ["porto-seguro", "sulamerica", "allianz", "hdi", "tokio-marine"],
  },
  {
    slug: "fianca",
    title: "Fiança Locatícia",
    short: "Fiança Locatícia",
    icon: "key",
    tagline: "Alugue sem fiador e sem depósito caução.",
    promise: "A garantia que substitui o fiador e destrava a locação para inquilino e proprietário.",
    intro:
      "Conseguir um fiador é um dos maiores obstáculos para alugar. O seguro fiança substitui essa exigência e garante ao proprietário o pagamento do aluguel e dos encargos em caso de inadimplência.",
    forWho: [
      "Inquilinos que não têm fiador",
      "Proprietários que querem mais segurança",
      "Imobiliárias",
      "Locações residenciais e comerciais",
    ],
    covered: [
      "Aluguel em caso de inadimplência",
      "Encargos: condomínio, IPTU, água e luz (conforme contratação)",
      "Danos ao imóvel (cobertura adicional)",
      "Multa por rescisão (cobertura adicional)",
      "Pintura interna e externa (cobertura adicional)",
    ],
    usuallyOut: [
      "Débitos anteriores à contratação",
      "Valores não previstos no contrato de locação",
    ],
    faq: [
      {
        q: "Quem paga o seguro fiança?",
        a: "Normalmente o inquilino, mas o pagamento pode ser negociado entre as partes.",
      },
      {
        q: "A aprovação demora?",
        a: "Costuma ser rápida. A seguradora analisa o cadastro e a renda do pretendente.",
      },
      {
        q: "Posso usar para imóvel comercial?",
        a: "Pode. Há produtos para locação residencial e comercial.",
      },
    ],
    insurers: ["porto-seguro", "bradesco-seguros", "itau"],
  },
  {
    slug: "saude",
    title: "Plano de Saúde",
    short: "Plano de Saúde",
    icon: "stethoscope",
    tagline: "Rede, carência e reajuste explicados com clareza.",
    promise: "Planos individuais, familiares e empresariais, comparados pela rede que você realmente usa.",
    intro:
      "Escolher plano de saúde pelo preço costuma sair caro. O que importa é se os hospitais e médicos que você usa estão na rede, como funcionam carências e reajustes. Faço essa comparação com você.",
    forWho: [
      "Famílias e pessoas físicas",
      "Empresas, inclusive MEI e PME",
      "Quem quer trocar de plano com portabilidade de carências",
      "Profissionais com acesso a planos por adesão",
    ],
    covered: [
      "Consultas e exames",
      "Internações e cirurgias",
      "Urgência e emergência",
      "Terapias e tratamentos previstos no rol da ANS",
      "Opções com ou sem coparticipação",
    ],
    usuallyOut: [
      "Procedimentos estéticos",
      "Tratamentos fora do rol da ANS",
      "Atendimento fora da área de abrangência contratada",
    ],
    faq: [
      {
        q: "Plano empresarial com CNPJ de MEI vale a pena?",
        a: "Muitas vezes sim. Planos PME costumam ter preço melhor que os individuais, a partir de poucas vidas.",
      },
      {
        q: "O que é portabilidade de carências?",
        a: "É o direito de trocar de plano sem cumprir novas carências, desde que você atenda às regras da ANS.",
      },
      {
        q: "Coparticipação compensa?",
        a: "Depende de quanto você usa. Para quem usa pouco, costuma reduzir a mensalidade.",
      },
    ],
    insurers: ["sulamerica", "bradesco-seguros", "amil", "unimed", "porto-seguro", "allianz"],
  },
  {
    slug: "odonto",
    title: "Plano Odontológico",
    short: "Odontológico",
    icon: "smile",
    tagline: "Cuidado contínuo com mensalidade previsível.",
    promise: "Prevenção, tratamento e urgência com rede credenciada e mensalidade que cabe no orçamento.",
    intro:
      "Plano odontológico costuma ter mensalidade baixa e carências curtas. É uma forma simples de manter a prevenção em dia e não ser pego de surpresa por um tratamento de canal.",
    forWho: [
      "Pessoas físicas e famílias",
      "Empresas que querem oferecer benefício aos funcionários",
      "Quem precisa de ortodontia (conforme o plano)",
    ],
    covered: [
      "Consultas, limpeza e prevenção",
      "Restaurações",
      "Tratamento de canal",
      "Extrações e pequenas cirurgias",
      "Urgência 24h",
      "Próteses e ortodontia (conforme o plano)",
    ],
    usuallyOut: [
      "Clareamento e procedimentos estéticos",
      "Implantes (salvo planos específicos)",
    ],
    faq: [
      {
        q: "Tem carência?",
        a: "Urgências costumam ter carência de 24 horas. Outros procedimentos variam conforme o plano.",
      },
      {
        q: "Aparelho ortodôntico está incluído?",
        a: "Em alguns planos, sim. Mostro quais incluem e quais cobram à parte.",
      },
      {
        q: "Posso incluir dependentes?",
        a: "Pode, e em planos familiares o valor por pessoa costuma cair.",
      },
    ],
    insurers: ["sulamerica", "bradesco-seguros", "amil", "unimed", "porto-seguro"],
  },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s])) as Record<
  ServiceSlug,
  Service
>;

export const PROFILES: { id: ProfileId; label: string; hint: string; order: ServiceSlug[] }[] = [
  {
    id: "tudo",
    label: "Tudo",
    hint: "Nove linhas de seguro. Escolha por onde começar.",
    order: ["automovel", "vida", "residencial", "saude", "empresarial", "viagem", "odonto", "condominial", "fianca"],
  },
  {
    id: "mim",
    label: "Para mim",
    hint: "Para você, o que costuma vir primeiro é carro, vida e saúde.",
    order: ["automovel", "vida", "viagem", "saude", "odonto", "fianca", "residencial", "empresarial", "condominial"],
  },
  {
    id: "familia",
    label: "Minha família",
    hint: "Para a família, o que costuma vir primeiro é casa, vida e saúde.",
    order: ["residencial", "vida", "saude", "odonto", "automovel", "viagem", "fianca", "empresarial", "condominial"],
  },
  {
    id: "negocio",
    label: "Meu negócio",
    hint: "Para a empresa: patrimônio, imóvel e benefícios para a equipe.",
    order: ["empresarial", "condominial", "fianca", "saude", "automovel", "vida", "residencial", "viagem", "odonto"],
  },
];

/** Quantos serviços de cada perfil ficam em destaque (os demais são atenuados). */
export const PROFILE_FOCUS = 6;
