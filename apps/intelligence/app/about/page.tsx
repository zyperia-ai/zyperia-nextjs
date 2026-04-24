import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre — ZYPERIA Intelligence",
  description: "Playbooks de IA para quem executa. Sem hype, sem think pieces.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Sobre</span>
        <h1 className="h-display text-4xl md:text-6xl mb-8">
          Para quem prefere <span className="text-brand-gradient">executar em vez de teorizar.</span>
        </h1>

        <div className="prose-zyperia">
          <p>
            A ZYPERIA Intelligence é uma publicação para operadores — as pessoas
            dentro de empresas e negócios a solo que realmente têm de fazer a IA e
            a automação funcionar. Não os futuristas de IA. Não os influencers de
            prompts. As pessoas cujo trabalho depende de o workflow aguentar na
            segunda-feira de manhã.
          </p>

          <h2>O que publicamos</h2>
          <p>
            Playbooks, não ensaios. Cada automação sobre a qual escrevemos foi
            construída, implementada, e testada à pressão antes de publicarmos.
            Os screenshots são nossos. Os modos de falha estão documentados. Os
            custos são ditos à frente.
          </p>

          <p>
            Cobrimos LLMs em produção, automação de workflows (n8n, Make, Zapier,
            e cola à medida), agentes autónomos, stacks open-source (Ollama,
            Llama, Mistral, Phi), e o trabalho sujo de integração de ligar IA às
            ferramentas que a tua equipa recusa largar.
          </p>

          <h2>O que evitamos</h2>
          <ul>
            <li><strong>Think pieces.</strong> "O que isto significa para a humanidade" não é o nosso território.</li>
            <li><strong>Ciclos de hype.</strong> Se uma ferramenta tem três meses e não está provada, esperamos.</li>
            <li><strong>Manchetes "revolucionárias".</strong> Nada é revolucionário. Algumas coisas são úteis.</li>
            <li><strong>Listas de ferramentas.</strong> "Top 47 ferramentas de IA para 2026" é spam de SEO com um casaco bonito.</li>
          </ul>

          <h2>Padrão editorial</h2>
          <p>
            Se não conseguimos correr, não escrevemos. Cada peça começa a partir da
            dor real de um operador, não de uma ferramenta à procura de caso de uso.
            Os trade-offs — custo, fiabilidade, vendor lock-in, carga de manutenção
            — são ditos explicitamente, não enterrados ao fundo.
          </p>

          <h2>Como somos financiados</h2>
          <p>
            Relações de afiliado com plataformas que usamos genuinamente (Zapier,
            Make, OpenAI, Anthropic, Notion) e patrocínios da newsletter. Não
            vendemos cursos, cohorts, ou programas de "mastery". Detalhe completo
            na <Link href="/disclosure">nossa página de divulgação</Link>.
          </p>

          <h2>A rede ZYPERIA</h2>
          <p>
            A ZYPERIA Intelligence é parte de uma operação de três publicações, ao
            lado da <a href="https://crypto.zyperia.ai">ZYPERIA Crypto</a> (análise de activos digitais) e da{" "}
            <a href="https://onlinebiz.zyperia.ai">ZYPERIA OnlineBiz</a> (rendimento
            online, sem gurus). A mesma regra editorial nas três: não publicar o
            que não se consegue suportar com evidência.
          </p>

          <p>
            <Link href="/#newsletter">O Build Semanal chega todas as terças →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
