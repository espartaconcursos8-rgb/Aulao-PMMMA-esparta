"use client";

export default function BotaoExportar() {
  return (
    <a
      href="/api/admin/export"
      className="rounded-md bg-preto px-4 py-2 text-sm font-medium text-osso hover:bg-preto-soft"
    >
      Exportar Excel
    </a>
  );
}
