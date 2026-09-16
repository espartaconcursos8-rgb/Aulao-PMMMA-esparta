import Link from "next/link";

const conteudoPorStatus: Record<string, { titulo: string; mensagem: string }> = {
  success: {
    titulo: "Inscrição confirmada!",
    mensagem:
      "Seu pagamento foi aprovado e sua vaga no Aulão Esparta está garantida. Você receberá mais informações por e-mail e WhatsApp.",
  },
  pending: {
    titulo: "Inscrição recebida",
    mensagem:
      "Seus dados foram registrados. Assim que o pagamento for confirmado, sua vaga será garantida automaticamente.",
  },
  failure: {
    titulo: "Não foi possível concluir o pagamento",
    mensagem:
      "Houve um problema com o pagamento e sua vaga não foi garantida. Você pode tentar novamente.",
  },
};

export default function Confirmacao({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const conteudo = conteudoPorStatus[searchParams.status ?? "pending"] ?? conteudoPorStatus.pending;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-osso px-5 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold text-preto sm:text-4xl">
        {conteudo.titulo}
      </h1>
      <p className="mt-4 max-w-md text-texto/80">{conteudo.mensagem}</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-preto px-6 py-3 font-display text-osso hover:bg-preto-soft"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
