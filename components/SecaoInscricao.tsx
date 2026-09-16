import FormularioInscricao from "@/components/FormularioInscricao";
import { evento } from "@/lib/config";

export default function SecaoInscricao({ vagasDisponiveis }: { vagasDisponiveis: number }) {
  const precoDefinido = evento.precoCentavos > 0;

  return (
    <section id="inscricao" className="bg-osso py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5">
        <div className="mx-auto max-w-md text-center">
          <h2 className="font-display text-3xl font-semibold text-preto sm:text-4xl">
            Garanta sua vaga
          </h2>
          <p className="mt-3 text-texto/80">
            {precoDefinido
              ? "Preencha seus dados abaixo. Você será direcionado para o pagamento online em seguida."
              : "Preencha seus dados abaixo para garantir sua vaga."}
          </p>
        </div>

        <div className="mt-10">
          <FormularioInscricao vagasEsgotadas={vagasDisponiveis <= 0} />
        </div>
      </div>
    </section>
  );
}
