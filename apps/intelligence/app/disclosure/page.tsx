import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Divulgação de Afiliados — ZYPERIA Intelligence",
  description: "Que ferramentas nos pagam, e porque as recomendaríamos na mesma.",
};

export default function DisclosurePage() {
  const lastUpdated = "24 de Abril de 2026";

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Transparência</span>
        <h1 className="h-display text-4xl md:text-6xl mb-4">
          Como fazemos dinheiro.
        </h1>
        <div className="text-xs text-[var(--text-muted)] h-mono mb-12">
          Última actualização: {lastUpdated}
        </div>

        <div className="prose-zyperia">
          <p>
            Versão curta: comissões de afiliado de ferramentas que usaríamos na
            mesma, mais patrocínios de newsletter. Versão longa em baixo.
          </p>

          <h2>Links de afiliado</h2>
          <p>
            Quando recomendamos uma ferramenta ou plataforma, ligamo-la
            frequentemente com um <strong>link de afiliado</strong>. Se te
            registas ou pagas um plano através dele, recebemos uma comissão.{" "}
            <strong>Não te custa nada extra</strong>, e na maioria dos casos a
            plataforma dá-te o mesmo trial ou desconto que darias directamente.
          </p>

          <h2>Com quem temos relações de afiliado</h2>
          <ul>
            <li><strong>Zapier</strong> — automação de workflows. Comissão sobre registos em planos pagos.</li>
            <li><strong>Make</strong> (anteriormente Integromat) — plataforma de automação. Comissão sobre planos pagos.</li>
            <li><strong>OpenAI</strong> — créditos API e referências de ChatGPT Plus/Team.</li>
            <li><strong>Anthropic</strong> — referências de Claude Pro/Team.</li>
            <li><strong>Notion</strong> — 10% de comissão recorrente em referências de planos pagos.</li>
          </ul>
          <p>
            Podemos adicionar outros parceiros ao longo do tempo — plataformas de
            automação, tooling de LLMs, ferramentas de observability — mas apenas
            as que usamos activamente ou testámos em produção. Alterações
            reflectidas aqui nos 7 dias.
          </p>

          <h2>Porque é que isto realmente funciona</h2>
          <p>
            Só recomendamos ferramentas que usamos ou que testámos à pressão. Se a
            comissão existisse mas a ferramenta fosse má, não cobriríamos —
            porque os leitores que se importam com isto apanham-no numa semana e
            perdemos algo muito mais caro do que comissão: credibilidade.
          </p>
          <p>Regras operacionais:</p>
          <ul>
            <li>Estatuto de afiliado nunca torna a cobertura positiva. Já escrevemos criticamente sobre plataformas às quais ligamos.</li>
            <li>Cobrimos e comparamos ferramentas às quais não estamos afiliados sempre que façam parte da resposta honesta.</li>
            <li>Cada artigo com links de afiliado tem divulgação explícita no topo.</li>
            <li>Quando uma plataforma degrada (alterações de preço, quebras de fiabilidade, enshittification), largamos a relação de afiliado antes de largar a crítica.</li>
          </ul>

          <h2>O que não vendemos</h2>
          <ul>
            <li><strong>Cursos ou cohorts.</strong> Não existe um "Programa de Mastery de IA" de €1.997 atrás de uma aba escondida. Nunca vai existir.</li>
            <li><strong>Serviços de consultoria.</strong> Se oferecermos consultoria no futuro, será numa marca própria, não parafusada à publicação.</li>
            <li><strong>Playbooks patrocinados.</strong> Um vendor não pode pagar para ser o tema de um playbook. Escolhemos o que vale a pena escrever.</li>
          </ul>

          <h2>Patrocínios de newsletter</h2>
          <p>
            A newsletter <em>O Build Semanal</em> pode ocasionalmente incluir uma
            secção patrocinada claramente identificada ("Patrocinado por X"). A
            parte patrocinada está isolada do playbook editorial — o playbook em
            si nunca é patrocinado.
          </p>

          <h2>Publicidade</h2>
          <p>
            Podemos activar publicidade display (ex. Google AdSense) em algum
            momento no futuro. Se o fizermos, os anúncios serão claramente
            marcados e priorizaremos colocações não-intrusivas.
          </p>

          <h2>Questões ou preocupações</h2>
          <p>
            Se algo se ler como influenciado — uma review que não combina com a
            tua experiência com uma ferramenta, um trade-off que parecemos ter
            passado por cima — diz-nos:{" "}
            <a href="mailto:hi@zyperia.ai?subject=Transparencia">hi@zyperia.ai</a>
            {/* TODO: trocar por editorial@zyperia.ai quando mailbox for criada */}
            .
          </p>

          <p>
            Ver também: <Link href="/privacy">Política de Privacidade</Link> ·{" "}
            <Link href="/terms">Termos de Serviço</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
