"use client";

import { useRouter } from "next/navigation";

export default function BotaoLogout() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="rounded-md border border-grafite/30 px-4 py-2 text-sm font-medium text-texto hover:bg-grafite/10"
    >
      Sair
    </button>
  );
}
