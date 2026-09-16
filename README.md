# Aulão Esparta — Missão Aprovação

Site de inscrição com controle de vagas em tempo real e pagamento via Mercado Pago.

## O que já está pronto

- Landing page (hero, sobre, programação, data/horário/local, banner de vagas, formulário de inscrição)
- Contador de vagas ao vivo (Supabase Realtime) — nunca passa de 150
- Formulário de inscrição (nome, e-mail, WhatsApp) com validação
- Banco de dados estruturado (Supabase/Postgres) com controle de concorrência para não estourar as 150 vagas
- Integração com Mercado Pago (Checkout Pro) pronta para ativar — funciona sem quebrar mesmo antes de você configurar as chaves
- Webhook que confirma pagamento automaticamente
- Painel administrativo (`/admin`) com login por senha, lista de inscritos e exportação para Excel

## O que falta você preencher

1. **Conteúdo do evento** em `lib/config.ts`: data, horário, local, preço (`precoCentavos`), texto "sobre" e programação. Tudo que estiver como `"A DEFINIR"` aparece assim no site até você editar.
2. **Variáveis de ambiente** — veja `.env.example`.

## Como colocar no ar

### 1. Banco de dados (Supabase)
1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o **SQL Editor** e rode todo o conteúdo de `supabase/schema.sql`.
3. Em **Project Settings > API**, copie a URL do projeto, a `anon key` e a `service_role key`.

### 2. Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha com os dados do Supabase.
Deixe `MERCADOPAGO_ACCESS_TOKEN` e `precoCentavos` em branco/zero para testar o site sem cobrar nada ainda — a inscrição funciona normalmente e fica marcada como "pendente".

### 3. Rodar localmente
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`.

### 4. Painel administrativo
Defina `ADMIN_PASSWORD` (a senha de acesso) e `ADMIN_SESSION_SECRET` (qualquer texto aleatório longo) no `.env.local`. Acesse em `/admin`.

### 5. Ativar o pagamento (quando o preço estiver definido)
1. Preencha `precoCentavos` em `lib/config.ts` (ex: `4990` = R$ 49,90).
2. Gere um **Access Token de produção** no [painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel) e coloque em `MERCADOPAGO_ACCESS_TOKEN`.
3. Depois do deploy, defina `NEXT_PUBLIC_SITE_URL` com a URL real do site (o Mercado Pago usa essa URL para o webhook e para redirecionar o aluno de volta).

### 6. Deploy
O jeito mais simples é a [Vercel](https://vercel.com): importe o repositório, cole as mesmas variáveis de ambiente do `.env.local` e publique.

## Estrutura do projeto
```
app/                  páginas e rotas de API (Next.js App Router)
  page.tsx            landing page
  admin/               login e dashboard administrativo
  api/inscricoes/      cria inscrição + preferência de pagamento
  api/webhook/          confirma pagamento (chamado pelo Mercado Pago)
  api/admin/            login, logout e exportação Excel do admin
components/            componentes de UI da landing page e do admin
lib/config.ts          ⚠️ dados editáveis do evento (data, local, preço, conteúdo)
lib/                   Supabase, Mercado Pago, validação, vagas
supabase/schema.sql    schema completo do banco de dados
```
