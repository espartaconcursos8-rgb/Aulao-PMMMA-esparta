import { z } from "zod";

function limparTelefone(valor: string) {
  return valor.replace(/\D/g, "");
}

export const schemaInscricao = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(5, "Informe o nome completo.")
    .max(150)
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/, "Use apenas letras e espaços.")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  telefone: z
    .string()
    .transform(limparTelefone)
    .refine((v) => v.length === 10 || v.length === 11, "WhatsApp inválido, use DDD + número."),
});

export type DadosInscricao = z.infer<typeof schemaInscricao>;
