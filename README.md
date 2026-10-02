# Escolha Certa · site institucional

Site da **Escolha Certa Corretora de Seguros** (Fernando Queiroz Ramos, Brasília/DF).
Next.js 15 + Tailwind CSS v4 + Motion, exportado como **site estático** (pasta `out/`).

Direção criativa, copy e lógica do formulário: **Jev** (OpenRouter · `typesafe/jev-router`).
O histórico completo da consultoria está em [`docs/jev-consultoria.md`](docs/jev-consultoria.md).

## Rodar e publicar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a pasta out/ (HTML/CSS/JS estáticos)
```

- **GitHub Pages (atual)**: cada `push` na branch `main` roda o workflow `.github/workflows/deploy-pages.yml`, que gera o site e publica na branch `gh-pages`.
  Endereço: https://yurifois.github.io/escolha-certa-fernando-ramos/
  (Em *Settings → Pages* a fonte deve ser **Deploy from a branch → `gh-pages` / root**.)
- **Domínio próprio**: no workflow, deixe `NEXT_PUBLIC_BASE_PATH` vazio e troque `NEXT_PUBLIC_SITE_URL` pelo domínio; depois configure o domínio em *Settings → Pages*.
- **Vercel**: importe o repositório (framework Next.js, sem configuração extra).
- **Hospedagem compartilhada (cPanel, Locaweb, HostGator…)**: rode `npm run build` e envie **o conteúdo** da pasta `out/` para `public_html` por FTP.

## Antes de publicar (pendências do cliente)

| O quê | Onde |
|---|---|
| Número de registro **SUSEP** (aparece no rodapé e na seção do Fernando só quando preenchido) | `lib/site.ts` → `susep` |
| Domínio definitivo (SEO, Open Graph, JSON-LD) | variável `NEXT_PUBLIC_SITE_URL` no workflow |
| Confirmar as 12 seguradoras exibidas. Mapfre, Zurich, MAG e Hapvida já têm logo salva, mas ficam ocultas até confirmação (`active: true`) | `lib/partners.ts` |
| Quais seguradoras aparecem em cada serviço | `lib/services.ts` → `insurers` |
| Validar o texto do exemplo de conversa de sinistro | `components/home/ClaimChat.tsx` |
| Validar as respostas do FAQ (preço com corretor, prazo de resposta, atendimento fora de Brasília) | `components/Faq.tsx` |
| Instagram / Facebook / LinkedIn oficiais (opcional) | `lib/site.ts` → `social` |
| Depoimentos reais e autorizados (a seção só deve existir com depoimentos verdadeiros) | — |

## Como funciona a cotação

Formulário em 4 etapas (seguro → detalhes → contato → revisão), com campos específicos para cada um dos 9 serviços.
Ao final, abre `wa.me/5561991740511` com a mensagem pronta. **Nada é enviado a servidor**; o rascunho fica no `sessionStorage` do navegador até a conversa ser aberta.

- Abre como janela sobre qualquer página (botões "Cotar…") ou em página própria: `/cotacao/?servico=automovel`
  (serviços: `automovel`, `residencial`, `empresarial`, `vida`, `viagem`, `condominial`, `fianca`, `saude`, `odonto`). Útil para anúncios e bio do Instagram.
- Campos, validações e formato da mensagem: `lib/quote.ts`.

## Estrutura

```
app/                 páginas (home, servicos/[slug], cotacao, privacidade, 404)
components/home/     seções da home
components/quote/    wizard de cotação e janela
lib/                 dados (site, serviços, parceiros) e lógica da cotação
public/images/       fernando/ (retratos recortados), brand/ (logo clara e escura), parceiros/ (logos)
```

Logos das seguradoras: Wikimedia Commons (fontes e licenças em `public/images/parceiros/_fontes-wikimedia.json`).
As marcas pertencem a seus titulares.
