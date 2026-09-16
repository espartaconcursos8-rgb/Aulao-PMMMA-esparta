import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SobreAulao from "@/components/SobreAulao";
import Programacao from "@/components/Programacao";
import InfoPraticas from "@/components/InfoPraticas";
import VagasLimitadas from "@/components/VagasLimitadas";
import SecaoInscricao from "@/components/SecaoInscricao";
import Footer from "@/components/Footer";
import { obterVagasDisponiveis } from "@/lib/vagas";

export const dynamic = "force-dynamic";

export default async function Home() {
  const vagasDisponiveis = await obterVagasDisponiveis();

  return (
    <>
      <Header />
      <main>
        <Hero vagasDisponiveis={vagasDisponiveis} />
        <SobreAulao />
        <div className="divisor-dourado mx-auto max-w-content" />
        <Programacao />
        <InfoPraticas />
        <VagasLimitadas vagasDisponiveis={vagasDisponiveis} />
        <SecaoInscricao vagasDisponiveis={vagasDisponiveis} />
      </main>
      <Footer />
    </>
  );
}
