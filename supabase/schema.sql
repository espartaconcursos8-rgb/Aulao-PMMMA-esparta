-- ============================================================
-- Aulão Esparta — Missão Aprovação
-- Schema do banco de dados (Supabase / Postgres)
-- ============================================================

-- Extensão para UUID
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------
-- Tabela principal: inscrições
-- ----------------------------------------------------------
create table if not exists inscricoes (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  -- dados do inscrito
  nome_completo text not null,
  email text not null,
  telefone text not null,

  -- pagamento
  status_pagamento text not null default 'pendente'
    check (status_pagamento in ('pendente', 'aprovado', 'recusado', 'cancelado', 'expirado')),
  valor numeric(10,2) not null,
  mp_preference_id text,
  mp_payment_id text,
  mp_status_detail text,

  -- controle de vaga
  vaga_confirmada boolean not null default false,
  requer_estorno boolean not null default false
);

-- Um e-mail só pode ter uma inscrição com vaga confirmada
create unique index if not exists idx_inscricoes_email_confirmada
  on inscricoes (email)
  where vaga_confirmada = true;

create index if not exists idx_inscricoes_status on inscricoes (status_pagamento);
create index if not exists idx_inscricoes_mp_preference on inscricoes (mp_preference_id);

-- ----------------------------------------------------------
-- Trigger: atualiza "atualizado_em" automaticamente
-- ----------------------------------------------------------
create or replace function trigger_set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_atualizado_em on inscricoes;
create trigger set_atualizado_em
  before update on inscricoes
  for each row
  execute function trigger_set_atualizado_em();

-- ----------------------------------------------------------
-- View: contagem de vagas em tempo real
-- ----------------------------------------------------------
create or replace view vagas_status as
select
  150 as total_vagas,
  count(*) filter (where vaga_confirmada = true) as vagas_ocupadas,
  150 - count(*) filter (where vaga_confirmada = true) as vagas_disponiveis
from inscricoes;

-- ----------------------------------------------------------
-- Tabela pública de contador (não expõe dados pessoais)
-- ----------------------------------------------------------
create table if not exists contador_vagas_publico (
  id smallint primary key default 1,
  total_vagas integer not null default 150,
  vagas_disponiveis integer not null default 150,
  atualizado_em timestamptz not null default now(),
  constraint singleton check (id = 1)
);

insert into contador_vagas_publico (id, total_vagas, vagas_disponiveis)
values (1, 150, 150)
on conflict (id) do nothing;

alter table contador_vagas_publico enable row level security;

drop policy if exists "leitura publica do contador" on contador_vagas_publico;
create policy "leitura publica do contador" on contador_vagas_publico
  for select
  to anon
  using (true);

drop policy if exists "bloqueia escrita anonima no contador" on contador_vagas_publico;
create policy "bloqueia escrita anonima no contador" on contador_vagas_publico
  for insert
  to anon
  with check (false);

-- ----------------------------------------------------------
-- Trigger: mantém o contador público sincronizado
-- ----------------------------------------------------------
create or replace function sync_contador_vagas_publico()
returns trigger as $$
begin
  update contador_vagas_publico
  set
    vagas_disponiveis = 150 - (select count(*) from inscricoes where vaga_confirmada = true),
    atualizado_em = now()
  where id = 1;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_contador on inscricoes;
create trigger trg_sync_contador
  after insert or update of vaga_confirmada or delete on inscricoes
  for each row
  execute function sync_contador_vagas_publico();

alter publication supabase_realtime add table contador_vagas_publico;

-- ----------------------------------------------------------
-- Função: confirma o pagamento de uma inscrição com segurança
-- contra concorrência
-- ----------------------------------------------------------
create or replace function confirmar_pagamento(
  p_id uuid,
  p_mp_payment_id text,
  p_mp_status_detail text
)
returns table (vaga_confirmada boolean, requer_estorno boolean) as $$
declare
  v_ocupadas integer;
begin
  lock table inscricoes in share row exclusive mode;

  select count(*) into v_ocupadas from inscricoes where vaga_confirmada = true;

  if v_ocupadas < 150 then
    update inscricoes
    set status_pagamento = 'aprovado',
        mp_payment_id = p_mp_payment_id,
        mp_status_detail = p_mp_status_detail,
        vaga_confirmada = true,
        requer_estorno = false
    where id = p_id;
  else
    update inscricoes
    set status_pagamento = 'aprovado',
        mp_payment_id = p_mp_payment_id,
        mp_status_detail = p_mp_status_detail,
        vaga_confirmada = false,
        requer_estorno = true
    where id = p_id;
  end if;

  return query
    select i.vaga_confirmada, i.requer_estorno from inscricoes i where i.id = p_id;
end;
$$ language plpgsql;

-- ----------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------
alter table inscricoes enable row level security;

drop policy if exists "bloqueia acesso anonimo" on inscricoes;
create policy "bloqueia acesso anonimo" on inscricoes
  for all
  to anon
  using (false)
  with check (false);
