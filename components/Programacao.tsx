import { programacao } from "@/lib/config";

export default function Programacao() {
  return (
    <section className="bg-osso py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5">
        <h2 className="font-display text-3xl font-semibold text-preto sm:text-4xl">
          Programação
        </h2>

        <div className="mt-10 divide-y divide-grafite/20 border-y border-grafite/20">
          {programacao.map((item, i) => (
            <div key={i} className="grid gap-2 py-6 sm:grid-cols-[160px_1fr] sm:gap-8">
              <span className="font-display text-sm uppercase tracking-wide text-dourado-dim">
                {item.horario}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium text-preto">{item.titulo}</h3>
                <p className="mt-1 text-texto/80">{item.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
