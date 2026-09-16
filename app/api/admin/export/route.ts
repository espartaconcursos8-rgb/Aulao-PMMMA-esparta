import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import { tokenAdminValido, NOME_COOKIE_ADMIN } from "@/lib/adminAuth";
import { criarClienteSupabaseServidor } from "@/lib/supabase/server";

export async function GET() {
  const token = cookies().get(NOME_COOKIE_ADMIN)?.value;
  if (!tokenAdminValido(token)) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const supabase = criarClienteSupabaseServidor();
  const { data: inscricoes, error } = await supabase
    .from("inscricoes")
    .select(
      "nome_completo, email, telefone, status_pagamento, vaga_confirmada, requer_estorno, valor, criado_em"
    )
    .order("criado_em", { ascending: false });

  if (error) {
    return NextResponse.json({ mensagem: error.message }, { status: 500 });
  }

  const linhas = (inscricoes ?? []).map((i) => ({
    "Nome completo": i.nome_completo,
    "E-mail": i.email,
    WhatsApp: i.telefone,
    "Status do pagamento": i.status_pagamento,
    "Vaga confirmada": i.vaga_confirmada ? "Sim" : "Não",
    "Requer estorno": i.requer_estorno ? "Sim" : "Não",
    Valor: i.valor,
    "Inscrito em": new Date(i.criado_em).toLocaleString("pt-BR"),
  }));

  const planilha = XLSX.utils.json_to_sheet(linhas);
  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, planilha, "Inscritos");
  const buffer = XLSX.write(livro, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="inscritos-aulao-esparta-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
