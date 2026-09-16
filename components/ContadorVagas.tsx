"use client";

import { useEffect, useState } from "react";
import { criarClienteSupabaseNavegador } from "@/lib/supabase/client";
import { evento } from "@/lib/config";

type Props = {
  vagasIniciais: number;
  variante?: "banner" | "compacto";
};

export default function ContadorVagas({ vagasIniciais, variante = "banner" }: Props) {
  const [vagasDisponiveis, setVagasDisponiveis] = useState(vagasIniciais);

  useEffect(() => {
    let supabase;
    try {
      supabase = criarClienteSupabaseNavegador();
    } catch {
      return;
    }

    const canal = supabase
      .channel("contador-vagas-publico")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contador_vagas_publico",
          filter: "id=eq.1",
        },
        (payload) => {
          const novoValor = (payload.new as { vagas_disponiveis: number })
            .vagas_disponiveis;
          if (typeof novoValor === "number") {
            setVagasDisponiveis(novoValor);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const esgotado = vagasDisponiveis <= 0;
  const quaseEsgotado = !esgotado && vagasDisponiveis <= 20;

  if (variante === "compacto") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-dourado/40 bg-preto/60 px-4 py-2 text-sm text-osso">
        <span
          className={`h-2 w-2 rounded-full ${
            esgotado ? "bg-grafite" : quaseEsgotado ? "bg-dourado-bright animate-pulse" : "bg-dourado"
          }`}
        />
        {esgotado ? (
          <span>Vagas esgotadas</span>
        ) : (
          <span>
            <strong className="font-display text-dourado-bright">{vagasDisponiveis}</strong>{" "}
            de {evento.totalVagas} vagas disponíveis
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-sm uppercase tracking-wide text-osso/60">
        {esgotado ? "Inscrições encerradas" : "Vagas restantes"}
      </span>
      <span
        className={`font-display text-6xl font-semibold leading-none sm:text-7xl ${
          esgotado ? "text-osso/40" : "text-dourado-bright"
        }`}
      >
        {esgotado ? "0" : vagasDisponiveis}
      </span>
      <span className="text-sm text-osso/60">de {evento.totalVagas} vagas totais</span>
      {quaseEsgotado && (
        <span className="mt-2 rounded-full bg-dourado/10 px-3 py-1 text-xs font-medium text-dourado-bright">
          Últimas vagas
        </span>
      )}
    </div>
  );
}
