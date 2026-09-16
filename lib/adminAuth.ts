import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const NOME_COOKIE = "esparta_admin_session";

function segredo(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET não configurado.");
  return s;
}

export function criarTokenAdmin(): string {
  return createHmac("sha256", segredo()).update("admin-esparta").digest("hex");
}

export function tokenAdminValido(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const esperado = Buffer.from(criarTokenAdmin());
    const recebido = Buffer.from(token);
    return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
  } catch {
    return false;
  }
}

export const NOME_COOKIE_ADMIN = NOME_COOKIE;
