export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-dourado/20 bg-preto/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <span className="font-display text-lg font-semibold tracking-wide text-osso">
          ESPARTA
        </span>
        <a
          href="#inscricao"
          className="rounded-md border border-dourado px-4 py-2 text-sm font-medium text-dourado transition-colors hover:bg-dourado hover:text-preto"
        >
          Quero me inscrever
        </a>
      </div>
    </header>
  );
}
