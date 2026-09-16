import { NextResponse } from "next/server";
import { NOME_COOKIE_ADMIN } from "@/lib/adminAuth";

export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.delete(NOME_COOKIE_ADMIN);
  return resposta;
}
