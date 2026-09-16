import { evento } from "@/lib/config";

function Campo({ label, valor }: { label: string; valor: string }) {
  const definido = valor !== "A DEFINIR";
  return (
    <div className="border-l-2 border-dourado py-1 pl-5">
      <p className="text-sm uppercase tracking-wide text-grafite">{label}</p>
      <p
        className={`font-display text-2xl ${
          definido ? "text-preto" : "text-grafite/60"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}

export default function InfoPraticas() {
  return (
    <section className="mx-auto max-w-content px-5 py-16 sm:py-24">
      <h2 className="font-display text-3xl font-semibold text-preto sm:text-4xl">
        Data, horário e local
      </h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        <Campo label="Data" valor={evento.data} />
        <Campo label="Horário" valor={evento.horario} />
        <Campo label="Local" valor={evento.local} />
      </div>
      {evento.endereco !== "A DEFINIR" && (
        <p className="mt-6 pl-5 text-texto/80">{evento.endereco}</p>
      )}
    </section>
  );
}
