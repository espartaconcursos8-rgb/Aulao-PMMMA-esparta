import { sobreAulao } from "@/lib/config";

export default function SobreAulao() {
  return (
    <section className="mx-auto max-w-content px-5 py-16 sm:py-24">
      <div className="grid gap-10 sm:grid-cols-[220px_1fr]">
        <h2 className="font-display text-3xl font-semibold leading-tight text-preto sm:text-4xl">
          {sobreAulao.titulo}
        </h2>
        <div className="space-y-4 text-lg leading-relaxed text-texto/90">
          {sobreAulao.paragrafos.map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
