"use client";

import { useState, FormEvent } from "react";
import { schemaInscricao } from "@/lib/validacao";

type Estado =
  | { fase: "preenchendo" }
  | { fase: "enviando" }
  | { fase: "redirecionando" }
  | { fase: "erro"; mensagem: string };

function formatarWhatsapp(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export default function FormularioInscricao({ vagasEsgotadas }: { vagasEsgotadas: boolean }) {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<Estado>({ fase: "preenchendo" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErros({});

    const resultado = schemaInscricao.safeParse({ nomeCompleto, email, telefone });
    if (!resultado.success) {
      const novosErros: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        novosErros[String(issue.path[0])] = issue.message;
      }
      setErros(novosErros);
      return;
    }

    setEstado({ fase: "enviando" });

    try {
      const resp = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultado.data),
      });

      const dados = await resp.json();

      if (!resp.ok) {
        setEstado({ fase: "erro", mensagem: dados.mensagem ?? "Não foi possível concluir a inscrição." });
        return;
      }

      if (dados.checkoutUrl) {
        setEstado({ fase: "redirecionando" });
        window.location.href = dados.checkoutUrl;
      } else {
        window.location.href = "/confirmacao?status=pending";
      }
    } catch {
      setEstado({ fase: "erro", mensagem: "Falha de conexão. Tente novamente." });
    }
  }

  if (vagasEsgotadas) {
    return (
      <div className="rounded-lg border border-grafite/30 bg-osso p-8 text-center">
        <p className="font-display text-xl text-preto">As 150 vagas foram preenchidas.</p>
        <p className="mt-2 text-grafite">
          Fique de olho no @capitao_rone para saber sobre próximas turmas.
        </p>
      </div>
    );
  }

  const enviando = estado.fase === "enviando" || estado.fase === "redirecionando";

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-md space-y-5">
      <div>
        <label htmlFor="nomeCompleto" className="mb-1.5 block text-sm font-medium text-preto">
          Nome completo
        </label>
        <input
          id="nomeCompleto"
          type="text"
          autoComplete="name"
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
          className="w-full rounded-md border border-grafite/30 bg-white px-4 py-3 text-texto outline-none focus:border-dourado"
          aria-invalid={Boolean(erros.nomeCompleto)}
          aria-describedby={erros.nomeCompleto ? "erro-nome" : undefined}
        />
        {erros.nomeCompleto && (
          <p id="erro-nome" className="mt-1 text-sm text-red-700">
            {erros.nomeCompleto}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-preto">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-grafite/30 bg-white px-4 py-3 text-texto outline-none focus:border-dourado"
          aria-invalid={Boolean(erros.email)}
          aria-describedby={erros.email ? "erro-email" : undefined}
        />
        {erros.email && (
          <p id="erro-email" className="mt-1 text-sm text-red-700">
            {erros.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-preto">
          WhatsApp
        </label>
        <input
          id="telefone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(98) 90000-0000"
          value={telefone}
          onChange={(e) => setTelefone(formatarWhatsapp(e.target.value))}
          className="w-full rounded-md border border-grafite/30 bg-white px-4 py-3 text-texto outline-none focus:border-dourado"
          aria-invalid={Boolean(erros.telefone)}
          aria-describedby={erros.telefone ? "erro-telefone" : undefined}
        />
        {erros.telefone && (
          <p id="erro-telefone" className="mt-1 text-sm text-red-700">
            {erros.telefone}
          </p>
        )}
      </div>

      {estado.fase === "erro" && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-md bg-preto px-6 py-4 font-display text-lg tracking-wide text-osso transition-colors hover:bg-preto-soft disabled:opacity-60"
      >
        {estado.fase === "redirecionando"
          ? "Redirecionando para o pagamento…"
          : estado.fase === "enviando"
            ? "Enviando…"
            : "Quero me inscrever"}
      </button>
    </form>
  );
}
