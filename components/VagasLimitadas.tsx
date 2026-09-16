import ContadorVagas from "@/components/ContadorVagas";
import { evento } from "@/lib/config";

export default function VagasLimitadas({ vagasDisponiveis }: { vagasDisponiveis: number }) {
  return (
    <section className="border-y border-dourado/30 bg-preto py-16 text-osso sm:py-20">
      <div className="mx-auto flex max-w-content flex-col items-center gap-8 px-5 text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          {evento.totalVagas} vagas limitadas
        </h2>
        <p className="max-w-md text-osso/70">
          As vagas são preenchidas por ordem de inscrição confirmada. Quando as{" "}
          {evento.totalVagas} vagas acabarem, as inscrições fecham automaticamente.
        </p>
        <div className="rounded-xl border border-dourado/30 bg-preto-soft px-10 py-8">
          <ContadorVagas vagasIniciais={vagasDisponiveis} variante="banner" />
        </div>
      </div>
    </section>
  );
}
