import "server-only";
import { createClient } from "@supabase/supabase-js";

export function criarClienteSupabaseServidor() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
