# Consultoria do Jev

Respostas do **Jev** (OpenRouter · `typesafe/jev-router`) usadas como base deste site, na ordem em que foram pedidas. O roteador escolhe o modelo a cada pedido.


---

## 1. Quais skills usar e qual stack

Aqui está o direcionamento estratégico para a execução.

---

### RESPOSTA 1: Pipeline de Skills

#### Ordem de Execução (O que usar e por quê)
1. **`ui-ux-pro-max`**: Definir direção de arte anti-v0 (fontes editoriais, escala tipográfica além de Inter/Roboto, paleta derivada de `#3F4095` com tons de apoio champanhe/zinco e regras de espaçamento generoso).
2. **`landing-page-pro`**: Estruturar a arquitetura de informação, hierarquia de seções (Hero com prova humana, Grid de Seguros, Prova Social/Parceiros, Quem é Fernando, FAQ, CTA final) e lógica do funil.
3. **`design:ux-copy`**: Redigir o microcopy de alta conversão do formulário inteligente (perguntas sem atrito) e os gatilhos dos botões que disparam a mensagem estruturada para o WhatsApp.
4. **`media-use`**: Buscar e padronizar vetores monocromáticos/harmonizados das 12+ seguradoras parceiras e otimizar as proporções para os retratos do Fernando.
5. **`site-premium`**: Aplicar as técnicas de refinamento que eliminam a "cara de IA" (reveal suave ao scroll, badge flutuante, micro-interação nos cards de produto, glow sutil no hover).
6. **`vercel-react-best-practices`**: Garantir LCP veloz com as fotos profissionais do corretor, zero CLS no carregamento dos logos e renderização fluida no mobile.
7. **`built-in-browser`**: Validar o comportamento responsivo real, legibilidade mobile e o disparo exato do link `wa.me/` com payload codificado.
8. **`design:design-critique`**: Fazer a auditoria visual final contra o benchmark de "site genérico de corretora", refinando detalhes antes da entrega.

#### Skills que você NÃO deve usar
* **`brainstorming`**: Discutir premissas agora atrasa o projeto; o briefing já tem dono, paleta, endereço e regras fechadas.
* **`design:design-system`**: Desnecessário criar documentação formal de tokens para uma landing institucional boutique de página única.
* **`design:accessibility-review`**: O `ui-ux-pro-max` já dita contraste WCAG AA nativamente; uma auditoria isolada adiciona ruído.
* **`web-artifacts-builder` / `artifact-design`**: O objetivo é código de produção real para deploy, não protótipos de chat.
* **`code-reviewer`**: Redundante se você seguir o guia de `vercel-react-best-practices`.

---

### RESPOSTA 2: Stack Recomendada

**Recomendação: (a) Next.js 15 (App Router) + Tailwind CSS + Framer Motion/Lucide — configurado com `output: 'export'`.**

#### Por que essa abordagem é superior:
1. **Flexibilidade total de hospedagem:** Ao usar `output: 'export'`, o Next.js compila para HTML/CSS/JS estático puro (pasta `/out`). Se o Fernando quiser usar a **Vercel** (grátis e ultrarrápida), basta conectar o Git. Se ele quiser hospedar na HostGator, Locaweb ou cPanel de R$ 15/mês, basta subir os arquivos estáticos via FTP.
2. **Formulário WhatsApp Inteligente:** Construir um modal interativo de cotação (onde o usuário escolhe "Automóvel" ou "Residencial", coloca nome/bairro e gera um link formatado para WhatsApp com quebras de linha e emojis profissionais) exige gerenciamento de estado React. Fazer isso em Vanilla JS puro fica frágil e amador de manter.
3. **Morte ao "Design v0 Genérico":** Com React e Tailwind é viável compor componentes assimétricos, tipografia editorial mista (ex: *Playfair Display* ou *Cinzel* nos títulos com *Plus Jakarta Sans* no corpo) e micro-interações táteis nos retratos do Fernando, fugindo do visual enlatado de template pré-fabricado.


---

## 2. Direção criativa (design system, arquitetura, copy, formulário, assinatura, parceiros)

# Direção criativa: Escolha Certa

Antes do conteúdo, três correções ao que falei antes:
- **Fontes:** retiro Playfair/Cinzel. Viraram o "serif de luxo de template" e não ajudam a fugir do visual genérico.
- **Acessibilidade:** retiro o "não use `design:accessibility-review`". Rode uma passada no fim, porque o wizard (modal, foco, erros), o marquee e o contraste do índigo sobre escuro são os pontos onde o site mais falha.
- **`output: 'export'`:** exige `images: { unoptimized: true }`, então gere AVIF/WebP em 2 tamanhos manualmente. As rotas `/servicos/[slug]` precisam de `generateStaticParams`, e `/cotacao` com query string precisa de um client component dentro de `<Suspense>`.

---

## A) DESIGN SYSTEM

**Cor**

| Token | Hex | Uso |
|---|---|---|
| `--indigo-600` | `#3F4095` | marca, links, CTA secundário, linhas do arco |
| `--indigo-700` | `#33357D` | hover/pressed |
| `--indigo-950` | `#15163A` | seções escuras (Fernando, rodapé) |
| `--indigo-400` | `#9FA0E0` | texto/ícone de destaque **sobre escuro** (≈6,7:1) |
| `--indigo-100` / `-50` | `#E4E5F4` / `#F2F2FA` | chips ativos, fundos suaves |
| `--paper` | `#F7F6F9` | fundo base (levemente lavanda) |
| `--surface` | `#FFFFFF` | cards |
| `--surface-2` | `#EFEDF3` | áreas rebaixadas, inputs |
| `--line` | `#E1DFE8` | bordas de 1px |
| `--ink` | `#1F1F1F` | texto e arco grafite |
| `--ink-2` / `--muted` | `#4A4A55` / `#6E6C7A` | texto secundário (muted só ≥16px ou não essencial) |
| `--night` | `#121216` | fundo escuro neutro |
| `--line-dark` | `rgb(255 255 255 / .10)` | bordas no escuro |
| `--sand` | `#C9B28A` | **acento de apoio opcional**, só em detalhes (numerais, fio fino no escuro), <2% da área |
| `--wa` / `--wa-hover` | `#25D366` / `#1EBE5A` | **somente** botões de WhatsApp |

- **Texto no botão WhatsApp:** use `--ink`, nunca branco. Branco sobre `#25D366` dá ~2:1 e reprova no WCAG.
- **Índigo sobre grafite:** nunca. O contraste é ~2:1. No escuro, use `--indigo-400`.
- **Fundo do hero:** amostre o hex real do fundo lavanda da foto e use como `--paper-lav` no painel do hero, para a foto se fundir ao layout.
- **Grain:** SVG noise a 3–4% de opacidade sobre `--paper` e `--night`.

**Fontes (next/font/google)**
- **Display:** **Fraunces** (variável, eixo `opsz`, pesos 400–600). Serif com personalidade, e o itálico dá o "tempero" em uma palavra por headline.
- **Texto/UI:** **Hanken Grotesk** (400/500/600), com `font-variant-numeric: tabular-nums` nos contadores.

**Escala (clamp)**
```
--fs-display-xl: clamp(2.75rem, 1.6rem + 5.2vw, 6rem);   /* hero, lh 1.02, ls -0.03em */
--fs-display-lg: clamp(2.25rem, 1.5rem + 3.4vw, 4.25rem); /* lh 1.05, ls -0.025em */
--fs-h2:  clamp(1.75rem, 1.2rem + 2.2vw, 3rem);           /* lh 1.1 */
--fs-h3:  clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem);        /* lh 1.25 */
--fs-lead: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);       /* lh 1.55 */
--fs-body: 1rem;      /* lh 1.65 */
--fs-small: 0.875rem;
--fs-eyebrow: 0.75rem; /* uppercase, tracking .16em, 600 */
```

**Raios:** `--r-sm 6px` (inputs, chips pequenos), `--r-md 12px`, `--r-lg 20px` (cards), `--r-pill 999px` (botões, chips), `--r-arch: 999px 999px 24px 24px` (máscara das fotos, que é o arco da logo).

**Sombras (tingidas de índigo, nunca preto puro)**
```
--sh-1: 0 1px 2px rgb(31 31 40/.06), 0 1px 1px rgb(31 31 40/.04);
--sh-2: 0 8px 24px -8px rgb(63 64 149/.18), 0 2px 6px rgb(31 31 40/.06);
--sh-3: 0 30px 60px -20px rgb(21 22 58/.35);
--ring: 0 0 0 1px rgb(63 64 149/.28);
```

**Movimento:** easing `cubic-bezier(.22,1,.36,1)`, reveal de 600–700ms com 12–16px de deslocamento, stagger de 70ms. Respeite `prefers-reduced-motion` em tudo.

---

## B) ARQUITETURA

**Rotas:** `/` · `/servicos/[slug]` (9) · `/cotacao` (wizard em tela cheia, aceita `?servico=automovel`, serve para anúncios e links compartilhados) · `/privacidade` · `404`. Em todo o resto do site o wizard abre como **dialog** sobre a página atual. Mobile: barra fixa inferior "Cotar agora".

**Home, na ordem**

1. **Header:** logo à esquerda, links (Seguros · Como funciona · Fernando · Parceiros · Dúvidas), pill "Fazer cotação". Começa transparente e vira blur + hairline após 24px de scroll.
2. **"Antes do seguro, uma conversa" (Hero):** grid assimétrico 7/5.
   - **Esquerda:** eyebrow, headline em Fraunces com uma palavra em itálico índigo, sub, CTA WhatsApp + link "Ver os seguros", e o indicador "Atendendo agora".
   - **Direita:** retrato do **banco, olhando para a câmera**, na máscara em arco, com os dois arcos (índigo e grafite) desenhados ao redor, levemente deslocados, como na logo. Um badge flutuante "Corretor em Brasília desde 2020" sobrepõe a base da foto, com parallax mínimo (±12px).
   - A foto sangra para fora do container à direita no desktop.
3. **"Fatos, sem enfeite" (faixa):** linha fina com 4 itens em contadores: *2020* (fundação), *12 seguradoras e operadoras* (só o que for verdade), *9 linhas de seguro*, *Seg–sáb* (horário). Sem números inventados de clientes ou apólices.
4. **"O que você quer proteger" (vitrine + seletor de perfil):** o elemento de assinatura nº 2 (seção E).
   - Layout bento de 12 colunas: Automóvel grande (7×2), Vida alto (5×2), depois Residencial 4, Saúde 4, Empresarial 4, e uma linha com Viagem, Odonto, Condominial e Fiança em tamanhos distintos.
   - Os cards têm spotlight que segue o ponteiro e borda de 1px com luz.
5. **"Três passos, uma conversa" (Como funciona):** scrollytelling.
   - Esquerda sticky: título e o arco, que vira barra de progresso.
   - Direita: 3 passos grandes que entram um a um. 1) Você conta o que precisa (1 min). 2) Fernando compara as seguradoras. 3) Você decide, e ele acompanha depois.
6. **"Corretor ou direto na seguradora?":** contraste editorial em duas colunas desiguais (40/60), sem tabela de checkmarks. À esquerda uma frase grande em serif, à direita 3 parágrafos curtos com numerais em `--sand`.
7. **"Quem está do outro lado" (Fernando):** seção `--indigo-950` full-bleed.
   - Retrato da **poltrona olhando para cima** em tamanho grande, à esquerda, com a textura cinza fundida ao escuro por gradiente de máscara.
   - À direita: bio curta, uma citação em serif, assinatura, registro SUSEP e um segundo retrato pequeno (**banco 2**) sobreposto no canto, em arco.
8. **"Na hora do aperto" (sinistro):** mock de conversa de WhatsApp (balões que entram em sequência ao scroll) mostrando como Fernando orienta num sinistro. Fundo `--paper`, mock em card branco com `--sh-3`. O texto das mensagens precisa ser validado pelo Fernando.
9. **"Quem protege você" (Parceiros):** ver seção F.
10. **Depoimentos (condicional):** só entra com depoimentos reais e autorizados (nome e foto ou inicial). Sem eles, a seção não existe. Não invente.
11. **"Perguntas que todo mundo faz" (FAQ):** esquerda sticky com título e o retrato da **poltrona olhando para o lado**, pequeno, em arco. Direita com acordeão (`<details>` estilizado ou Radix).
12. **"Vamos conversar?" (CTA final):** painel índigo-950 com arco grande de fundo.
    - Esquerda: headline e chips dos 9 serviços (clicar abre o wizard já no serviço).
    - Direita: retrato da **poltrona olhando para a câmera**.
    - Abaixo: endereço, horários, e-mail e link do mapa em 3 blocos de larguras diferentes.
13. **Footer:** logo, navegação, contatos, endereço completo, SUSEP, privacidade, aviso de marcas.

**Páginas `/servicos/[slug]`** (template único, conteúdo em um arquivo de dados):
- Hero compacto com título, uma linha de promessa e o CTA que abre o wizard já no serviço.
- "Para quem faz sentido" e "O que costuma estar coberto / o que costuma ficar de fora" (honestidade gera confiança).
- Mini-FAQ de 3 perguntas com `FAQPage` JSON-LD.
- Seguradoras que oferecem esse ramo.
- Avatar do Fernando (banco 2) com "Fernando cuida desta cotação".
- CTA final.
- Um `Service` JSON-LD por página, e `LocalBusiness`/`InsuranceAgency` na home.

**Distribuição das 5 fotos**

| Foto | Onde |
|---|---|
| Banco A (câmera) | Hero |
| Poltrona, olhando para cima | Seção Fernando (grande) |
| Banco B (câmera) | Seção Fernando (pequena) e avatar das páginas de serviço |
| Poltrona, olhando para o lado | FAQ |
| Poltrona (câmera) | CTA final |

Ponha `priority` só na foto do hero, defina `width`/`height` e `object-position` no rosto de cada uma.

---

## C) COPY

**Headlines do hero**
1. **"Seguro bom é o que funciona no dia ruim."** ← **melhor**: memorável, específica e abre caminho para a seção do sinistro.
2. "A escolha certa começa com uma conversa."
3. "Várias seguradoras. Um corretor de confiança. Um WhatsApp."

**Sub:** "Sou o Fernando, corretor aqui em Brasília. Comparo as seguradoras, explico o que cada apólice cobre de verdade e continuo do seu lado quando você precisar acionar."

**Eyebrow:** "Corretora de seguros · Brasília desde 2020"

**Textos das seções**
- **Faixa:** "Fatos, sem enfeite."
- **Vitrine:** H2 "O que você quer proteger?" Sub: "Escolha por onde começar. Cotação sem custo, resposta direta."
- **Como funciona:** H2 "Três passos. Uma conversa."
  1. *Você conta* – "Responde 4 ou 5 perguntas rápidas. Leva cerca de um minuto."
  2. *Eu comparo* – "Coloco lado a lado preço, coberturas e franquias das seguradoras que fazem sentido para o seu caso."
  3. *Você decide* – "Escolhe com clareza. Depois, sigo ao seu lado: renovação, dúvidas e sinistro."
- **Corretor × direto:** H2 "Uma seguradora vende a dela. Um corretor compara várias." Parágrafos: (1) "Quem contrata direto vê uma só proposta. Eu mostro várias, e explico as diferenças que o preço esconde." (2) "A cotação não tem custo para você." (3) "Se o seguro for acionado, você não está sozinho preenchendo formulário e esperando resposta."
- **Fernando:** H2 "Quem está do outro lado." Texto: "Fundei a Escolha Certa em 2020 com uma ideia simples: seguro tem que ser entendido antes de ser comprado. Atendo cada cliente pessoalmente, pelo WhatsApp ou aqui no escritório, na Quadra 204." Citação: "Não vendo o seguro mais barato. Ajudo você a escolher o que vai valer a pena quando precisar."
- **Sinistro:** H2 "Na hora do aperto, você não fica sozinho."
- **Parceiros:** H2 "Seguradoras que eu comparo por você." Nota: "Marcas pertencem a seus respectivos titulares."
- **CTA final:** H2 "Vamos conversar?" Sub: "Conte o que você quer proteger. Eu respondo em horário comercial."

**FAQ** (as respostas marcadas ⚠ o Fernando precisa confirmar antes de publicar)
1. **Quanto custa pedir uma cotação?** Nada. Você só paga se fechar o seguro.
2. **Pago mais caro por usar um corretor?** Não. A corretora é remunerada pela seguradora, e o preço da apólice é o mesmo que você teria contratando direto. ⚠
3. **Em quanto tempo recebo a cotação?** Respondo durante o horário de atendimento, em geral no mesmo dia útil. ⚠
4. **E se eu precisar acionar o seguro?** Me chame. Oriento o passo a passo e acompanho o processo com a seguradora.
5. **Atende fora de Brasília?** Sim, o atendimento é online, pelo WhatsApp. Para plano de saúde e odontológico, a disponibilidade depende da região. ⚠
6. **Já tenho seguro. Vale a pena comparar?** Vale, principalmente antes da renovação. Analiso sua apólice atual e mostro o que dá para melhorar, sem compromisso.

**Microcopy**
- **CTA primário:** "Cotar pelo WhatsApp"
- **Nav:** "Fazer cotação"
- **Secundário:** "Ver os seguros"
- **Cards:** "Cotar Automóvel →"
- **Mobile bar:** "Cotar agora"
- **Wizard:** "Continuar" / "Voltar" / final **"Abrir conversa no WhatsApp"**
- **Pós-envio:** "Se o WhatsApp não abriu, toque aqui." + "Copiar mensagem"
- **Status:** "Atendendo agora · até 18h" / "Fechado agora · volto amanhã às 9h"

**Frases dos 9 cards** (uma linha cada)
- Automóvel: "Cobertura de verdade, franquia que cabe no bolso."
- Residencial: "Do incêndio ao vazamento que ninguém esperava."
- Empresarial: "Proteja o patrimônio e a continuidade do negócio."
- Vida: "Tranquilidade para quem depende de você."
- Viagem: "Assistência médica fora de casa, sem susto."
- Condominial: "Obrigatório por lei e essencial na prática."
- Fiança Locatícia: "Alugue sem fiador e sem depósito caução."
- Plano de Saúde: "Rede, carência e reajuste explicados com clareza."
- Plano Odontológico: "Cuidado contínuo com mensalidade previsível."

---

## D) FORMULÁRIO → WHATSAPP

**Fluxo (4 etapas, com o arco como indicador de progresso):**
1. **Serviço** (chips; pula se já veio pré-selecionado)
2. **Detalhes** (3–5 campos do serviço)
3. **Contato** (comuns)
4. **Revisão:** preview da mensagem + botão

**Campos comuns (etapa 3):** Nome*, WhatsApp* (máscara `(61) 9XXXX-XXXX`), Cidade* (padrão "Brasília", editável), "Algo mais que devo saber?" (opcional, máx. 300 caracteres).

**Campos específicos** (* = obrigatório)

| Serviço | Campos |
|---|---|
| **Automóvel** | Veículo (marca/modelo/ano)* · Placa (opcional) · CEP ou bairro onde dorme* · Idade do condutor principal* · Seguro novo ou renovação? (se renovação: mês de vencimento) |
| **Residencial** | Casa / apartamento / condomínio fechado* · Próprio ou alugado* · Bairro ou CEP* · Valor aproximado do imóvel (faixas)* · Quer incluir (multi: roubo, danos elétricos, responsabilidade civil, outros) |
| **Empresarial** | Ramo de atividade* · Imóvel próprio ou alug


---

## 2b. Continuação (formulário → WhatsApp, elementos de assinatura, parceiros)

**ado\*** · Faturamento/valor a segurar (faixas) · Quer proteger (multi: imóvel, estoque/equipamentos, lucros cessantes, responsabilidade civil, frota) |

| Serviço | Campos |
|---|---|
| **Vida** | Idade* · Profissão* · Valor de proteção desejado (faixas, ou "Não sei, quero orientação")* · Quem depende de você (cônjuge, filhos, pais, ninguém)* · Já possui seguro de vida? (sim/não) |
| **Viagem** | Destino (país/região)* · Data de ida e volta*, com validação de volta ≥ ida · Nº de viajantes e idades* · Motivo (lazer, trabalho, estudo, intercâmbio)* · Esportes ou atividades de risco? (opcional) |
| **Condominial** | Nome do condomínio · Bairro/CEP* · Nº de unidades* · Tipo (residencial, comercial, misto)* · Tem apólice vigente? Se sim, mês de vencimento |
| **Fiança Locatícia** | Sou: inquilino / proprietário / imobiliária* · Valor do aluguel* · Valor do condomínio + IPTU (opcional) · Cidade do imóvel* · Prazo desejado para fechar (urgente, até 15 dias, sem pressa) |
| **Plano de Saúde** | Tipo: individual / familiar / empresarial (PME) / por adesão*, com CNPJ opcional se PME · Nº de pessoas e idades* · Cidade de residência* · Já tem plano? Se sim, operadora atual · Preferência (hospital/rede, ou "melhor custo") |
| **Plano Odontológico** | Nº de pessoas e idades* · Individual / familiar / empresarial* · Cidade* · Já tem plano? (sim/não) · Precisa de ortodontia? (sim/não/não sei) |

**Regra de privacidade:** não pergunte condição de saúde no formulário. Dados sensíveis são tratados com o Fernando na conversa, não num campo aberto.

### Formato da mensagem

```
Olá, Fernando! Vim pelo site da Escolha Certa e quero uma cotação.

*Seguro:* Automóvel
*Veículo:* Honda Civic 2021
*Placa:* ABC1D23
*Pernoite:* Asa Norte, Brasília
*Condutor principal:* 34 anos
*Situação:* Renovação (vence em março)

*Nome:* Maria Souza
*WhatsApp:* (61) 99999-9999
*Cidade:* Brasília

*Observações:* Quero comparar franquias.

Enviado pelo site em 12/05/2025, 14:32
```

- **Regras:** uma linha por campo. Campos vazios ou opcionais não preenchidos são omitidos. Multi-seleções ficam separadas por vírgula. A linha final de data é opcional, para o Fernando saber a origem.
- **Emoji:** nenhum. O `*negrito*` é a sintaxe do WhatsApp.
- **Envio:** `https://wa.me/5561991740511?text=` + `encodeURIComponent(msg)`. Abra com `window.open(url, '_blank', 'noopener')` disparado direto pelo clique, para o navegador não bloquear como popup.
- **Limite:** se a mensagem passar de ~1.500 caracteres, corte as observações e avise o usuário.

### Validações e estados

**Validações**
- **Nome:** mínimo 2 caracteres, sem números.
- **WhatsApp:** regex `^\(\d{2}\) 9\d{4}-\d{4}$`, com DDD válido. Aceite colar com +55 e normalize.
- **Placa:** antiga `^[A-Z]{3}-?\d{4}$` ou Mercosul `^[A-Z]{3}\d[A-Z]\d{2}$`. É opcional, mas se preenchida precisa ser válida.
- **Idades:** números entre 0 e 110.
- **Datas de viagem:** não pode ser no passado, e a volta não pode ser antes da ida.
- **Observações:** máximo de 300 caracteres, com contador.
- **Sanitização:** remova `*`, `_` e `~` do texto livre, para o usuário não quebrar a formatação da mensagem.

**Estados**
- **Campo:** neutro → foco (`--ring`) → erro (borda e texto de erro abaixo, `aria-describedby`, `aria-invalid`) → válido. Valide no `blur` e revalide no `change` depois do primeiro erro.
- **Botão "Continuar":** nunca fica desabilitado sem explicação. Se houver erro, ele leva o foco ao primeiro campo inválido e anuncia em `aria-live="polite"`.
- **Wizard:** o `dialog` tem focus trap, `Esc` fecha (com confirmação se houver dados), retorna o foco ao gatilho, e a página de trás fica `inert`. O rascunho persiste em `sessionStorage`. Há botão "Voltar" em todas as etapas e `prefers-reduced-motion` desliga as transições entre etapas.
- **Pós-clique (sucesso):** tela "Conversa aberta" com "Se o WhatsApp não abriu, toque aqui" e "Copiar mensagem". Não há backend, então não existe estado de "erro de servidor".
- **Fora do horário:** aviso discreto na revisão: "Estamos fora do horário. Sua mensagem fica registrada e respondo amanhã às 9h."
- **Nota LGPD** (uma linha, abaixo do botão): "Seus dados só vão para a conversa no WhatsApp. Veja a política de privacidade."

---

## E) ELEMENTO DE ASSINATURA

**1. Seletor de perfil que reorganiza a vitrine** (seção "O que você quer proteger")

- **Controle:** segmented control com `role="radiogroup"` e 4 opções: **Tudo** (padrão) · **Para mim** · **Minha família** · **Meu negócio**. Setas do teclado navegam entre elas.
- **Mapeamento (ordem de prioridade):**
  - *Para mim:* Automóvel, Vida, Viagem, Saúde, Odonto, Fiança.
  - *Minha família:* Residencial, Vida, Saúde, Odonto, Automóvel, Viagem.
  - *Meu negócio:* Empresarial, Condominial, Fiança, Saúde (PME), Automóvel, Vida.
- **Comportamento:**
  - Os cards do perfil sobem para o início do bento e ganham tamanho e borda luminosa.
  - Os demais descem e ficam a 40% de opacidade e em escala de cinza.
  - Os cards continuam clicáveis. Nada é escondido, para não perder SEO nem confundir.
  - A animação é `layout` do Framer Motion, com spring suave (~450ms) e stagger de 40ms.
  - Por baixo do seletor aparece uma frase de apoio que muda com o perfil, por exemplo "Para a família, o que costuma vir primeiro é casa, vida e saúde."
- **Integração com o wizard:** o perfil escolhido vai para o wizard como contexto, e a etapa 1 já mostra os serviços nessa ordem.
- **Estado:** persiste na URL (`#perfil=familia`) e em `sessionStorage`.
- **Reduced motion:** troca instantânea, sem layout animado.

**2. O arco que se completa** (motivo da logo como fio condutor)

- **Forma:** dois arcos SVG concêntricos, índigo e grafite, deslocados como na logo.
- **No hero:** os traços se desenham em ~1,2s com `stroke-dashoffset` na carga, e depois ficam estáticos.
- **Em "Como funciona":** o arco sticky é a barra de progresso. O traço índigo avança de 0 a 100% conforme o scroll pelos 3 passos (`useScroll` + `pathLength`), e cada passo "acende" um nó no arco.
- **No wizard:** um semicírculo no topo preenche 25% por etapa. Na última etapa ele fecha, e o botão ganha o brilho.
- **No CTA final:** um arco grande de fundo, a 8% de opacidade, que se desloca com parallax mínimo.
- **Regra de dose:** nunca mais que um arco animado visível por vez.

---

## F) PARCEIROS

**Lista a exibir**

- **Núcleo (os 12 do briefing):** Porto Seguro, Bradesco Seguros, SulAmérica, Allianz, Itaú Seguros, Azul Seguros, HDI, Tokio Marine, MSIG, Sura, Amil, Unimed.
- **Candidatos, só se o Fernando confirmar que tem código/convênio ativo:** Mapfre, Yelum (ex-Liberty), Zurich, Suhai, Youse.
- **Regra:** exiba apenas quem ele realmente opera. Logo de seguradora que ele não vende é propaganda enganosa e risco jurídico. Confirme também o uso das marcas, e mantenha a nota "Marcas pertencem a seus respectivos titulares".
- **Contagem:** a faixa de fatos deve refletir o número final (12, ou 12 + os confirmados).

**Como exibir**

- **Desktop:** marquee em 2 linhas, com sentidos opostos e velocidade lenta (~60s por volta). Pausa no hover e no foco.
- **Mobile:** o mesmo marquee em 1 linha, ou grid 3×N estático.
- **`prefers-reduced-motion`:** grid estático. Sem marquee.
- **Logos:** SVG monocromático em `--ink-2` a ~70% de opacidade, voltando à cor original no hover. Normalize a altura visual (28–32px, largura máxima ~120px) e ajuste ótica por logo, porque as marcas têm pesos muito diferentes. Reserve `width`/`height` para evitar CLS.
- **Acessibilidade:** a cópia duplicada do marquee leva `aria-hidden="true"`, e um `<ul class="sr-only">` lista os nomes. Cada logo tem `alt` com o nome da seguradora.
- **Nas páginas de serviço:** mostre só as seguradoras que atuam naquele ramo, em grid estático, por exemplo Unimed e Amil apenas em Saúde.
- **Obtenção dos logos:** use `media-use`, prefira SVG oficial das páginas de imprensa/marca, e valide visualmente cada um.


---

## 3. Código do módulo de cotação (lib/quote.ts)

O código completo entregue pelo Jev está em `lib/quote.ts` (revisado e integrado; ajustes: placeholder do WhatsApp e status "volto amanhã").


---

## 4. Design-critique final sobre screenshots reais

**Está no nível certo:** hero editorial, retrato em arco, seção Fernando e parceiros coloridos em cartões brancos têm identidade própria. Não redesenharia essas bases.

Pelas capturas, faria **5 ajustes antes de publicar**, nesta ordem:

### 1. Mobile: Fernando aparece tarde demais
Na captura de 375px, uma tela inteira termina sem mostrar o rosto. A prova humana perde força.

**Correção, somente abaixo de `md`:**
- Sub do hero: **“Sou o Fernando, corretor em Brasília. Comparo preço e coberturas e acompanho você quando precisar acionar.”**
- Parágrafo: `text-base leading-[1.6] mt-5`.
- Grupo de ações: `mt-6 gap-3`.
- “Ver os seguros”: retire o pill branco; use link `inline-flex min-h-11 items-center gap-2`, abaixo do CTA.
- **Mova os três itens de confiança para depois do retrato.** Preserve o tamanho atual do título.

Isso traz a foto para cima sem comprimir a identidade editorial.

### 2. Wizard: a mensagem parece um bloco secundário, embora seja o conteúdo principal
O verde-claro e a tipografia pequena deixam a revisão com aparência de mock de chat, não de leitura confortável.

**Correção:**
- Caixa externa: `bg-[#EFEDF3] p-3 rounded-2xl`.
- Mensagem: `bg-white text-[#1F1F1F] text-base leading-[1.6] p-5 rounded-xl border border-[#E1DFE8] whitespace-pre-wrap break-words`.
- Remova qualquer `font-mono`, se houver.
- Preserve o rodapé fixo com o botão verde: **essa parte já está correta**.

Copy auxiliar: **“Confira seus dados. A mensagem só será enviada quando você confirmar no WhatsApp.”**

### 3. Fernando: falta uma credencial verificável junto à assinatura
A seção comunica proximidade, mas o bloco da assinatura mostra apenas cargo e empresa. É o lugar mais útil para uma prova profissional concreta.

**Correção:** abaixo de “Corretor de seguros”, acrescente, **apenas após confirmar o registro correto**:

**“Registro SUSEP: [número confirmado]”**

Estilo: `text-sm leading-6 text-white/75`. Use o registro correspondente à pessoa ou à empresa, com identificação clara; não publique placeholder.

### 4. Bento: dois caminhos por card, mas só um tem significado claro
“Cotar Automóvel” está explícito; o círculo com seta no outro canto não informa se abre detalhes ou inicia outra cotação.

**Correção:**
- Substitua o círculo por **“Ver coberturas →”**, apontando para `/servicos/[slug]`.
- Link: `inline-flex min-h-11 items-center gap-2 text-sm font-medium`.
- CTA no card escuro: `bg-white text-[#15163A] hover:bg-[#E4E5F4]`.
- CTA nos cards claros: `bg-[#3F4095] text-white hover:bg-[#33357D]`.

Assim, **verde fica reservado às ações explicitamente de WhatsApp**, e a vitrine distingue consultar de cotar. Não transforme o card inteiro em link contendo outros links/botões.

### 5. Citação: “Não vendo o seguro mais barato” cria uma objeção desnecessária
A frase pode soar como “aqui custa mais”, antes de o visitante entender a comparação. O problema é a copy, não a composição.

**Troque por:**

> “Preço importa. O que o seguro cobre também. Eu ajudo você a comparar os dois.”

Mantenha a serif, a borda vertical e o espaço atual. A mensagem continua autoral, mas reforça critério sem afastar quem procura economia.
