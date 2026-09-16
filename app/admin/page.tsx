"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const resp = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });

    setEnviando(false);

    if (!resp.ok) {
      const dados = await resp.json().catch(() => ({}));
      setErro(dados.mensagem ?? "Não foi possível entrar.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-preto px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <h1 className="text-center font-display text-2xl text-osso">Painel Esparta</h1>

        <div>
          <label htmlFor="senha" className="mb-1.5 block text-sm text-osso/70">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md border border-dourado/30 bg-preto-soft px-4 py-3 text-osso outline-none focus:border-dourado"
          />
        </div>

        {erro && (
          <p role="alert" className="text-sm text-red-400">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-md bg-dourado px-6 py-3 font-display text-preto disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
