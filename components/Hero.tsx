import ContadorVagas from "@/components/ContadorVagas";
import { evento } from "@/lib/config";

export default function Hero({ vagasDisponiveis }: { vagasDisponiveis: number }) {
  return (
    <section className="relative overflow-hidden bg-preto text-osso">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-dourado/10 blur-3xl"
      />

      <div className="mx-auto max-w-content px-5 py-20 sm:py-28">
        <p className="font-display text-sm uppercase tracking-[0.15em] text-dourado">
          Preparatório {evento.concurso}
        </p>

        <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
          {evento.nome}
          <span className="mt-2 block text-dourado-bright">{evento.subtitulo}</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-osso/80">
          Um dia de revisão intensiva para quem está na reta final rumo à farda da
          Polícia Militar do Maranhão.
        </p>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <a
            href="#inscricao"
            className="rounded-md bg-dourado px-8 py-4 font-display text-lg tracking-wide text-preto transition-transform hover:scale-[1.02] hover:bg-dourado-bright"
          >
            Quero me inscrever
          </a>
          <div className="rounded-lg border border-dourado/30 bg-preto-soft px-6 py-4">
            <ContadorVagas vagasIniciais={vagasDisponiveis} variante="compacto" />
          </div>
        </div>
      </div>
    </section>
  );
}
