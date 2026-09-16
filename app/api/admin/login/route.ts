import { NextRequest, NextResponse } from "next/server";
import { criarTokenAdmin, NOME_COOKIE_ADMIN } from "@/lib/adminAuth";
import { timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  const { senha } = await req.json().catch(() => ({ senha: "" }));
  const senhaEsperada = process.env.ADMIN_PASSWORD;

  if (!senhaEsperada) {
    return NextResponse.json(
      { mensagem: "Painel administrativo ainda não configurado (ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  const a = Buffer.from(String(senha ?? ""));
  const b = Buffer.from(senhaEsperada);
  const confere = a.length === b.length && timingSafeEqual(a, b);

  if (!confere) {
    return NextResponse.json({ mensagem: "Senha incorreta." }, { status: 401 });
  }

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(NOME_COOKIE_ADMIN, criarTokenAdmin(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return resposta;
}
