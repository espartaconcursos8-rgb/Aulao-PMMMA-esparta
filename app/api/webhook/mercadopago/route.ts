import { NextRequest, NextResponse } from "next/server";
import { Payment, MercadoPagoConfig } from "mercadopago";
import { criarClienteSupabaseServidor } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ ok: true, ignorado: "pagamento não configurado" });
  }

  const corpo = await req.json().catch(() => null);

  const paymentId: string | undefined = corpo?.data?.id ?? corpo?.id;
  const tipo: string | undefined = corpo?.type ?? corpo?.topic;

  if (!paymentId || (tipo && tipo !== "payment")) {
    return NextResponse.json({ ok: true, ignorado: true });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const pagamento = await new Payment(client).get({ id: paymentId });

    const inscricaoId = pagamento.external_reference;
    if (!inscricaoId) {
      return NextResponse.json({ ok: true, ignorado: "sem external_reference" });
    }

    const supabase = criarClienteSupabaseServidor();

    if (pagamento.status === "approved") {
      const { error } = await supabase.rpc("confirmar_pagamento", {
        p_id: inscricaoId,
        p_mp_payment_id: String(pagamento.id),
        p_mp_status_detail: pagamento.status_detail ?? null,
      });
      if (error) throw error;
    } else {
      const statusMap: Record<string, string> = {
        rejected: "recusado",
        cancelled: "cancelado",
        refunded: "cancelado",
        charged_back: "cancelado",
        in_process: "pendente",
        pending: "pendente",
      };
      await supabase
        .from("inscricoes")
        .update({
          status_pagamento: statusMap[pagamento.status ?? ""] ?? "pendente",
          mp_payment_id: String(pagamento.id),
          mp_status_detail: pagamento.status_detail ?? null,
        })
        .eq("id", inscricaoId);
    }

    return NextResponse.json({ ok: true });
  } catch (erro) {
    console.error("Erro no webhook do Mercado Pago:", erro);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
