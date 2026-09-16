import "server-only";
import { criarClienteSupabaseServidor } from "@/lib/supabase/server";
import { evento } from "@/lib/config";

/**
 * Busca o número de vagas disponíveis no servidor, para renderizar o
 * valor correto já na primeira carga da página (sem esperar o Realtime).
 * Se o Supabase ainda não estiver configurado, cai no total cheio —
 * assim a página não quebra antes das variáveis de ambiente existirem.
 */
export async function obterVagasDisponiveis(): Promise<number> {
  try {
    const supabase = criarClienteSupabaseServidor();
    const { data, error } = await supabase
      .from("contador_vagas_publico")
      .select("vagas_disponiveis")
      .eq("id", 1)
      .single();

    if (error || !data) return evento.totalVagas;
    return data.vagas_disponiveis;
  } catch {
    return evento.totalVagas;
  }
}
