import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { tokenAdminValido, NOME_COOKIE_ADMIN } from "@/lib/adminAuth";
import { criarClienteSupabaseServidor } from "@/lib/supabase/server";
import BotaoLogout from "@/components/admin/BotaoLogout";
import BotaoExportar from "@/components/admin/BotaoExportar";

export const dynamic = "force-dynamic";

const rotuloStatus: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  recusado: "Recusado",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

const corStatus: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  aprovado: "bg-green-100 text-green-800",
  recusado: "bg-red-100 text-red-800",
  cancelado: "bg-grafite/20 text-grafite",
  expirado: "bg-grafite/20 text-grafite",
};

export default async function Dashboard() {
  const token = cookies().get(NOME_COOKIE_ADMIN)?.value;
  if (!tokenAdminValido(token)) {
    redirect("/admin");
  }

  const supabase = criarClienteSupabaseServidor();
  const { data: inscricoes, error } = await supabase
    .from("inscricoes")
    .select(
      "id, nome_completo, email, telefone, status_pagamento, vaga_confirmada, requer_estorno, valor, criado_em"
    )
    .order("criado_em", { ascending: false });

  const { data: contador } = await supabase
    .from("contador_vagas_publico")
    .select("vagas_disponiveis, total_vagas")
    .eq("id", 1)
    .single();

  const totalEstornos = (inscricoes ?? []).filter((i) => i.requer_estorno).length;

  return (
    <main className="min-h-screen bg-osso px-5 py-10">
      <div className="mx-auto max-w-content">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-preto">Inscritos — Aulão Esparta</h1>
            <p className="mt-1 text-sm text-grafite">
              {contador
                ? `${contador.total_vagas - contador.vagas_disponiveis} confirmadas de ${contador.total_vagas} vagas`
                : "Contador de vagas indisponível"}
            </p>
          </div>
          <div className="flex gap-3">
            <BotaoExportar />
            <BotaoLogout />
          </div>
        </div>

        {totalEstornos > 0 && (
          <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {totalEstornos} pagamento(s) aprovado(s) além do limite de vagas — requer estorno manual.
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            Erro ao carregar inscritos: {error.message}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-lg border border-grafite/20 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-grafite/20 bg-osso text-grafite">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Vaga</th>
                <th className="px-4 py-3 font-medium">Inscrito em</th>
              </tr>
            </thead>
            <tbody>
              {(inscricoes ?? []).map((i) => (
                <tr key={i.id} className="border-b border-grafite/10 last:border-0">
                  <td className="px-4 py-3">{i.nome_completo}</td>
                  <td className="px-4 py-3">{i.email}</td>
                  <td className="px-4 py-3">{i.telefone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        corStatus[i.status_pagamento] ?? "bg-grafite/20 text-grafite"
                      }`}
                    >
                      {rotuloStatus[i.status_pagamento] ?? i.status_pagamento}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {i.vaga_confirmada ? "Confirmada" : i.requer_estorno ? "Estorno pendente" : "—"}
                  </td>
                  <td className="px-4 py-3 text-grafite">
                    {new Date(i.criado_em).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
              {(inscricoes ?? []).length === 0 && !error && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-grafite">
                    Nenhuma inscrição ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
