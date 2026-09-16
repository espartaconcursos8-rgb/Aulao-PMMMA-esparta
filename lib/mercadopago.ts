import "server-only";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { evento } from "@/lib/config";

export function pagamentoConfigurado(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

function obterCliente() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.");
  }
  return new MercadoPagoConfig({ accessToken });
}

type DadosPreferencia = {
  inscricaoId: string;
  nomeCompleto: string;
  email: string;
};

export async function criarPreferenciaPagamento({
  inscricaoId,
  nomeCompleto,
  email,
}: DadosPreferencia): Promise<{ initPoint: string; preferenceId: string }> {
  const client = obterCliente();
  const preference = new Preference(client);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL não configurado.");
  }

  const resultado = await preference.create({
    body: {
      items: [
        {
          id: "aulao-esparta-missao-aprovacao",
          title: `${evento.nome} — ${evento.subtitulo}`,
          quantity: 1,
          unit_price: evento.precoCentavos / 100,
          currency_id: "BRL",
        },
      ],
      payer: {
        name: nomeCompleto,
        email,
      },
      external_reference: inscricaoId,
      back_urls: {
        success: `${baseUrl}/confirmacao?status=success`,
        pending: `${baseUrl}/confirmacao?status=pending`,
        failure: `${baseUrl}/confirmacao?status=failure`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      statement_descriptor: "AULAO ESPARTA",
    },
  });

  if (!resultado.init_point || !resultado.id) {
    throw new Error("Mercado Pago não retornou init_point/id da preferência.");
  }

  return { initPoint: resultado.init_point, preferenceId: resultado.id };
}
