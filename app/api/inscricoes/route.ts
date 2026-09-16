import { NextRequest, NextResponse } from "next/server";
import { schemaInscricao } from "@/lib/validacao";
import { criarClienteSupabaseServidor } from "@/lib/supabase/server";
import { criarPreferenciaPagamento, pagamentoConfigurado } from "@/lib/mercadopago";
import { evento } from "@/lib/config";

export async function POST(req: NextRequest) {
  const corpo = await req.json().catch(() => null);
  const resultado = schemaInscricao.safeParse(corpo);

  if (!resultado.success) {
    return NextResponse.json(
      { mensagem: "Dados inválidos.", erros: resultado.error.flatten() },
      { status: 400 }
    );
  }

  const { nomeCompleto, email, telefone } = resultado.data;
  const supabase = criarClienteSupabaseServidor();

  const { data: contador } = await supabase
    .from("contador_vagas_publico")
    .select("vagas_disponiveis")
    .eq("id", 1)
    .single();

  if (contador && contador.vagas_disponiveis <= 0) {
    return NextResponse.json(
      { mensagem: "As vagas para o Aulão Esparta foram esgotadas." },
      { status: 409 }
    );
  }

  const { data: existente } = await supabase
    .from("inscricoes")
    .select("id")
    .eq("email", email)
    .eq("vaga_confirmada", true)
    .maybeSingle();

  if (existente) {
    return NextResponse.json(
      { mensagem: "Este e-mail já possui uma inscrição confirmada." },
      { status: 409 }
    );
  }

  const { data: inscricao, error: erroInsercao } = await supabase
    .from("inscricoes")
    .insert({
      nome_completo: nomeCompleto,
      email,
      telefone,
      valor: evento.precoCentavos / 100,
      status_pagamento: "pendente",
    })
    .select("id")
    .single();

  if (erroInsercao || !inscricao) {
    console.error("Erro ao criar inscrição:", erroInsercao);
    return NextResponse.json(
      { mensagem: "Não foi possível registrar sua inscrição. Tente novamente." },
      { status: 500 }
    );
  }

  if (!pagamentoConfigurado() || evento.precoCentavos <= 0) {
    return NextResponse.json({ inscricaoId: inscricao.id, checkoutUrl: null });
  }

  try {
    const { initPoint, preferenceId } = await criarPreferenciaPagamento({
      inscricaoId: inscricao.id,
      nomeCompleto,
      email,
    });

    await supabase
      .from("inscricoes")
      .update({ mp_preference_id: preferenceId })
      .eq("id", inscricao.id);

    return NextResponse.json({ inscricaoId: inscricao.id, checkoutUrl: initPoint });
  } catch (erro) {
    console.error("Erro ao criar preferência Mercado Pago:", erro);
    return NextResponse.json(
      { mensagem: "Inscrição registrada, mas houve falha ao iniciar o pagamento. Entraremos em contato." },
      { status: 502 }
    );
  }
}
